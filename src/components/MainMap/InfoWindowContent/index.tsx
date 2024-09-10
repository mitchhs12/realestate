import { useState, memo, useMemo } from "react";
import { Feature, Point } from "geojson";
import { HomeFeatureProps } from "@/lib/validations";
import Image from "next/image";
import Link from "next/link";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

type InfowindowContentProps = {
  features: Feature<Point>[];
  otherCategories: string;
  typesObject: { id: string; name: string; translation: string }[];
};

const numFmt = new Intl.NumberFormat();
const InfoWindowContent = memo(({ features, otherCategories, typesObject }: InfowindowContentProps) => {
  const [hovering, setHovering] = useState(false);

  const typeCount = useMemo(() => {
    if (features.length === 1) return null;
    return features.reduce(
      (acc, feature) => {
        const props = feature.properties as HomeFeatureProps;
        props.type.forEach((type) => {
          acc[type] = (acc[type] || 0) + 1;
        });
        return acc;
      },
      {} as Record<string, number>
    );
  }, [features]);

  if (features.length === 1) {
    const f = features[0];
    const props = f.properties! as HomeFeatureProps;

    return (
      <div className="flex flex-col justify-center items-center w-full min-w-[200px] text-sm p-1">
        <Carousel className="h-full w-full">
          <CarouselContent>
            {props.photos.map((photo: string, index) => (
              <CarouselItem key={index} className="flex justify-center items-center h-full w-full">
                <div className={`relative justify-center items-center h-[150px] w-full`}>
                  <Link
                    href={getDetailsUrl(f.id)}
                    target={"_blank"}
                    className="w-full"
                    onMouseOver={() => setHovering(true)}
                  >
                    <Image
                      src={photo}
                      className={`object-cover object-center`}
                      alt={`${props.type} photo ${index}`}
                      fill={true}
                      loading={"lazy"}
                      placeholder={"blur"}
                      blurDataURL="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mMUW+ylBgADBQErtZO4YAAAAABJRU5ErkJggg=="
                      sizes="
                        (max-width: 400px) 400px,
                        (max-width: 510px) 510px,
                        (max-width: 768px) 768px, 
                        (max-width: 1024px) 1024px, 
                        (max-width: 1280px) 1280px, 
                        (max-width: 1536px) 1536px,
                        (max-width: 1920px) 1920px,
                        100vw"
                    />
                  </Link>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className={`${hovering ? "flex" : "hidden"} absolute left-6 size-8`} />
          <CarouselNext className={`${hovering ? "flex" : "hidden"} absolute right-6 size-8 border-2`} />
        </Carousel>
      </div>
    );
  } else {
    return (
      <div className={`text-sm flex flex-col pb-3 pl-3`}>
        <ul>
          {typeCount &&
            Object.entries(typeCount)
              .slice(0, 5)
              .map(([type, count]) => (
                <li key={type}>
                  {new Intl.NumberFormat().format(count)} {typesObject.find((t) => t.name === type)?.translation}
                </li>
              ))}
        </ul>
        {typeCount && Object.entries(typeCount).length > 5 && (
          <div>
            {Object.entries(typeCount).length - 5} {otherCategories}
          </div>
        )}
      </div>
    );
  }
});

InfoWindowContent.displayName = "InfoWindowContent";
export { InfoWindowContent };

function getDetailsUrl(id: string | number | undefined) {
  return `/homes/${id}`;
  // return props.wikipedia ? getWikipediaUrl(props.wikipedia) : getWikidataUrl(props.wikidata);
}
