"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { BoundsType, HomeType } from "@/lib/validations";
import { HomesGeoJson, HomeFeatureProps } from "@/lib/validations";
import { Feature, Point } from "geojson";
import { CurrencyType } from "@/lib/validations";

export async function getSearchResults(
  page: string,
  bounds: BoundsType,
  priceRange: number[] = [],
  types: string[] = [],
  features: string[] = [],
  rooms: {
    bedrooms: number[];
    bathrooms: number[];
    livingrooms: number[];
    kitchens: number[];
    maxRooms: number;
  },
  defaultCurrency: CurrencyType
) {
  let homes: HomeType[] = [];

  let commonFilters: any = {
    isActive: true,
    latitude: {
      gte: bounds.south,
      lte: bounds.north,
    },
  };

  // Add price filter if priceRange is defined
  if (priceRange.length === 2) {
    commonFilters = {
      ...commonFilters,
      priceUsd: {
        gte: Math.round(priceRange[0] / defaultCurrency.usdPrice),
        lte: Math.round(priceRange[1] / defaultCurrency.usdPrice),
      },
    };
  }

  // Add type filter if types is defined
  if (types.length > 0) {
    commonFilters = {
      ...commonFilters,
      type: {
        hasSome: types,
      },
    };
  }

  // Add features filter if features is defined
  if (features.length > 0) {
    commonFilters = {
      ...commonFilters,
      features: {
        hasSome: features,
      },
    };
  }

  if (rooms.bedrooms[0] > 0 || rooms.bedrooms[1] < rooms.maxRooms) {
    commonFilters = {
      ...commonFilters,
      bedrooms: {
        gte: rooms.bedrooms[0],
        lte: rooms.bedrooms[1],
      },
    };
  }

  if (rooms.bathrooms[0] > 0 || rooms.bathrooms[1] < rooms.maxRooms) {
    commonFilters = {
      ...commonFilters,
      bathrooms: {
        gte: rooms.bathrooms[0],
        lte: rooms.bathrooms[1],
      },
    };
  }

  if (rooms.livingrooms[0] > 0 || rooms.livingrooms[1] < rooms.maxRooms) {
    commonFilters = {
      ...commonFilters,
      livingrooms: {
        gte: rooms.livingrooms[0],
        lte: rooms.livingrooms[1],
      },
    };
  }

  if (rooms.kitchens[0] > 0 || rooms.kitchens[1] < rooms.maxRooms) {
    commonFilters = {
      ...commonFilters,
      kitchens: {
        gte: rooms.kitchens[0],
        lte: rooms.kitchens[1],
      },
    };
  }

  // Case 1: Longitude wrap-around (crossing the International Date Line)
  if (bounds.west > bounds.east) {
    homes = await prisma.home.findMany({
      where: {
        ...commonFilters,

        OR: [
          {
            longitude: {
              gte: bounds.west,
              lte: 180,
            },
          },
          {
            longitude: {
              gte: -180,
              lte: bounds.east,
            },
          },
        ],
      },
    });
    console.log("homes", homes);
  }
  // Case 2: Normal longitude and latitude range
  else {
    console.log("RUNNING CASE 2");
    homes = await prisma.home.findMany({
      where: {
        ...commonFilters,
        longitude: {
          gte: bounds.west,
          lte: bounds.east,
        },
      },
      orderBy: { listingType: "asc" },
    });
  }

  revalidatePath(page); // Revalidate the path if necessary
  return homes;
}

export async function getAllHomeIds(): Promise<number[]> {
  const homes = await prisma.home.findMany({
    where: {
      isActive: true,
    },
    select: {
      id: true,
    },
  });
  const ids = homes.map((home) => home.id);
  return ids;
}

export async function getAllHomes(): Promise<HomesGeoJson> {
  const homes = await prisma.home.findMany({
    where: {
      isActive: true,
    },
    orderBy: { listingType: "asc" },
  });

  const features: Feature<Point, HomeFeatureProps>[] = homes.map((home) => ({
    type: "Feature",
    id: home.id, // Assuming unique home id, prefixing to ensure string ID
    geometry: {
      type: "Point",
      coordinates: [home.longitude, home.latitude],
    },
    properties: {
      id: home.id,
      name: home.title,
      address: home.address,
      description: home.description,
      type: home.type, // Include type from home object
      features: home.features, // Include features from home object
      price: home.price, // Include price from home object
      priceUsd: home.priceUsd,
      currency: home.currency,
      bedrooms: home.bedrooms, // Include bedrooms from home object
      bathrooms: home.bathrooms, // Include bathrooms from home object
      livingrooms: home.livingrooms, // Include livingrooms from home object
      kitchens: home.kitchens, // Include kitchens from home object
      capacity: home.capacity, // Include capacity from home object
      photos: home.photos, // Include photos from home object
      contactName: home.contactName, // Include contactName from home object
      contactEmail: home.contactEmail, // Include contactEmail from home object
      contactPhone: home.contactPhone, // Include contactPhone from home object
      listingType: home.listingType,
      country: home.country,
    },
  }));

  return {
    type: "FeatureCollection",
    features,
  };
}

export async function getSingleHome(id: number) {
  const home = await prisma.home.findUnique({
    where: {
      id: id,
    },
  });

  return home;
}

export async function getAllHomesFiltered(
  defaultCurrency: CurrencyType,
  typesFilter: string[] = [],
  featuresFilter: string[] = [],
  convertedPriceRange: number[] = []
): Promise<HomesGeoJson> {
  // Base filters for active homes
  let commonFilters: any = {
    isActive: true,
  };

  // Add price filter if priceRange has exactly two elements
  if (convertedPriceRange.length === 2) {
    commonFilters = {
      ...commonFilters,
      priceUsd: {
        gte: Math.round(convertedPriceRange[0] / defaultCurrency.usdPrice),
        lte: Math.round(convertedPriceRange[1] / defaultCurrency.usdPrice),
      },
    };
  }

  // Add type filter if typesFilter has elements
  if (typesFilter.length > 0) {
    commonFilters = {
      ...commonFilters,
      type: {
        hasSome: typesFilter,
      },
    };
  }

  // Add features filter if featuresFilter has elements
  if (featuresFilter.length > 0) {
    commonFilters = {
      ...commonFilters,
      features: {
        hasSome: featuresFilter,
      },
    };
  }

  const homes = await prisma.home.findMany({
    where: commonFilters,
    orderBy: {
      listingType: "asc",
    },
  });

  const features: Feature<Point, HomeFeatureProps>[] = homes.map((home) => ({
    type: "Feature",
    id: home.id, // Assuming unique home id, prefixing to ensure string ID
    geometry: {
      type: "Point",
      coordinates: [home.longitude, home.latitude],
    },
    properties: {
      id: home.id,
      // name: home.title,
      address: home.address,
      country: home.country,
      priceUsd: home.priceUsd,
      currency: home.currency,
      // description: home.description,
      type: home.type, // Include type from home object
      features: home.features, // Include features from home object
      price: home.price, // Include price from home object
      photos: home.photos, // Include photos from home object
      // contactName: home.contactName, // Include contactName from home object
      // contactEmail: home.contactEmail, // Include contactEmail from home object
      // contactPhone: home.contactPhone, // Include contactPhone from home object
      listingType: home.listingType, // Include listingType from home object
    },
  }));

  return {
    type: "FeatureCollection",
    features,
  };
}
