"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  const pathname = usePathname();

  return (
    <>
      <header className={`relative flex justify-between items-center h-[84px] px-4 z-[1000]`}>
        <Link href="/">
          <div className="flex justify-center items-center hover:text-orange-600 hover:opacity-75 hover:cursor-pointer group">
            <Image
              src={"./fox.svg"}
              alt="Logo"
              width={60}
              height={60}
              className="transition-transform duration-300 group-hover:rotate-6"
            />
            <h1 className="flex pl-6 text-4xl text-orange-600 font-seriff bold">Nomad Stats</h1>
          </div>
        </Link>

        <nav className="flex justify-evenly items-center gap-8 h-full text-[.8rem] font-semibold">Profile Button</nav>
        {/* Bottom Line */}
        <div className="absolute bottom-0 left-0 right-0 divider" />
      </header>
    </>
  );
}
