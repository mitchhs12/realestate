import CombinedSearchPage from "@/components/CombinedSearchPage";
import { CoordinatesType } from "@/lib/validations";

export default async function Page({ params }: { params: { search: string } }) {
  const AWS_LOCATION_SERVICE_ENDPOINT = process.env.AWS_LOCATION_SERVICE_ENDPOINT;
  const INDEX_NAME = process.env.AWS_LOCATION_INDEX_NAME;
  const API_KEY = process.env.AWS_MAPS_API_KEY; // Replace with your API key
  const language = "en";

  console.log("aws location", AWS_LOCATION_SERVICE_ENDPOINT);
  console.log("index name", INDEX_NAME);
  console.log("api key", API_KEY);

  const response = await fetch(
    `${AWS_LOCATION_SERVICE_ENDPOINT}/places/v0/indexes/${INDEX_NAME}/places/${params.search}?key=${API_KEY}&language=${language}`
  );

  const fullResponse = await response.json();
  console.log("fullResponse", fullResponse);
  const longLatArray = fullResponse.Place.Geometry.Point;
  const coordinates: CoordinatesType = { lat: longLatArray[1], long: longLatArray[0] };

  if (response.status === 200) {
    return (
      <main className="flex flex-col-reverse h-screen-minus-header lg:flex-row justify-end ">
        <CombinedSearchPage coordinates={coordinates} />
      </main>
    );
  } else {
    return (
      <div className="flex justify-center text-xl">
        Something went wrong fetching your location: {(response.status, response.statusText)}
      </div>
    );
  }
}
