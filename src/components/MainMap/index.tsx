"use client";
import React, { useEffect, useCallback, useContext } from "react";
import { APIProvider, Map, InfoWindow } from "@vis.gl/react-google-maps";
import { InfoWindowContent } from "@/components/MainMap/InfoWindowContent";
import { useState } from "react";
import { useTheme } from "next-themes";
import darkMap from "./map-styles/dark-map";
import lightMap from "./map-styles/light-map";
import { CoordinatesType, BoundsType, TypeObject } from "@/lib/validations";
import { HomesGeoJson } from "@/lib/validations";
import { Feature, Point } from "geojson";
import { ClusteredMarkers } from "@/components/MainMap/ClusteredMarkers";
import lookup from "country-code-lookup";
import { QueryContext } from "@/context/QueryContext";
import { FlagComponent } from "../ui/phone-input";
import { Country } from "react-phone-number-input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import BrokenPrice from "../BrokenPrice";
import { LocaleContext } from "@/context/LocaleContext";
import Link from "next/link";
import { findMatching } from "@/lib/utils";

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
  const { currentHome, query, user } = useContext(QueryContext);
  const { defaultCurrency } = useContext(LocaleContext);

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
    <div className="flex flex-col w-full items-center justify-center">
      <APIProvider apiKey={apiKey} onLoad={mapLoaded}>
        {!isMapLoading && (
          <Map
            clickableIcons={false}
            gestureHandling={"greedy"}
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

            {infowindowData && (
              <InfoWindow
                headerContent={
                  infowindowData.features.length === 1 ? (
                    <div className="flex items-center gap-3">
                      {infowindowData &&
                        infowindowData.features[0].properties &&
                        infowindowData.features[0].properties.country && (
                          <FlagComponent
                            width={"w-9"}
                            height={"h-6"}
                            country={lookup.byIso(infowindowData.features[0].properties?.country)?.iso2 as Country}
                            countryName={infowindowData.features[0].properties?.country}
                          />
                        )}
                      <Link href={`/homes/${infowindowData.features[0].properties?.id}`} target={"_blank"}>
                        <div className="flex flex-col justify-between">
                          {(() => {
                            console.log(typesObject);
                            const matchingTypes = findMatching(
                              typesObject,
                              infowindowData.features[0].properties,
                              "type"
                            );
                            return (
                              <span className="text-sm">
                                {matchingTypes[0].translation}
                                {matchingTypes.length > 1 &&
                                  ` (+${new Intl.NumberFormat().format(matchingTypes.length - 1)})`}
                              </span>
                            );
                          })()}
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <BrokenPrice
                                  priceUsd={infowindowData.features[0].properties?.priceUsd}
                                  newCurrencySymbol={defaultCurrency.symbol}
                                  newCurrencyUsdPrice={defaultCurrency.usdPrice}
                                  reveal={user ? true : false}
                                  blurAmount="blur-sm"
                                  className="text-md hover:cursor-pointer font-light"
                                />
                              </TooltipTrigger>
                              {!user && (
                                <TooltipContent className="flex justify-center items-center">
                                  <p>{loginToViewPrice}</p>
                                </TooltipContent>
                              )}
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </Link>
                    </div>
                  ) : (
                    `${new Intl.NumberFormat().format(infowindowData.features.length)} ${propertiesText}`
                  )
                }
                onClose={hamdleInfoWindowClose}
                anchor={infowindowData.anchor}
              >
                <InfoWindowContent
                  features={infowindowData.features}
                  otherCategories={otherCategories}
                  typesObject={typesObject}
                />
              </InfoWindow>
            )}
          </Map>
        )}
      </APIProvider>
    </div>
  );
}
