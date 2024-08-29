import React, { memo, useContext } from "react";
import { Feature, Point } from "geojson";
import { HomeFeatureProps } from "@/lib/validations";
import Link from "next/link";
import { QueryContext } from "@/context/QueryContext";

type InfowindowContentProps = {
  features: Feature<Point>[];
  theme?: string;
};

const numFmt = new Intl.NumberFormat();

const InfoWindowContent = memo(({ features }: InfowindowContentProps) => {
  const { isSmallScreen } = useContext(QueryContext);
  const linkTarget = isSmallScreen ? "_self" : "_blank";

  if (features.length === 1) {
    const f = features[0];
    const props = f.properties! as HomeFeatureProps;

    return (
      <div className="flex flex-col text-sm p-5">
        <p>
          <Link href={getDetailsUrl(f.id)} target={linkTarget}>
            View details
          </Link>
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
              <Link href={getDetailsUrl(feature.id)} target={linkTarget}>
                {props.name}
              </Link>
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

function getDetailsUrl(id: string | number | undefined) {
  return `/homes/${id}`;
  // return props.wikipedia ? getWikipediaUrl(props.wikipedia) : getWikidataUrl(props.wikidata);
}
