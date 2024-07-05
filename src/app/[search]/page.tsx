import MapList from "@/components/MapList";

export default async function Page() {
  return (
    <main className="flex flex-col-reverse h-screen-minus-header lg:flex-row justify-end ">
      <MapList />
    </main>
  );
}
