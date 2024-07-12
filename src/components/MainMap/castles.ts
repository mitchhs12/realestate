import { FeatureCollection, Point } from "geojson";

export type CastleFeatureProps = {
  name: string;
  wikipedia: string;
  wikidata: string;
};

export type CastlesGeojson = FeatureCollection<Point, CastleFeatureProps>;

export async function loadCastlesGeojson(): Promise<CastlesGeojson> {
  const url = "/castles.json";

  return await fetch(url).then((res) => res.json());
}
