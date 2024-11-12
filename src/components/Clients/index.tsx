"use client";
import Image from "next/image";

export default function Clients() {
  const images = [
    "https://vivaidealfinalbucket.s3.us-west-2.amazonaws.com/home/clients/construvalores.avif",
    "https://vivaidealfinalbucket.s3.us-west-2.amazonaws.com/home/clients/ibra-gomez.png",
    "https://vivaidealfinalbucket.s3.us-west-2.amazonaws.com/home/clients/coritrec.png",
    "https://vivaidealfinalbucket.s3.us-west-2.amazonaws.com/home/clients/ecuaraices.png",
    "https://vivaidealfinalbucket.s3.us-west-2.amazonaws.com/home/clients/inmoga.png",
    "https://vivaidealfinalbucket.s3.us-west-2.amazonaws.com/home/clients/ehf.png",
  ];

  return (
    <div className="grid justify-center items-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-y-12">
      {images.map((image, index) => (
        <div key={index} className="relative justify-center items-center w-auto h-[140px]">
          <Image
            src={image}
            alt={"image-" + index}
            loading={"lazy"}
            fill={true}
            style={{ objectFit: "contain" }}
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
