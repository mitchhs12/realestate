import { Metadata } from "next";
import HomePhotos from "@/components/HomePhotos";
import { getHomeById } from "@/app/[locale]/homes/actions";
import HomeText from "@/components/HomeText";
import Footer from "@/components/Footer";
import StickyPrice from "@/components/StickyPrice";
import MapComponent from "@/components/SmallMap";
import { Separator } from "@/components/ui/separator";
import { getScopedI18n } from "@/locales/server";
import { features, types } from "@/lib/sellFlowData";
import { findMatching } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Homes",
};

export default async function Page({ params }: { params: { homeId: string } }) {
  const [home, h, f, t] = await Promise.all([
    getHomeById(params.homeId),
    getScopedI18n("homes"),
    getScopedI18n("sell.features"),
    getScopedI18n("sell.type"),
  ]);

  const capacityText = { single: h("capacity.single"), plural: h("capacity.plural") };
  const capacityTitle = h("capacity-title");
  const roomsTitle = h("rooms-title");
  const featuresTitle = h("features-title");
  const locationTitle = h("location-title");
  const priceTitle = h("price-title");
  const originalPrice = h("original-price");
  const negotiable = h("negotiable");
  const sizeTitle = h("size-title");

  const bedrooms = { single: h("bedrooms.single"), plural: h("bedrooms.plural") };
  const bathrooms = { single: h("bathrooms.single"), plural: h("bathrooms.plural") };
  const livingRooms = { single: h("living-rooms.single"), plural: h("living-rooms.plural") };
  const kitchens = { single: h("kitchens.single"), plural: h("kitchens.plural") };

  const units = { m: h("units.m"), ft: h("units.ft") };

  const showAllPhotos = h("show-all-photos");

  const showPrice = h("price-button.show");
  const hidePrice = h("price-button.hide");
  const mobilePrice = h("price-button.mobile");

  const contactTitle = h("contact.contact-title");
  const contactTitleMobile = h("contact.contact-title-mobile");
  const contactNameText = h("contact.name");
  const contactEmailText = h("contact.email");
  const contactPhoneText = h("contact.phone");
  const contactButton = h("contact.contact-button");

  const featuresObject = Array.from({ length: 26 }, (_, index) => ({
    id: features[index],
    translation: f(`options.${index}` as keyof typeof f),
  }));

  const typesObject = Array.from({ length: 17 }, (_, index) => ({
    id: types[index],
    translation: t(`options.${index}` as keyof typeof t),
  }));

  const matchingTypes = findMatching(typesObject, home, "type");
  const matchingFeatures = findMatching(featuresObject, home, "features");

  if (home) {
    return (
      <div className="flex flex-col justify-between min-h-screen-minus-header-svh items-center">
        <main className="flex flex-col items-center justify-start max-w-7xl w-full">
          <div className="flex flex-col text-center h-full w-full pt-8 pb-2">
            <h1 className="flex justify-center text-3xl">{home.title}</h1>
            <HomePhotos home={home} showAllPhotos={showAllPhotos} />
          </div>
          <div className="flex flex-col text-center h-full w-full">
            <HomeText
              home={home}
              units={units}
              capacityText={capacityText}
              capacityTitle={capacityTitle}
              roomsTitle={roomsTitle}
              featuresTitle={featuresTitle}
              priceTitle={priceTitle}
              originalPrice={originalPrice}
              negotiable={negotiable}
              sizeTitle={sizeTitle}
              showPrice={showPrice}
              hidePrice={hidePrice}
              contactTitle={contactTitle}
              contactNameText={contactNameText}
              contactEmailText={contactEmailText}
              contactPhoneText={contactPhoneText}
              contactButton={contactButton}
              matchingTypes={matchingTypes}
              matchingFeatures={matchingFeatures}
              bedroomsText={bedrooms}
              bathroomsText={bathrooms}
              livingroomsText={livingRooms}
              kitchensText={kitchens}
            />
            <div className="py-6 px-8">
              <Separator />
            </div>
          </div>
          <div className="flex flex-col max-w-7xl w-full h-[40vh] px-8 py-2 gap-3 mb-16">
            <div className="text-lg sm:text-xl">{locationTitle}</div>
            <div className="flex w-full max-w-7xl h-[40vh]">
              <MapComponent
                coordinates={{ long: home.longitude, lat: home.latitude }}
                currentHome={home}
                disabled={true}
              />
            </div>
          </div>
        </main>
        <footer className="flex justify-center items-center p-6 w-full bg-muted">
          <Footer />
        </footer>
        <div className="sticky sm:hidden bottom-0 bg-white w-full h-full text-center">
          <StickyPrice
            home={home}
            contactNameText={contactNameText}
            contactEmailText={contactEmailText}
            contactPhoneText={contactPhoneText}
            mobilePrice={mobilePrice}
            contactTitleMobile={contactTitleMobile}
            contactButton={contactButton}
          />
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <main>
          <div className="flex justify-center text-xl">Something went wrong fetching this home.</div>
        </main>
        <footer className="flex justify-center items-center p-6 w-full bg-muted">
          <Footer />
        </footer>
      </div>
    );
  }
}
