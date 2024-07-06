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
      <div className="flex flex-col min-h-screen-minus-header-footer">
        <main className="flex-grow overflow-auto">{children}</main>
      </div>
      <section className="progress-section w-full">
        <ProgressBar steps={sellSteps} />
      </section>
    </>
  );
}
