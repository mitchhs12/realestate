import Image from "next/image";
import HeroContent from "@/components/Hero/HeroContent";

export default function Hero() {
  return (
    <div className="relative h-[20vh] flex w-full">
      <Image
        src="https://vivaidealfinalbucket.s3.us-west-2.amazonaws.com/home/banners/banner1.webp"
        alt="background"
        fill={true}
        style={{ objectFit: "cover" }}
        quality={70}
        priority={true}
        placeholder="blur"
        blurDataURL={
          "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mMUW+ylBgADBQErtZO4YAAAAABJRU5ErkJggg=="
        }
        sizes="(max-width: 400px) 400px,
        (max-width: 510px) 510px,
        (max-width: 768px) 768px, 
        (max-width: 1024px) 1024px, 
        (max-width: 1280px) 1280px, 
        (max-width: 1536px) 1536px,
        (max-width: 1920px) 1920px,
        100vw"
        className="-z-10 opacity-30 dark:opacity-20"
      />
      <HeroContent />
    </div>
  );
}
