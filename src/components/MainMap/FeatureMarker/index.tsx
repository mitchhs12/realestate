import { useState, useCallback } from "react";
import { AdvancedMarker, useAdvancedMarkerRef } from "@vis.gl/react-google-maps";
import { typeIcons } from "@/components/Icons/typeIcons";
import { TypeObject } from "@/lib/validations";
import MultiTypeButton from "@/components/MultiTypeButton";

type TreeMarkerProps = {
  position: google.maps.LatLngLiteral;
  listingType: string;
  featureId: string;
  onMarkerClick?: (marker: google.maps.marker.AdvancedMarkerElement, featureId: string) => void;
  matchingTypes: { id: string; name: string; translation: string }[];
};

export const FeatureMarker = ({ position, listingType, featureId, onMarkerClick, matchingTypes }: TreeMarkerProps) => {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [currentType, setCurrentType] = useState<TypeObject | null>(matchingTypes[0]);

  const IconComponent = typeIcons[currentType?.id as keyof typeof typeIcons]; // Get the corresponding icon
  // const IconComponent = typeIcons[type.id as keyof typeof typeIcons]; // Get the corresponding icon

  const handleClick = useCallback(
    () => onMarkerClick && onMarkerClick(marker!, featureId),
    [onMarkerClick, marker, featureId]
  );

  return (
    <AdvancedMarker ref={markerRef} position={position} onClick={handleClick} className={`marker feature`}>
      <div className="flex justify-center items-center">
        <MultiTypeButton
          types={matchingTypes}
          currentType={currentType}
          setCurrentType={setCurrentType}
          className="absolute bottom-0.5 rounded-full disabled:opacity-100"
          width={30}
          height={30}
          color={listingType === "premium" ? "#fbbf24" : "#16A34A"}
          variant={"none"}
          disabled={null}
        />
      </div>
    </AdvancedMarker>
  );
};
