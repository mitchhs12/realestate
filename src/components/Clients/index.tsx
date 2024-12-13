"use client";
import Image from "next/image";

export default function Clients() {
  const images = [
    `${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL}/home/clients/construvalores.avif`,
    `${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL}/home/clients/ibra-gomez.png`,
    `${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL}/home/clients/coritrec.png`,
    `${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL}/home/clients/ecuaraices.png`,
    `${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL}/home/clients/inmoga.png`,
    `${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL}/home/clients/ehf.png`,
    `${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL}/home/clients/maria-inmobiliaria.png`,
  ];

  return (
    <div className="grid justify-center items-center grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-y-12 gap-6">
      {images.map((image, index) => (
        <div key={index} className="relative justify-center items-center w-auto h-[152px]">
          <Image
            src={image}
            alt={"image-" + index}
            loading={"lazy"}
            fill={true}
            className="object-contain dark:filter-white"
            // style={{ objectFit: "contain" }}
            placeholder={"blur"}
            blurDataURL="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mMUW+ylBgADBQErtZO4YAAAAABJRU5ErkJggg=="
            sizes="(max-width: 400px) 400px,
          (max-width: 510px) 510px,
          (max-width: 768px) 768px, 
          (max-width: 1024px) 1024px, 
          (max-width: 1280px) 1280px, 
          (max-width: 1536px) 1536px,
          (max-width: 1920px) 1920px,
          100vw"
          />
        </div>
      ))}
    </div>
  );
}
