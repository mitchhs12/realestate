import { FeatureCollection, Point } from "geojson";

export type HomeFeatureProps = {
  name: string | null;
  address: string | null;
  description: string | null;
  type: string[];
  features: string[];
  price: number;
  bedrooms: number;
  bathrooms: number;
  livingrooms: number;
  kitchens: number;
  capacity: number;
  photos: string[];
  contactName: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
};

export type HomesGeoJson = FeatureCollection<Point, HomeFeatureProps>;
