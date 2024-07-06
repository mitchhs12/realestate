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
    <div className="flex flex-col h-screen-minus-header justify-between w-full">
      <main className="flex-grow border-2 border-green-500 overflow-auto">{children}</main>
      <ProgressBar steps={sellSteps} />
    </div>
  );
}
