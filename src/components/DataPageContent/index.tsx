import PropertiesCreated from "./PropertiesCreated";
import PropertyValue from "./PropertyValue";
import TypeDistribution from "./TypeDistribution";
import FeatureDistribution from "./FeatureDistribution";
import UserPropertyCount from "./UserPropertyCount";
import Wrapper from "./Wrapper";
import UserAccountsCreated from "./UserAccountsCreated";

export default async function DataPageContent({ locale }: { locale: string }) {
  return (
    <div className="flex flex-col justify-center items-center w-full flex-grow">
      <div className="grid grid-cols-1 lg:grid-cols-2 w-full h-full gap-4 justify-start p-8 items-start max-w-8xl">
        <Wrapper>
          <PropertiesCreated />
        </Wrapper>
        <Wrapper>
          <UserAccountsCreated />
        </Wrapper>
        <Wrapper>
          <PropertyValue />
        </Wrapper>
        <Wrapper>
          <UserPropertyCount />
        </Wrapper>
        <Wrapper>
          <TypeDistribution />
        </Wrapper>
        <Wrapper>
          <FeatureDistribution />
        </Wrapper>
      </div>
    </div>
  );
}
