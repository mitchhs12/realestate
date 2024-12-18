import React, { Ref, useCallback, useEffect } from "react";
import Supercluster, { ClusterProperties } from "supercluster";
import { FeaturesClusterMarker } from "@/components/CombinedSearchPage/MainMap/FeaturesClusterMarker";
import { FeatureMarker } from "@/components/CombinedSearchPage/MainMap/FeatureMarker";
import { useSupercluster } from "@/hooks/use-supercluster";
import { Feature, FeatureCollection, GeoJsonProperties, Point } from "geojson";
import { typeIcons } from "@/components/Icons/typeIcons";
import { findMatching } from "@/lib/utils";

type InfoWindowData = {
  anchor: google.maps.marker.AdvancedMarkerElement;
  features: Feature<Point, GeoJsonProperties>[];
} | null;

type ClusteredMarkersProps = {
  geojson: FeatureCollection<Point>;
  setNumClusters: (n: number) => void;
  setInfowindowData: React.Dispatch<React.SetStateAction<InfoWindowData | null>>;
  theme?: string;
  typesObject: { id: string; name: string; translation: string }[];
};

const superclusterOptions: Supercluster.Options<GeoJsonProperties, ClusterProperties> = {
  extent: 256,
  radius: 80,
  maxZoom: 20,
};

export const ClusteredMarkers = ({
  geojson,
  setNumClusters,
  setInfowindowData,
  theme,
  typesObject,
}: ClusteredMarkersProps) => {
  const { clusters, getLeaves } = useSupercluster(geojson, superclusterOptions);

  useEffect(() => {
    setNumClusters(clusters.length);
  }, [setNumClusters, clusters.length]);

  const handleMarkerClick = useCallback(
    (marker: google.maps.marker.AdvancedMarkerElement, featureId: string) => {
      setInfowindowData((prev: InfoWindowData) => {
        if (prev?.anchor === marker) {
          return prev; // Do nothing if clicking the same marker
        }
        const feature = clusters.find((feat) => feat.id === featureId) as Feature<Point, GeoJsonProperties>;
        return { anchor: marker, features: [feature] };
      });
    },
    [clusters, setInfowindowData]
  );

  const handleClusterClick = useCallback(
    (marker: google.maps.marker.AdvancedMarkerElement, clusterId: number) => {
      setInfowindowData((prev: InfoWindowData) => {
        if (prev?.anchor === marker) {
          return prev; // Do nothing if clicking the same cluster
        }
        const leaves = getLeaves(clusterId);
        return { anchor: marker, features: leaves };
      });
    },
    [getLeaves, setInfowindowData]
  );

  return (
    <>
      {clusters.map((feature: any) => {
        const [lng, lat] = feature.geometry.coordinates;

        const clusterProperties = feature.properties as ClusterProperties;
        const isCluster: boolean = clusterProperties.cluster;

        if (isCluster) {
          return (
            <FeaturesClusterMarker
              key={feature.id}
              clusterId={clusterProperties.cluster_id}
              position={{ lat, lng }}
              size={clusterProperties.point_count}
              sizeAsText={String(clusterProperties.point_count_abbreviated)}
              onMarkerClick={handleClusterClick}
              theme={theme}
            />
          );
        } else {
          const matchingTypes = findMatching(typesObject, feature.properties, "type");
          return (
            <FeatureMarker
              key={feature.id}
              listingType={feature.properties.listingType}
              featureId={feature.id as string}
              position={{ lat, lng }}
              onMarkerClick={handleMarkerClick}
              matchingTypes={matchingTypes}
            />
          );
        }
      })}
    </>
  );
};
