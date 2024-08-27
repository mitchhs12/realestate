"use client";
import { useEffect, useCallback, useState, useContext } from "react";
import { APIProvider, Map, Marker, MapCameraChangedEvent, MapCameraProps } from "@vis.gl/react-google-maps";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import darkMap from "@/components/MainMap/map-styles/dark-map";
import lightMap from "@/components/MainMap/map-styles/light-map";
import { CoordinatesType } from "@/lib/validations";
import { SellContext } from "@/context/SellContext";
import { HomeType } from "@/lib/validations";
import { Circle } from "@/components/SmallMap/Circle";

export type MapConfig = {
  id: string;
  label: string;
  mapId?: string;
  mapTypeId?: string;
  styles?: google.maps.MapTypeStyle[];
  disabled?: boolean;
};

const MapTypeId = {
  HYBRID: "hybrid",
  ROADMAP: "roadmap",
  SATELLITE: "satellite",
  TERRAIN: "terrain",
};

export default function MapComponent({
  coordinates,
  currentHome,
  disabled,
}: {
  currentHome: HomeType | null;
  coordinates: CoordinatesType;
  disabled?: boolean;
}) {
  const MAP_CONFIGS: MapConfig[] = [
    {
      id: "light",
      mapId: "7707a4d5591d6f35",
      label: "Light",
      mapTypeId: MapTypeId.ROADMAP,
      styles: lightMap,
    },
    {
      id: "dark",
      label: "Dark",
      mapId: "66e8c712a9e09ae1",
      mapTypeId: MapTypeId.ROADMAP,
      styles: darkMap,
    },
  ];

  const { resolvedTheme: theme } = useTheme();
  const { setNewHome, setNextLoading, setPrevLoading } = useContext(SellContext);
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [mapConfig, setMapConfig] = useState<MapConfig>(theme === "dark" ? MAP_CONFIGS[1] : MAP_CONFIGS[0]);
  const [cameraPos, setCameraPos] = useState<CoordinatesType>({ lat: 0, long: 0 });
  const [newZoom, setNewZoom] = useState(17);

  const INITIAL_CAMERA = {
    center: { lat: coordinates.lat, lng: coordinates.long },
    zoom: newZoom,
  };

  const [cameraProps, setCameraProps] = useState<MapCameraProps>(INITIAL_CAMERA);

  useEffect(() => {
    setCameraProps({ center: { lat: coordinates.lat, lng: coordinates.long }, zoom: newZoom });
  }, [coordinates]);

  const getAddress = async (lat: number, lng: number) => {
    const result = await fetch("/api/getAddress", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        longLatArray: [lng, lat],
      }),
    });
    const data = await result.json();
    console.log("Data Response", data);
    currentHome &&
      setNewHome({
        ...currentHome,
        address: data.results.Label,
        municipality: data.results.Municipality,
        subRegion: data.results.SubRegion,
        region: data.results.Region,
        country: data.results.Country, // ISO 3166 Alpha 3 Code
        longitude: data.location[0],
        latitude: data.location[1],
      });
    setNextLoading(false);
    setPrevLoading(false);
  };

  const debounce = (func: (...args: any[]) => void, delay: number) => {
    let timer: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const debouncedGetAddress = useCallback(debounce(getAddress, 200), []);

  const handleCameraChanged = useCallback(
    (ev: MapCameraChangedEvent) => {
      setNextLoading(true);
      setPrevLoading(true);
      setCameraPos({ lat: ev.detail.center.lat, long: ev.detail.center.lng });
      setCameraProps({ center: { lat: ev.detail.center.lat, lng: ev.detail.center.lng }, zoom: ev.detail.zoom });
      debouncedGetAddress(ev.detail.center.lat, ev.detail.center.lng);
    },
    [debouncedGetAddress]
  );

  useEffect(() => {
    if (theme) {
      console.log("running use Effect!");
      console.log("theme", theme);
      setMapConfig(theme === "dark" ? MAP_CONFIGS[1] : MAP_CONFIGS[0]);
    }
  }, [theme]);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return <div>Google Maps API key is missing</div>;
  }

  const mapLoaded = () => {
    setIsMapLoading(false);
  };

  return (
    <div className="flex flex-col w-full items-center justify-center">
      <APIProvider apiKey={apiKey} onLoad={mapLoaded}>
        {isMapLoading ? (
          <div className="flex items-center justify-center text-lg lg:text-3xl">
            <ReloadIcon className="mr-2 h-4 w-4 lg:h-8 lg:w-8 animate-spin" />
            Loading...
          </div>
        ) : (
          <Map
            clickableIcons={false}
            gestureHandling={"greedy"}
            defaultCenter={{ lat: coordinates.lat, lng: coordinates.long }}
            maxZoom={20}
            minZoom={6}
            onZoomChanged={(num) => {
              setNewZoom(num.detail.zoom);
            }}
            {...cameraProps}
            disableDefaultUI={true}
            mapId={mapConfig.mapId || null}
            mapTypeId={mapConfig.mapTypeId}
            reuseMaps={true}
            onCameraChanged={handleCameraChanged}
          >
            {disabled ? (
              <Circle
                radius={150}
                center={{ lat: coordinates.lat, lng: coordinates.long }}
                strokeColor={"green"}
                strokeOpacity={1}
                strokeWeight={3}
                fillColor="#16A34A"
                fillOpacity={0.3}
              />
            ) : (
              <Marker position={{ lat: cameraPos.lat, lng: cameraPos.long }} />
            )}
          </Map>
        )}
      </APIProvider>
    </div>
  );
}
