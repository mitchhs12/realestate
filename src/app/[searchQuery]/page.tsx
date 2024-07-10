import CombinedSearchPage from "@/components/CombinedSearchPage";
import { CoordinatesType } from "@/lib/validations";

export default async function Page({ params }: { params: { searchQuery: string } }) {
  const response = await fetch("/api/getLatLongCoords", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    body: params.searchQuery,
  });

  const coordinates: CoordinatesType = await response.json();

  return (
    <main className="flex flex-col-reverse h-screen-minus-header lg:flex-row justify-end ">
      <CombinedSearchPage coordinates={coordinates} />
    </main>
  );
}
