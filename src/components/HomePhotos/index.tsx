"use client";

import Image from "next/image";
import { HomeType } from "@/lib/validations";
import ResizableCarousel from "@/components/ResizableCarousel";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";

export default function HomePhotos({ home, showAllPhotos }: { home: HomeType; showAllPhotos: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

  const openModal = (index: number) => {
    setSelectedImageIndex(index);
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    if (isModalOpen) {
      // Wait for the dialog to be fully open before scrolling
      requestAnimationFrame(() => {
        if (imageRefs.current[selectedImageIndex]) {
          imageRefs.current[selectedImageIndex]?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      });
    }
  }, [isModalOpen, selectedImageIndex]);

  return (
    <div className="flex flex-col min-h-full w-full px-8 py-4">
      <div className="relative w-full">
        {/* Grid for larger screens */}
        <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-4 h-80 lg:h-96 w-full">
          {home.photos.slice(0, 5).map((photo, index) => (
            <div
              key={index}
              onClick={() => openModal(index)} // Pass index here
              className={`relative ${index === 0 ? "row-span-2 col-span-2" : ""} h-full w-full`}
            >
              <Image
                src={photo}
                className="object-cover object-center rounded-lg hover:cursor-pointer"
                alt={`${home.title} photo ${index}`}
                fill
                sizes="(max-width: 400px) 400px, (max-width: 510px) 510px, (max-width: 768px) 768px"
              />
            </div>
          ))}
        </div>
        {home.photos.length > 0 && (
          <div className="hidden md:flex absolute bottom-3 md:left-3">
            <Button variant="outline" onClick={() => openModal(0)}>
              {showAllPhotos}
            </Button>
          </div>
        )}

        {/* Carousel for smaller screens */}
        <div className="md:hidden w-full hover:cursor-pointer">
          <ResizableCarousel home={home} height={`h-[320px]`} openModal={openModal} rounded={"rounded-xl"} />
        </div>
      </div>

      {/* Modal for showing all photos */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-[85vw] sm:max-w-3xl rounded-md" onOpenAutoFocus={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>All Photos</DialogTitle>
            <DialogClose asChild>
              <Button variant="secondary" className="w-full" onClick={closeModal}>
                Close
              </Button>
            </DialogClose>
          </DialogHeader>
          <div className="max-h-[85vh] overflow-y-auto grid grid-cols-1 gap-4 p-4">
            {home.photos.map((photo, index) => (
              <div
                key={index}
                className="w-full"
                ref={(el) => {
                  imageRefs.current[index] = el;
                }}
              >
                <Image
                  src={photo}
                  className="object-cover object-center rounded-lg"
                  alt={`${home.title} photo ${index}`}
                  width={700}
                  height={700}
                  sizes={"(max-width: 400px) 400px, (max-width: 510px) 510px, (max-width: 768px) 768px"}
                />
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
