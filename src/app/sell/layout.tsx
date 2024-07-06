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
    <div className="flex flex-col w-full justify-between h-screen-minus-header">
      <main>{children}</main>
      <section className="flex flex-col justify-end items-center">
        <ProgressBar steps={sellSteps} />
      </section>
    </div>
  );
}
