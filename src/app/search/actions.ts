"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { BoundsType } from "@/lib/validations";
import { HomesGeoJson, HomeFeatureProps } from "@/components/MainMap/homes";
import { Feature, Point } from "geojson";

export async function getSearchResults(page: string, bounds: BoundsType) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("User not found");
  }

  console.log("bounds", bounds);

  let homes = [];

  // Case 1: Longitude wrap-around (crossing the International Date Line)
  if (bounds.west > bounds.east) {
    // Query region 1: from west to 180
    const region1 = await prisma.home.findMany({
      where: {
        isActive: true,
        latitude: {
          gte: bounds.south,
          lte: bounds.north,
        },
        longitude: {
          gte: bounds.west,
          lte: 180,
        },
      },
    });

    // Query region 2: from -180 to east
    const region2 = await prisma.home.findMany({
      where: {
        isActive: true,
        latitude: {
          gte: bounds.south,
          lte: bounds.north,
        },
        longitude: {
          gte: -180,
          lte: bounds.east,
        },
      },
    });

    homes = [...region1, ...region2];
  }
  // Case 2: Normal longitude and latitude range
  else {
    homes = await prisma.home.findMany({
      where: {
        isActive: true,
        latitude: {
          gte: bounds.south,
          lte: bounds.north,
        },
        longitude: {
          gte: bounds.west,
          lte: bounds.east,
        },
      },
    });
  }

  console.log("homes", homes);

  revalidatePath(page); // Revalidate the path if necessary
  return homes;
}

export async function getAllHomes(): Promise<HomesGeoJson> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("User not found");
  }

  const homes = await prisma.home.findMany({
    where: {
      isActive: true,
    },
  });

  const features: Feature<Point, HomeFeatureProps>[] = homes.map((home) => ({
    type: "Feature",
    id: `home-${home.id}`, // Assuming unique home id, prefixing to ensure string ID
    geometry: {
      type: "Point",
      coordinates: [home.longitude, home.latitude],
    },
    properties: {
      name: home.title,
      address: home.address,
      description: home.description,
      type: home.type, // Include type from home object
      features: home.features, // Include features from home object
      price: home.price, // Include price from home object
      bedrooms: home.bedrooms, // Include bedrooms from home object
      bathrooms: home.bathrooms, // Include bathrooms from home object
      livingrooms: home.livingrooms, // Include livingrooms from home object
      kitchens: home.kitchens, // Include kitchens from home object
      capacity: home.capacity, // Include capacity from home object
      photos: home.photos, // Include photos from home object
      contactName: home.contactName, // Include contactName from home object
      contactEmail: home.contactEmail, // Include contactEmail from home object
      contactPhone: home.contactPhone, // Include contactPhone from home object
    },
  }));

  return {
    type: "FeatureCollection",
    features,
  };
}
