"use client";
import React, { useEffect } from "react";
import { APIProvider, Map, AdvancedMarker, Pin } from "@vis.gl/react-google-maps";
import { useState } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import darkMap from "./map-styles/dark-map";
import lightMap from "./map-styles/light-map";

interface Props {
  searchLocation: { lat: number; lng: number };
}

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

export default function MapComponent() {
  const MAP_CONFIGS: MapConfig[] = [
    {
      id: "light",
      label: "Light",
      mapTypeId: MapTypeId.ROADMAP,
      styles: lightMap,
    },
    {
      id: "dark",
      label: "Dark",
      mapTypeId: MapTypeId.ROADMAP,
      styles: darkMap,
    },
  ];
  const { resolvedTheme: theme } = useTheme();
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [mapConfig, setMapConfig] = useState<MapConfig>(theme === "dark" ? MAP_CONFIGS[1] : MAP_CONFIGS[0]);

  useEffect(() => {
    console.log("running use Effect!");
    console.log("theme", theme);
    setMapConfig(theme === "dark" ? MAP_CONFIGS[1] : MAP_CONFIGS[0]);
  }, [theme]);

  const CustomizedMarker = () => (
    <AdvancedMarker position={{ lat: 53.54992, lng: 10.00678 }}>
      <Pin background={"#FBBC04"} glyphColor={"#000"} borderColor={"#000"} />
    </AdvancedMarker>
  );

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return <div>Google Maps API key is missing</div>;
  }

  const mapLoaded = () => {
    console.log("Map loaded!");
    setIsMapLoading(false);
  };

  return (
    <div className="flex flex-col w-full h-full justify-center items-center">
      <APIProvider apiKey={apiKey} onLoad={mapLoaded}>
        {isMapLoading ? (
          <div className="flex items-center justify-center">
            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            Loading...
          </div>
        ) : (
          <Map
            defaultZoom={5}
            defaultCenter={{ lat: 22.54992, lng: 0 }}
            disableDefaultUI={true}
            mapId={mapConfig.mapId || null}
            mapTypeId={mapConfig.mapTypeId}
            styles={mapConfig.styles}
            reuseMaps={true}
          ></Map>
        )}
      </APIProvider>
    </div>
  );
}
