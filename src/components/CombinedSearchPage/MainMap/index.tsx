"use client";
import React, { useEffect, useCallback, useContext } from "react";
import { APIProvider, Map, InfoWindow } from "@vis.gl/react-google-maps";
import { InfoWindowContent } from "@/components/CombinedSearchPage/MainMap/InfoWindowContent";
import { useState } from "react";
import { useTheme } from "next-themes";
import darkMap from "./map-styles/dark-map";
import lightMap from "./map-styles/light-map";
import { CoordinatesType, BoundsType, TypeObject } from "@/lib/validations";
import { HomesGeoJson } from "@/lib/validations";
import { Feature, GeoJsonProperties, Point } from "geojson";
import { ClusteredMarkers } from "@/components/CombinedSearchPage/MainMap/ClusteredMarkers";
import { QueryContext } from "@/context/QueryContext";
import { LocaleContext } from "@/context/LocaleContext";

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
  initZoom: number | null;
  typesObject: { id: string; name: string; translation: string }[];
  loginToViewPrice: string;
  propertiesText: string;
  otherCategories: string;
  zoomText: string;
}

export default function MapComponent({
  coordinates,
  existingBounds,
  setBounds,
  homesGeoJson,
  isMapLoading,
  setIsMapLoading,
  initZoom,
  typesObject,
  loginToViewPrice,
  propertiesText,
  otherCategories,
  zoomText,
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
  const [numClusters, setNumClusters] = useState(0);
  const [boundsTimeout, setBoundsTimeout] = useState<NodeJS.Timeout | null>(null);
  const { currentHome, query } = useContext(QueryContext);
  const { defaultCurrency, user } = useContext(LocaleContext);

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

  type InfoWindowData = {
    anchor: google.maps.marker.AdvancedMarkerElement;
    features: Feature<Point, GeoJsonProperties>[];
  } | null;

  const [infowindowData, setInfowindowData] = useState<InfoWindowData>(null);

  const handleInfoWindowClose = useCallback(() => {
    setInfowindowData((prev) => {
      if (prev === null) return prev; // Prevent clearing if already updating
      return null;
    });
  }, [setInfowindowData]);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return <div>Google Maps API key is missing</div>;
  }

  const mapLoaded = () => {
    setIsMapLoading(false);
  };

  const defaultCenter =
    currentHome && currentHome.address === query
      ? { lat: currentHome.latitude, lng: currentHome.longitude }
      : { lat: coordinates.lat, lng: coordinates.long };

  return (
    <div className="w-full h-full items-center justify-center">
      <APIProvider apiKey={apiKey} onLoad={mapLoaded}>
        {!isMapLoading && (
          <Map
            clickableIcons={false}
            gestureHandling={"greedy"}
            onClick={() => setInfowindowData(null)} // Close InfoWindow on map click
            onBoundsChanged={handleBoundsChanged}
            defaultCenter={defaultCenter}
            defaultZoom={initZoom ? initZoom : 16}
            maxZoom={19}
            minZoom={3}
            disableDefaultUI={true}
            mapId={theme === "dark" ? MAP_CONFIGS[1].mapId : MAP_CONFIGS[0].mapId}
            mapTypeId={theme === "dark" ? MAP_CONFIGS[1].mapTypeId : MAP_CONFIGS[0].mapTypeId}
            backgroundColor={theme === "dark" ? "black" : "white"}
            reuseMaps={true}
            className={`custom-marker-clustering-map ${theme === "dark" ? "dark-mode" : "light-mode"}`}
          >
            {homesGeoJson && (
              <ClusteredMarkers
                geojson={homesGeoJson}
                setNumClusters={setNumClusters}
                setInfowindowData={setInfowindowData}
                theme={theme}
                typesObject={typesObject}
              />
            )}

            {infowindowData && defaultCurrency && (
              <InfoWindow
                headerDisabled={true}
                headerContent={`${new Intl.NumberFormat().format(infowindowData.features.length)} ${propertiesText}`}
                anchor={infowindowData.anchor}
              >
                <InfoWindowContent
                  zoomText={zoomText}
                  features={infowindowData.features}
                  otherCategories={otherCategories}
                  typesObject={typesObject}
                  user={user}
                  defaultCurrency={defaultCurrency}
                  loginToViewPrice={loginToViewPrice}
                />
              </InfoWindow>
            )}
          </Map>
        )}
      </APIProvider>
    </div>
  );
}
