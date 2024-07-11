"use client";
import { useEffect, useCallback, useContext } from "react";
import { APIProvider, Map, InfoWindow } from "@vis.gl/react-google-maps";
import { InfoWindowContent } from "@/components/InfoWindowContent";
import { useState } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import darkMap from "./map-styles/dark-map";
import lightMap from "./map-styles/light-map";
import { CoordinatesType } from "@/lib/validations";
import { loadCastlesGeojson, CastlesGeojson } from "./castles";
import { Feature, Point } from "geojson";
import { ClusteredMarkers } from "@/components/ClusteredMarkers";

import { QueryContext } from "@/context/QueryContext";

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

export default function MapComponent({ coordinates }: { coordinates: CoordinatesType }) {
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
  const { newZoom, setNewZoom } = useContext(QueryContext);
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [numClusters, setNumClusters] = useState(0);
  const [mapConfig, setMapConfig] = useState<MapConfig>(theme === "dark" ? MAP_CONFIGS[1] : MAP_CONFIGS[0]);
  const [geojson, setGeojson] = useState<CastlesGeojson | null>(null);
  useEffect(() => {
    void loadCastlesGeojson().then((data) => setGeojson(data));
  }, []);

  const [infowindowData, setInfowindowData] = useState<{
    anchor: google.maps.marker.AdvancedMarkerElement;
    features: Feature<Point>[];
  } | null>(null);

  const hamdleInfoWindowClose = useCallback(() => setInfowindowData(null), [setInfowindowData]);

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
            defaultCenter={{ lat: coordinates.lat, lng: coordinates.long }}
            zoom={newZoom !== 16 ? newZoom : 16}
            maxZoom={20}
            minZoom={2}
            onZoomChanged={(num) => {
              setNewZoom(num.detail.zoom);
            }}
            disableDefaultUI={true}
            mapId={mapConfig.mapId || null}
            mapTypeId={mapConfig.mapTypeId}
            reuseMaps={true}
            className={"custom-marker-clustering-map"}
            //styles={mapConfig.styles}
          >
            {geojson && (
              <ClusteredMarkers
                geojson={geojson}
                setNumClusters={setNumClusters}
                setInfowindowData={setInfowindowData}
              />
            )}
            {infowindowData && (
              <InfoWindow onClose={hamdleInfoWindowClose} anchor={infowindowData.anchor}>
                <InfoWindowContent features={infowindowData.features} />
              </InfoWindow>
            )}
          </Map>
        )}
      </APIProvider>
    </div>
  );
}
