import React, { useCallback } from "react";
import { AdvancedMarker, useAdvancedMarkerRef } from "@vis.gl/react-google-maps";
import { LogoSvg } from "@/components/CombinedSearchPage/MainMap/LogoSvg";

type TreeClusterMarkerProps = {
  clusterId: number;
  onMarkerClick?: (marker: google.maps.marker.AdvancedMarkerElement, clusterId: number) => void;
  position: google.maps.LatLngLiteral;
  size: number;
  sizeAsText: string;
  theme?: string;
};

export const FeaturesClusterMarker = ({
  position,
  size,
  sizeAsText,
  onMarkerClick,
  clusterId,
  theme,
}: TreeClusterMarkerProps) => {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const handleClick = useCallback(
    () => onMarkerClick && onMarkerClick(marker!, clusterId),
    [onMarkerClick, marker, clusterId]
  );
  const markerSize = Math.floor(48 + Math.sqrt(size) * 2);

  return (
    <AdvancedMarker
      ref={markerRef}
      position={position}
      zIndex={size}
      onClick={handleClick}
      className={"marker cluster"}
      style={{ width: markerSize, height: markerSize }}
    >
      <LogoSvg />
      <div className={`text-xs ${theme === "dark" ? "text-white" : "text-black"} pb-1`}>{sizeAsText}</div>
    </AdvancedMarker>
  );
};
