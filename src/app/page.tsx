import Hero from "@/components/Hero";
import Card from "@/components/Card";
import prisma from "@/lib/prisma";
import { getUserSession } from "@/lib/session";

export default async function Home() {
  const user = await prisma.user.findFirst({
    where: {
      email: "test@test.com",
    },
  });
  return (
    <main className="flex flex-col items-center justify-between p-24">
      <Hero />
      <Card />
    </main>
  );
}
