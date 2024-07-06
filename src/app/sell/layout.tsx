import ProgressBar from "@/components/ProgressBar";

const sellSteps = [
  ["/sell/categories", "/sell/rooms", "/sell/capacity"],
  ["/sell/features", "/sell/photos", "/sell/title", "/sell/description"],
  ["/sell/contact", "/sell/price", "/sell/checkout", "/sell/review"],
];

export default function SellFlowLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="flex flex-col h-screen-minus-header-footer border-2 border-blue-500">
        <main className="flex h-screen-minus-header-footer overflow-auto">{children}</main>
      </div>
      <section className="w-full border-2 border-green-500">
        <ProgressBar steps={sellSteps} />
      </section>
    </>
  );
}
