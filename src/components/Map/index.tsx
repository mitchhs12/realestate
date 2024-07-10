"use client";
import { useEffect, useCallback } from "react";
import { APIProvider, Map, AdvancedMarker, Pin } from "@vis.gl/react-google-maps";
import { useState } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import darkMap from "./map-styles/dark-map";
import lightMap from "./map-styles/light-map";
import { CoordinatesType } from "@/lib/validations";
import DeckGL from "@deck.gl/react";

import { IconLayer } from "@deck.gl/layers";
import { MapView } from "@deck.gl/core";
import IconClusterLayer from "@/components/Map/icon-cluster-layer";
import type { IconClusterLayerPickingInfo } from "@/components/Map/icon-cluster-layer";
import type { PickingInfo, MapViewState } from "@deck.gl/core";
import type { IconLayerProps } from "@deck.gl/layers";

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
  const showCluster = true;
  const iconAtlas = "/data/icons.png";
  const iconMapping = "/data/data.json";
  const data = "https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/icon/meteorites.json";
  const { resolvedTheme: theme } = useTheme();
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [mapConfig, setMapConfig] = useState<MapConfig>(theme === "dark" ? MAP_CONFIGS[1] : MAP_CONFIGS[0]);
  const [hoverInfo, setHoverInfo] = useState<IconClusterLayerPickingInfo<Meterite> | null>(null);
  const hideToolTip = useCallback(() => {
    setHoverInfo(null);
  }, []);

  const expandTooltip = useCallback(
    (info: PickingInfo) => {
      if (info.picked && showCluster) {
        setHoverInfo(info);
      } else {
        setHoverInfo(null);
      }
    },
    [showCluster]
  );

  useEffect(() => {
    if (theme) {
      console.log("running use Effect!");
      console.log("theme", theme);
      setMapConfig(theme === "dark" ? MAP_CONFIGS[1] : MAP_CONFIGS[0]);
    }
  }, [MAP_CONFIGS, theme]);

  const MAP_VIEW = new MapView({ repeat: false });
  const INITIAL_VIEW_STATE: MapViewState = {
    longitude: coordinates.long,
    latitude: coordinates.lat,
    zoom: 16,
    maxZoom: 20,
    pitch: 0,
    bearing: 0,
  };

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return <div>Google Maps API key is missing</div>;
  }

  const mapLoaded = () => {
    setIsMapLoading(false);
  };

  type Meterite = {
    coordinates: [longitude: number, latitude: number];
    name: string;
    class: string;
    mass: number;
    year: number;
  };

  const layerProps: IconLayerProps<Meterite> = {
    id: "icon",
    data,
    pickable: true,
    getPosition: (d) => d.coordinates,
    iconAtlas,
    iconMapping,
  };

  if (hoverInfo === null || !hoverInfo.objects) {
    layerProps.onHover = setHoverInfo;
  }

  const layer = showCluster
    ? new IconClusterLayer({ ...layerProps, id: "icon-cluster", sizeScale: 40 })
    : new IconLayer({
        ...layerProps,
        id: "icon",
        getIcon: (d) => "marker",
        sizeUnits: "meters",
        sizeScale: 2000,
        sizeMinPixels: 6,
      });

  console.log("layer", layer);

  return (
    <div className="flex flex-col w-full h-full items-center justify-center">
      <APIProvider apiKey={apiKey} onLoad={mapLoaded}>
        {isMapLoading ? (
          <div className="flex items-center justify-center text-lg lg:text-3xl">
            <ReloadIcon className="mr-2 h-4 w-4 lg:h-8 lg:w-8 animate-spin" />
            Loading...
          </div>
        ) : (
          <div className="relative w-full h-full">
            <DeckGL
              initialViewState={INITIAL_VIEW_STATE}
              views={MAP_VIEW}
              layers={[layer]}
              controller={{ dragRotate: false }}
              onViewStateChange={hideToolTip}
              onClick={expandTooltip}
            >
              <Map
                defaultCenter={{ lat: coordinates.lat, lng: coordinates.long }}
                defaultZoom={16}
                disableDefaultUI={true}
                mapId={mapConfig.mapId || null}
                mapTypeId={mapConfig.mapTypeId}
                styles={mapConfig.styles}
                reuseMaps={true}
              ></Map>
            </DeckGL>
          </div>
        )}
      </APIProvider>
    </div>
  );
}
