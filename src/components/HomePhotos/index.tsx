"use client";

import Image from "next/image";
import ResizableCarousel from "@/components/ResizableCarousel";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect, useContext } from "react";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { HomeContext } from "@/context/HomeContext";
import { LocaleContext } from "@/context/LocaleContext";
import InteriorAI from "@/components/InteriorAI/MainButton";
import { FavoriteComponent } from "../FavoriteComponent";
import TitleDialog from "./TitleDialog";
import PhotoDialog from "./PhotoDialog";

interface Props {
  showAllPhotos: string;
  translateButton: string;
  showOriginalButton: string;
}

export default function HomePhotos({ showAllPhotos }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { home, editMode } = useContext(HomeContext);
  const { user } = useContext(LocaleContext);

  const openModal = (index: number) => {
    setSelectedImageIndex(index);
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (isModalOpen) {
      requestAnimationFrame(() => {
        setTimeout(() => {
          if (imageRefs.current[selectedImageIndex] && selectedImageIndex > 0) {
            imageRefs.current[selectedImageIndex]?.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }
        }, 100); // Add a slight delay (100ms) to ensure content is rendered
      });
    }
  }, [isModalOpen, selectedImageIndex]);

  return (
    <div className="flex flex-col min-h-full w-full p-2 px-4 sm:p-4 md:px-6 py-4">
      <div className={`flex justify-center relative text-3xl pb-6`}>
        {editMode ? (
          <TitleDialog />
        ) : (
          <h1 className={`flex items-center justify-center`}>
            {home.title}
            {/* {translationLoading || titleLoading ? <Skeleton className="h-[36px] w-11/12" /> : title}
          {languagesRequiringClientSideTranslation.includes(defaultLanguage) && (
            <div className="absolute right-0">
              <Button
                disabled={titleLoading || translationLoading}
                className="gap-2"
                variant={"outline"}
                onClick={handleTitleConvert}
              >
                <Languages width={18} />
                {originalTitle ? translateButton : showOriginalButton}
              </Button>
            </div>
          )} */}
          </h1>
        )}
      </div>

      {/* PHOTOS */}
      {editMode ? (
        <PhotoDialog showAllPhotos={showAllPhotos} />
      ) : (
        <div className={`relative w-full`}>
          {/* Grid for larger screens */}
          <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-4 h-80 lg:h-96 w-full">
            {home.photos.slice(0, 5).map((photo, index) => (
              <div
                key={index}
                onClick={(q) => {
                  q.stopPropagation();
                  openModal(index);
                }}
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
            <div className="absolute top-3 left-3">
              <InteriorAI imageUrl={home.photos[0]} />
            </div>
            <div className="absolute top-1 left-[49%] -translate-x-1/2">
              {user && user.id !== home.ownerId && <FavoriteComponent user={user} home={home} large={true} />}
            </div>
          </div>
          {home.photos.length > 0 && (
            <div className="hidden md:flex absolute bottom-3 md:left-3">
              <Button
                variant="outline"
                onClick={(e) => {
                  openModal(0);
                  e.stopPropagation();
                }}
              >
                {showAllPhotos}
              </Button>
            </div>
          )}

          {/* Carousel for smaller screens */}
          <div className="relative md:hidden w-full hover:cursor-pointer rounded-xl overflow-hidden">
            <ResizableCarousel
              photos={home.photos}
              title={home.title!}
              height={`h-[320px]`}
              openModal={openModal}
              home={home}
              large={true}
              aiDesign={true}
            />
          </div>
        </div>
      )}

      {/* Modal for showing all photos */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-[90vw] sm:max-w-3xl rounded-md p-4" onOpenAutoFocus={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>All Photos</DialogTitle>
            <DialogClose asChild></DialogClose>
          </DialogHeader>
          <div className="max-h-[80vh] px-0 overflow-y-auto grid grid-cols-1 gap-4">
            {home.photos.map((photo, index) => (
              <div
                key={index}
                className="w-full relative"
                ref={(el) => {
                  imageRefs.current[index] = el;
                }}
              >
                {/* Check if the photo is AI-generated */}
                <div className="absolute top-3 left-3">
                  <InteriorAI imageUrl={photo} />
                </div>
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
