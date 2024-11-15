"use client";
import { useEffect, useCallback, useState, useContext } from "react";
import { APIProvider, Map, Marker, MapCameraChangedEvent, MapCameraProps } from "@vis.gl/react-google-maps";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import darkMap from "@/components/CombinedSearchPage/MainMap/map-styles/dark-map";
import lightMap from "@/components/CombinedSearchPage/MainMap/map-styles/light-map";
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
  usePin,
  editMode,
  setNewHome,
  setNextLoading,
  setPrevLoading,
  setSaveDisabled,
}: {
  currentHome: HomeType | null;
  coordinates: CoordinatesType;
  disabled?: boolean;
  usePin: boolean;
  editMode?: boolean;
  setNewHome?: (value: HomeType) => void;
  setNextLoading?: (value: boolean) => void;
  setPrevLoading?: (value: boolean) => void;
  setSaveDisabled?: (value: boolean) => void;
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
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [cameraPos, setCameraPos] = useState<CoordinatesType>({ lat: 0, long: 0 });
  const [newZoom, setNewZoom] = useState(disabled ? 16 : 17);

  const INITIAL_CAMERA = {
    center: { lat: coordinates.lat, lng: coordinates.long },
    zoom: newZoom,
  };

  const [cameraProps, setCameraProps] = useState<MapCameraProps>(INITIAL_CAMERA);

  useEffect(() => {
    setCameraProps({ center: { lat: coordinates.lat, lng: coordinates.long }, zoom: newZoom });
  }, [coordinates]);

  const getAddress = async (lat: number, lng: number, usePin: boolean) => {
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
    console.log("new pin to be set", usePin);
    currentHome &&
      setNewHome &&
      setNewHome({
        ...currentHome,
        address: data.results?.Label,
        municipality: data.results?.Municipality,
        subRegion: data.results?.SubRegion,
        region: data.results?.Region,
        country: data.results?.Country, // ISO 3166 Alpha 3 Code
        longitude: data.location[0],
        latitude: data.location[1],
        exactLocation: usePin,
      });
    if (setNextLoading && setPrevLoading) {
      setNextLoading(false);
      setPrevLoading(false);
    } else if (setSaveDisabled) {
      setSaveDisabled(false);
    }
  };

  const setLoading = () => {
    if (setNextLoading && setPrevLoading) {
      setNextLoading(true);
      setPrevLoading(true);
    } else if (setSaveDisabled) {
      setSaveDisabled(true);
    }
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
      setLoading();
      setCameraPos({ lat: ev.detail.center.lat, long: ev.detail.center.lng });
      setCameraProps({ center: { lat: ev.detail.center.lat, lng: ev.detail.center.lng }, zoom: ev.detail.zoom });
      debouncedGetAddress(ev.detail.center.lat, ev.detail.center.lng, usePin);
    },
    [debouncedGetAddress]
  );

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return <div>Google Maps API key is missing</div>;
  }

  const mapLoaded = () => {
    setIsMapLoading(false);
  };

  return (
    <div className={`flex flex-col w-full items-center justify-center ${editMode && "hover:cursor-pointer"}`}>
      <APIProvider apiKey={apiKey} onLoad={mapLoaded}>
        {isMapLoading ? (
          <div className="flex items-center justify-center text-lg lg:text-3xl">
            <ReloadIcon className="mr-2 h-4 w-4 lg:h-8 lg:w-8 animate-spin" />
            Loading...
          </div>
        ) : (
          <div
            className={`rounded-lg overflow-hidden h-full w-full shadow-lg dark:shadow-white/15 ${editMode && "hover:cursor-pointer"}`}
          >
            <Map
              clickableIcons={false}
              gestureHandling={editMode ? "none" : "greedy"}
              defaultCenter={{ lat: coordinates.lat, lng: coordinates.long }}
              maxZoom={20}
              zoomControl={editMode ? false : true}
              scrollwheel={editMode ? false : true}
              minZoom={6}
              onZoomChanged={(num) => {
                setNewZoom(num.detail.zoom);
              }}
              backgroundColor={theme === "dark" ? "black" : "white"}
              {...cameraProps}
              disableDefaultUI={true}
              mapId={theme === "dark" ? MAP_CONFIGS[1].mapId : MAP_CONFIGS[0].mapId}
              mapTypeId={theme === "dark" ? MAP_CONFIGS[1].mapTypeId : MAP_CONFIGS[0].mapTypeId}
              reuseMaps={true}
              onCameraChanged={handleCameraChanged}
            >
              {usePin ? (
                <Marker
                  position={
                    disabled
                      ? { lat: coordinates.lat, lng: coordinates.long }
                      : { lat: cameraPos.lat, lng: cameraPos.long }
                  }
                />
              ) : (
                <Circle
                  radius={300}
                  center={
                    disabled
                      ? { lat: coordinates.lat, lng: coordinates.long }
                      : { lat: cameraPos.lat, lng: cameraPos.long }
                  }
                  strokeColor={"#16A34A"}
                  strokeOpacity={1}
                  strokeWeight={3}
                  fillColor="#16A34A"
                  fillOpacity={0.3}
                />
              )}
            </Map>
          </div>
        )}
      </APIProvider>
    </div>
  );
}
