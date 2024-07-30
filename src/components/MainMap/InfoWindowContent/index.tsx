import React, { memo } from "react";
import { Feature, Point } from "geojson";
import { HomeFeatureProps } from "@/components/MainMap/homes";

type InfowindowContentProps = {
  features: Feature<Point>[];
  theme?: string;
};

const numFmt = new Intl.NumberFormat();

const InfoWindowContent = memo(({ features, theme }: InfowindowContentProps) => {
  if (features.length === 1) {
    const f = features[0];
    const props = f.properties! as HomeFeatureProps;

    return (
      <div className="flex flex-col text-xs p-5">
        <p>
          <a href={getDetailsUrl(props)} target="_blank">
            View details
          </a>
        </p>
      </div>
    );
  }

  return (
    <div className={`text-xs flex flex-col mr-2 pb-2`}>
      <ul>
        {features.slice(0, 5).map((feature) => {
          const props = feature.properties! as HomeFeatureProps;

          return (
            <li key={feature.id}>
              <a href={getDetailsUrl(props)} target="_blank">
                {props.name}
              </a>
            </li>
          );
        })}

        {features.length > 5 && <li>and {numFmt.format(features.length - 5)} more...</li>}
      </ul>
    </div>
  );
});

InfoWindowContent.displayName = "InfoWindowContent";
export { InfoWindowContent };

function getDetailsUrl(props: HomeFeatureProps) {
  return "https://www.google.com";
  // return props.wikipedia ? getWikipediaUrl(props.wikipedia) : getWikidataUrl(props.wikidata);
}
function getWikipediaUrl(contentId: string) {
  const [lang, title] = contentId.split(":");

  return `https://${lang}.wikipedia.org/wiki/${title.replace(/ /g, "_")}`;
}
function getWikidataUrl(id: string) {
  return `https://www.wikidata.org/wiki/${id}`;
}
