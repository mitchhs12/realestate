import Image from "next/image";
import PropertiesCreated from "./PropertiesCreated";
import PropertyValue from "./PropertyValue";
import PropertyDistribution from "./PropertyDistribution";

export default async function DataPageContent({ locale }: { locale: string }) {
  return (
    <div className="flex flex-col justify-center items-center w-full flex-grow">
      <div className="grid grid-cols-1 lg:grid-cols-2 w-full h-full gap-4 justify-start p-8 items-start max-w-8xl">
        <PropertiesCreated />
        <PropertyValue />
        <PropertyDistribution />
      </div>
    </div>
  );
}
