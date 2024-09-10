import React, { Ref, useCallback, useEffect } from "react";
import Supercluster, { ClusterProperties } from "supercluster";
import { FeaturesClusterMarker } from "@/components/MainMap/FeaturesClusterMarker";
import { FeatureMarker } from "@/components/MainMap/FeatureMarker";
import { useSupercluster } from "@/hooks/use-supercluster";
import { Feature, FeatureCollection, GeoJsonProperties, Point } from "geojson";
import { typeIcons } from "@/components/Icons/typeIcons";
import { findMatching } from "@/lib/utils";

type ClusteredMarkersProps = {
  geojson: FeatureCollection<Point>;
  setNumClusters: (n: number) => void;
  setInfowindowData: (
    data: {
      anchor: google.maps.marker.AdvancedMarkerElement;
      features: Feature<Point>[];
    } | null
  ) => void;
  theme?: string;
  typesObject: { id: string; name: string; translation: string }[];
};

const superclusterOptions: Supercluster.Options<GeoJsonProperties, ClusterProperties> = {
  extent: 256,
  radius: 80,
  maxZoom: 12,
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

  const handleClusterClick = useCallback(
    (marker: google.maps.marker.AdvancedMarkerElement, clusterId: number) => {
      const leaves = getLeaves(clusterId);

      setInfowindowData({ anchor: marker, features: leaves });
    },
    [getLeaves, setInfowindowData]
  );

  const handleMarkerClick = useCallback(
    (marker: google.maps.marker.AdvancedMarkerElement, featureId: string) => {
      const feature = clusters.find((feat) => feat.id === featureId) as Feature<Point>;

      setInfowindowData({ anchor: marker, features: [feature] });
    },
    [clusters, setInfowindowData]
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
