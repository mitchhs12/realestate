import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import Image from "next/image";
import ResizableCarousel from "@/components/ResizableCarousel";
import { Button } from "@/components/ui/button";
import { I18nProviderClient } from "@/locales/client";
import { FavoriteComponent } from "@/components/FavoriteComponent";
import Photos from "@/app/[locale]/homes/[homeId]/edit/photos";
import { HomeType } from "@/lib/validations";
import { useState, useContext } from "react";
import { HomeContext } from "@/context/HomeContext";
import { LocaleContext } from "@/context/LocaleContext";

export default function PhotoDialog({ showAllPhotos }: { showAllPhotos: string }) {
  const { home, editMode } = useContext(HomeContext);
  const { defaultLanguage, user } = useContext(LocaleContext);
  const [isPhotoModalOpen, setPhotoModalOpen] = useState(false);

  return (
    <Dialog open={isPhotoModalOpen} onOpenChange={setPhotoModalOpen}>
      <DialogTrigger asChild>
        <div
          className={`relative w-full ${editMode && "hover:cursor-pointer border-2 border-primary animate-pulse rounded-2xl bg-primary/10"}`}
        >
          {/* Grid for larger screens */}
          <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-4 h-80 lg:h-96 w-full">
            {home.photos.slice(0, 5).map((photo, index) => (
              <div key={index} className={`relative ${index === 0 ? "row-span-2 col-span-2" : ""} h-full w-full`}>
                <Image
                  src={photo}
                  className="object-cover object-center rounded-lg hover:cursor-pointer"
                  alt={`${home.title} photo ${index}`}
                  fill
                  sizes="(max-width: 400px) 400px, (max-width: 510px) 510px, (max-width: 768px) 768px"
                />
              </div>
            ))}
            <div className="absolute top-1 left-[49%] -translate-x-1/2">
              {user && user.id !== home.ownerId && <FavoriteComponent user={user} home={home} large={true} />}
            </div>
          </div>
          {home.photos.length > 0 && (
            <div className="hidden md:flex absolute bottom-3 md:left-3">
              <Button variant="outline">{showAllPhotos}</Button>
            </div>
          )}

          {/* Carousel for smaller screens */}
          <div className="relative md:hidden w-full hover:cursor-pointer rounded-xl overflow-hidden">
            <ResizableCarousel photos={home.photos} title={home.title!} height={`h-[320px]`} home={home} large={true} />
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="flex flex-col w-[95%] h-[95%] max-w-none px-0 sm:px-2 md:px-6">
        <I18nProviderClient locale={defaultLanguage}>
          <Photos />
        </I18nProviderClient>
      </DialogContent>
    </Dialog>
  );
}
