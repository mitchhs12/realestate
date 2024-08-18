import SubLayout from "@/app/[locale]/client/layout";
import Header from "@/components/Header";

type Props = {
  children: React.ReactNode;

  locale: string;
};

export default function MainLayout({ children, locale }: Props) {
  return (
    <>
      <SubLayout params={{ locale }}>
        <Header />
      </SubLayout>
      {children}
    </>
  );
}
