"use client";
import React, { useEffect, useCallback, useContext } from "react";
import { APIProvider, Map, InfoWindow } from "@vis.gl/react-google-maps";
import { InfoWindowContent } from "@/components/MainMap/InfoWindowContent";
import { useState } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import darkMap from "./map-styles/dark-map";
import lightMap from "./map-styles/light-map";
import { CoordinatesType, BoundsType } from "@/lib/validations";
import { HomesGeoJson } from "@/lib/validations";
import { Feature, Point } from "geojson";
import { ClusteredMarkers } from "@/components/MainMap/ClusteredMarkers";

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

interface Props {
  coordinates: CoordinatesType;
  existingBounds: BoundsType | null;
  setBounds: React.Dispatch<React.SetStateAction<BoundsType | null>>;
  homesGeoJson: HomesGeoJson | null;
  isMapLoading: boolean;
  setIsMapLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function MapComponent({
  coordinates,
  existingBounds,
  setBounds,
  homesGeoJson,
  isMapLoading,
  setIsMapLoading,
}: Props) {
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
  const [numClusters, setNumClusters] = useState(0);
  const [mapConfig, setMapConfig] = useState<MapConfig>(theme === "dark" ? MAP_CONFIGS[1] : MAP_CONFIGS[0]);
  const [boundsTimeout, setBoundsTimeout] = useState<NodeJS.Timeout | null>(null);

  const areBoundsEqual = (bounds1: BoundsType | null, bounds2: BoundsType | null): boolean => {
    if (bounds1 === bounds2) return true;
    if (!bounds1 || !bounds2) return false;

    return (
      bounds1.south === bounds2.south &&
      bounds1.west === bounds2.west &&
      bounds1.north === bounds2.north &&
      bounds1.east === bounds2.east
    );
  };

  const handleBoundsChanged = (bounds: { detail: { bounds: BoundsType | null } }) => {
    if (boundsTimeout) {
      clearTimeout(boundsTimeout);
    }

    const timeoutId = setTimeout(() => {
      if (!areBoundsEqual(existingBounds, bounds.detail.bounds)) {
        setBounds(bounds.detail.bounds);
      }
    }, 600);

    setBoundsTimeout(timeoutId);
  };

  const [infowindowData, setInfowindowData] = useState<{
    anchor: google.maps.marker.AdvancedMarkerElement;
    features: Feature<Point>[];
  } | null>(null);

  const hamdleInfoWindowClose = useCallback(() => setInfowindowData(null), [setInfowindowData]);

  useEffect(() => {
    if (theme) {
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
            gestureHandling={"greedy"}
            onBoundsChanged={handleBoundsChanged}
            defaultCenter={{ lat: coordinates.lat, lng: coordinates.long }}
            zoom={newZoom !== 16 ? newZoom : 16}
            maxZoom={20}
            minZoom={3}
            onZoomChanged={(num) => {
              setNewZoom(num.detail.zoom);
            }}
            disableDefaultUI={true}
            mapId={mapConfig.mapId || null}
            mapTypeId={mapConfig.mapTypeId}
            reuseMaps={true}
            className={`custom-marker-clustering-map ${theme === "dark" ? "dark-mode" : "light-mode"}`}
          >
            {homesGeoJson && (
              <ClusteredMarkers
                geojson={homesGeoJson}
                setNumClusters={setNumClusters}
                setInfowindowData={setInfowindowData}
                theme={theme}
              />
            )}

            {infowindowData && (
              <InfoWindow
                headerContent={`${
                  infowindowData.features.length === 1
                    ? infowindowData.features[0].properties?.name
                    : `${new Intl.NumberFormat().format(infowindowData.features.length)} Properties`
                }`}
                onClose={hamdleInfoWindowClose}
                anchor={infowindowData.anchor}
              >
                <InfoWindowContent features={infowindowData.features} theme={theme} />
              </InfoWindow>
            )}
          </Map>
        )}
      </APIProvider>
    </div>
  );
}
