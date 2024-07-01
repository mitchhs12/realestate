import Hero from "@/components/Hero";
import Card from "@/components/Card";

export default async function Home() {
  return (
    <main className="flex flex-col items-center justify-between p-24">
      <Hero />
      <Card />
    </main>
  );
}
