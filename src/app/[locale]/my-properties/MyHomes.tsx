"use client";
import { findMatching } from "@/lib/utils";
import ResizableCard from "@/components/ResizableCard";
import ToggleAllVisbilityButton from "@/components/ToggleAllVisibilityButton";
import { User } from "next-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Heart, House } from "lucide-react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { HomeType } from "@/lib/validations";
import PaginationComponent from "@/components/PaginationComponent";

interface Props {
  user: User;
  finishSelling: string;
  incompleteListing: string;
  hideAllText: string;
  showAllText: string;
  typesObject: { id: string; name: string; translation: string }[];
  premiumText: string;
  cardText: {
    properties: string;
    favorites: string;
    views: string;
    propertiesDescription: string;
    favoritesDescription: string;
    viewsDescription: string;
  };
  selection: {
    orderBy: string;
    date: string;
    favorited: string;
    price: string;
    incomplete: string;
    visible: string;
  };
}

export default function MyHomes({
  user,
  finishSelling,
  incompleteListing,
  hideAllText,
  showAllText,
  typesObject,
  premiumText,
  cardText,
  selection,
}: Props) {
  const [sortOption, setSortOption] = useState("date");
  const [homes, setHomes] = useState<HomeType[]>(user.homes);
  const [visibleHomes, setVisibleHomes] = useState<HomeType[]>([]);

  const sortHomes = (homes: HomeType[]) => {
    let sortedHomes = [...homes]; // Clone the array to avoid in-place sorting

    switch (sortOption) {
      case "date":
        sortedHomes.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "favorited":
        sortedHomes.sort((a: any, b: any) => (b.favoritedCount || 0) - (a.favoritedCount || 0));
        break;
      case "price":
        sortedHomes.sort((a: any, b: any) => (b.priceUsd || 0) - (a.priceUsd || 0));
        break;
      case "incomplete":
        sortedHomes.sort((a, b) => {
          if (a.isComplete === b.isComplete) return 0; // Keep original order if equal
          return a.isComplete ? 1 : -1; // Move `false` (a) before `true` (b)
        });
      case "visible":
        sortedHomes.sort((a, b) => {
          if (a.isActive === b.isActive) return 0; // Keep original order if equal
          return a.isActive ? 1 : -1; // Move `false` (a) before `true` (b)
        });
      default:
        break;
    }
    setHomes(sortedHomes);
  };

  useEffect(() => {
    sortHomes(user.homes);
  }, [sortOption]);

  const activeHomes = user.homes.filter((home) => home.isComplete);
  const allCompletedHomesActive = activeHomes.every((home) => home.isActive);
  const totalFavorites = user.homes.reduce((total, home) => {
    return total + (home.favoritedCount || 0); // Add the favorited count for each home, defaulting to 0 if undefined
  }, 0);

  return (
    <div className="flex flex-col max-w-8xl justify-center items-center h-full w-full pb-8">
      <div className="grid grid-cols-3 gap-3 w-full p-2 px-4 md:px-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-2 xs:p-6">
            <CardTitle className="text-sm font-medium">{cardText.properties}</CardTitle>
            <House className="hidden xs:flex h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-2 xs:p-6">
            <div className="text-xl sm:text-2xl font-bold">{user.homes.length}</div>
            <p className="text-xs text-muted-foreground">{cardText.propertiesDescription}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-2 xs:p-6">
            <CardTitle className="text-sm font-medium">{cardText.favorites}</CardTitle>
            <Heart className="hidden xs:flex h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-2 xs:p-6">
            <div className="text-xl sm:text-2xl font-bold">{totalFavorites}</div>
            <p className="text-xs text-muted-foreground">{cardText.favoritesDescription}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-2 xs:p-6">
            <CardTitle className="text-sm font-medium">{cardText.views}</CardTitle>
            <Eye className="hidden xs:flex h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-2 xs:p-6">
            <div className="text-xl sm:text-2xl font-bold">Coming soon...</div>
            <p className="text-xs text-muted-foreground">{cardText.viewsDescription}</p>
          </CardContent>
        </Card>
      </div>
      <div className="flex gap-3 px-4 md:px-6 items-center justify-between w-full py-6">
        <div className="flex justify-start items-center w-full">
          <ToggleAllVisbilityButton
            hideAllText={hideAllText}
            showAllText={showAllText}
            allCompletedHomesActive={allCompletedHomesActive}
          />
        </div>
        <div className="flex justify-center items-center">
          <PaginationComponent homes={homes} ITEMS_PER_PAGE={20} setVisibleHomes={setVisibleHomes} />
        </div>
        <div className="flex justify-end items-center w-full">
          <Select onValueChange={setSortOption}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={selection.orderBy} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="date">{selection.date}</SelectItem>
                <SelectItem value="favorited">{selection.favorited}</SelectItem>
                <SelectItem value="price">{selection.price}</SelectItem>
                <SelectItem value="incomplete">{selection.incomplete}</SelectItem>
                <SelectItem value="visible">{selection.visible}</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="p-2 px-4 sm:p-4 md:px-6 overflow-y-auto w-full h-full grid grid-cols-1 2xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-center items-center gap-2 md:gap-4 lg:gap-5 xl:gap-5">
        {visibleHomes.map((home: HomeType, index: number) => {
          const matchingTypes = findMatching(typesObject, home, "type");

          return (
            <div
              key={index}
              className={`flex flex-col h-full w-full space-y-2 shadow-lg dark:shadow-white/10 rounded-lg`}
            >
              <ResizableCard
                home={home}
                finishSelling={finishSelling}
                incompleteListing={incompleteListing}
                types={matchingTypes}
                userId={user.id}
                premiumText={premiumText}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
