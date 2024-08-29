"use client";
import { HomeContext } from "@/context/HomeContext";
import { useContext } from "react";
import MapComponent from "@/components/SmallMap";

export default function SmallMapWrapper() {
  const { home } = useContext(HomeContext);
  return <MapComponent currentHome={home} coordinates={{ long: home.longitude, lat: home.latitude }} disabled={true} />;
}
