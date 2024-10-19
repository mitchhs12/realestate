"use client";
import { findMatching } from "@/lib/utils";
import ResizableCard from "@/components/ResizableCard";
import ToggleAllVisbilityButton from "@/components/ToggleAllVisibilityButton";
import { User } from "next-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Heart, House } from "lucide-react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { HomeType } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { deleteHome } from "@/app/[locale]/my-properties/actions";
import { Trash } from "lucide-react";

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

  const sortHomes = (homes: any) => {
    switch (sortOption) {
      case "date":
        return homes.sort((a: any, b: any) => {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
      case "favorited":
        return homes.sort((a: any, b: any) => (b.favoritedCount || 0) - (a.favoritedCount || 0));
      case "price":
        return homes.sort((a: any, b: any) => (b.priceUsd || 0) - (a.priceUsd || 0));
      default:
        return homes;
    }
  };

  const activeHomes = user.homes.filter((home) => home.isComplete);
  const allCompletedHomesActive = activeHomes.every((home) => home.isActive);
  const totalFavorites = user.homes.reduce((total, home) => {
    return total + (home.favoritedCount || 0); // Add the favorited count for each home, defaulting to 0 if undefined
  }, 0);

  return (
    <div className="flex flex-col max-w-8xl h-full w-full pb-8">
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
        <ToggleAllVisbilityButton
          hideAllText={hideAllText}
          showAllText={showAllText}
          allCompletedHomesActive={allCompletedHomesActive}
        />
        <Select onValueChange={setSortOption}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={selection.orderBy} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="date">{selection.date}</SelectItem>
              <SelectItem value="favorited">{selection.favorited}</SelectItem>
              <SelectItem value="price">{selection.price}</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="p-2 px-4 sm:p-4 md:px-6 overflow-y-auto w-full h-full grid grid-cols-1 2xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:grid-rows-1 xl:grid-cols-5 xl:grid-rows-1 justify-center items-center gap-2 md:gap-4 lg:gap-5 xl:gap-5">
        {sortHomes(user.homes).map((home: HomeType, index: number) => {
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
