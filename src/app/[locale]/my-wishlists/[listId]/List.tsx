import { HomeType } from "@/lib/validations";
import ResizableCard from "@/components/ResizableCard";
import { findMatching } from "@/lib/utils";

export default function List({
  list,
  types,
  premiumText,
}: {
  list: any;
  types: { id: string; name: string; translation: string }[];
  premiumText: string;
}) {
  return (
    <div className="flex flex-col max-w-8xl h-full w-full">
      <div className="flex flex-col items-center w-full pb-8">
        <div className="flex w-full h-full justify-center text-2xl items-center py-8">
          <h1>{list.name}</h1>
        </div>
      </div>
      <div className="px-8 pb-4 overflow-y-auto grid grid-cols-1 2xs:grid-cols-1 grid-rows-2 w-full h-full xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:grid-rows-1 xl:grid-cols-5 xl:grid-rows-1 justify-center items-center gap-y-12 gap-x-6">
        {list.homes.map((home: HomeType) => {
          const updatedHome = { ...home, isFavoritedByUser: true };
          const matchingTypes = findMatching(types, home, "type");
          return (
            <div key={home.id} className="shadow-lg dark:shadow-white/10 rounded-lg">
              <ResizableCard home={updatedHome} types={matchingTypes} premiumText={premiumText} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
