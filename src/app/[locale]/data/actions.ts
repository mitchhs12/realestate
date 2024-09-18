"use server";

import prisma from "@/lib/prisma";

// Utility function to generate an array of dates from startDate to endDate
function getDateRange(startDate: Date, endDate: Date): Date[] {
  const dates = [];
  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
}

export async function getHomeCreationDates(): Promise<{ date: Date; count: number }[]> {
  // Get the home creation count grouped by date (ignore time)
  const homeCreationCounts = await prisma.home.groupBy({
    by: ["completedAt"],
    _count: {
      completedAt: true,
    },
    orderBy: {
      completedAt: "asc",
    },
    where: {
      isComplete: true,
    },
  });

  // Get the earliest and latest completion dates
  const earliestDate =
    homeCreationCounts.length > 0
      ? new Date(Math.min(...homeCreationCounts.map((home) => home.completedAt!.getTime())))
      : null;

  if (!earliestDate) {
    return [];
  }

  const today = new Date();

  // Get all dates between the earliest creation date and today
  const allDates = getDateRange(earliestDate, today);

  // Create a map for quick lookup of homes created on specific dates (ignore time)
  const creationMap = new Map<string, number>();
  homeCreationCounts.forEach((home) => {
    const dateKey = home.completedAt!.toISOString().split("T")[0]; // Use only the date part
    const currentCount = creationMap.get(dateKey) || 0;
    creationMap.set(dateKey, currentCount + home._count.completedAt); // Increment the count for the date
  });

  // Format the result to include all dates, even those with 0 home creations
  const formattedResult = allDates.map((date) => {
    const dateKey = date.toISOString().split("T")[0];
    return {
      date: date,
      count: creationMap.get(dateKey) || 0, // Default to 0 if no homes were created on that day
    };
  });
  console.log(formattedResult);
  return formattedResult;
}

export async function getTopUsersByCompletedProperties(
  propertyCount: number = 30
): Promise<{ id: string; name: string | null; email: string | null; count: number }[]> {
  // Query the database to get the top 30 users with the most completed properties
  const topUsers = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      _count: {
        select: {
          homes: {
            where: {
              isComplete: true, // Only count completed homes
            },
          },
        },
      },
    },
    orderBy: {
      homes: {
        _count: "desc", // Order by the count of completed homes in descending order
      },
    },
    take: propertyCount, // Limit the result to the top 30 users by default
  });

  // Format the result to return userId and the count of completed properties
  return topUsers.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    count: user._count.homes,
  }));
}

export async function getTypeDistribution(): Promise<{ type: string; count: number }[]> {
  const homes = await prisma.home.findMany({
    where: {
      isComplete: true,
    },
    select: {
      type: true,
    },
  });

  const typeCounts = new Map<string, number>();

  homes.forEach((home) => {
    home.type.forEach((tag) => {
      typeCounts.set(tag, (typeCounts.get(tag) || 0) + 1); // Increment count for each tag
    });
  });

  const result = Array.from(typeCounts, ([type, count]) => ({
    type,
    count,
  }));

  return result;
}

export async function getFeatureDistribution(): Promise<{ feature: string; count: number }[]> {
  const homes = await prisma.home.findMany({
    where: {
      isComplete: true,
    },
    select: {
      features: true,
    },
  });

  const featureCounts = new Map<string, number>();

  homes.forEach((home) => {
    home.features.forEach((tag) => {
      featureCounts.set(tag, (featureCounts.get(tag) || 0) + 1); // Increment count for each tag
    });
  });

  const result = Array.from(featureCounts, ([feature, count]) => ({
    feature,
    count,
  }));

  return result;
}

export async function getPropertyValues(): Promise<{ date: Date; lowest: number; average: number; highest: number }[]> {
  const homeData = await prisma.home.aggregate({
    _min: {
      createdAt: true, // Get the earliest home creation date
    },
  });

  const earliestDate = homeData._min.createdAt;
  if (!earliestDate) {
    return [];
  }

  const today = new Date();
  const allDates = getDateRange(earliestDate, today);

  // Get the min, max, and avg usdPrice grouped by day (createdAt)
  const priceData = await prisma.home.groupBy({
    by: ["createdAt"], // Group by the createdAt field (daily)
    _min: {
      priceUsd: true, // Get the minimum price for each day
    },
    _avg: {
      priceUsd: true, // Get the average price for each day
    },
    _max: {
      priceUsd: true, // Get the maximum price for each day
    },
    orderBy: {
      createdAt: "asc", // Order by date, ascending
    },
    where: {
      isComplete: true,
    },
  });

  // Create a map for quick lookup of price stats on specific dates
  const priceMap = new Map<string, { min: number; average: number; max: number }>();
  priceData.forEach((entry) => {
    const dateKey = entry.createdAt.toISOString().split("T")[0];
    priceMap.set(dateKey, {
      min: entry._min.priceUsd || 0,
      average: entry._avg.priceUsd || 0,
      max: entry._max.priceUsd || 0,
    });
  });

  // Variables for running min, max, and average
  let runningMin = Number.POSITIVE_INFINITY;
  let runningMax = Number.NEGATIVE_INFINITY;
  let runningSum = 0;
  let totalCount = 0;

  // Format the result to include all dates, even those without price data
  const formattedResult = allDates.map((date) => {
    const dateKey = date.toISOString().split("T")[0];
    const priceStats = priceMap.get(dateKey);

    if (priceStats) {
      // Update the running min, max, sum, and count
      runningMin = Math.min(runningMin, priceStats.min);
      runningMax = Math.max(runningMax, priceStats.max);
      runningSum += priceStats.average; // Add the average price for the day to the running sum
      totalCount++; // Increment the count for the running average
    }

    const runningAvg = totalCount > 0 ? runningSum / totalCount : 0;

    return {
      date: date,
      lowest: Math.round(runningMin === Number.POSITIVE_INFINITY ? 0 : runningMin),
      average: Math.round(runningAvg),
      highest: Math.round(runningMax === Number.NEGATIVE_INFINITY ? 0 : runningMax),
    };
  });

  return formattedResult;
}
