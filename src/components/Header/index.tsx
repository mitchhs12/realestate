import Image from "next/image";
import Link from "next/link";
import { ProfileButton } from "@/components/ProfileButton";
import { montserrat } from "@/app/fonts";
import { auth } from "@/auth";

export default async function Header() {
  const session = await auth();
  const user = session?.user;

  return (
    <>
      <header className={`relative flex justify-between items-center h-[80px] px-4 z-[10]`}>
        <Link href="/">
          <div className="flex justify-center items-center hover:text-primary hover:cursor-pointer group">
            <Image
              src={"./tuna.svg"}
              alt="Logo"
              width={50}
              height={50}
              className="transition-transform duration-300 group-hover:rotate-6"
            />
            <h1 className={`${montserrat.className} flex pl-6 text-3xl font-[500]`}>Propertuna</h1>
          </div>
        </Link>

        <nav className="flex justify-between gap-3 items-center">
          <ProfileButton user={user} />
        </nav>
        {/* Bottom Line */}
        <div className="absolute bottom-0 left-0 right-0 divider z-0" />
      </header>
    </>
  );
}
