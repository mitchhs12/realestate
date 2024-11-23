import Image from "next/image";
import HeroContent from "@/components/Hero/HeroContent";

export default function Hero() {
  return (
    <div className="relative h-[25vh] flex w-full bg-[#e8f6ed]/70 dark:bg-[#021007]/70">
      <Image
        src={`${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL}/home/banners/banner1.webp`}
        alt="background"
        fill={true}
        style={{ objectFit: "cover" }}
        loading={"eager"}
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
        className="-z-10"
      />
      <HeroContent />
    </div>
  );
}
