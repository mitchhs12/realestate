"use client";

import { useState, useEffect, useMemo } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis, ResponsiveContainer } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

import { getHomeCreationDates } from "@/app/[locale]/data/actions";

export const description = "An interactive line chart showing property creation dates";

const chartConfig = {
  properties: {
    label: "Properties Created",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export default function PropertiesCreated() {
  const [chartData, setChartData] = useState<{ date: string; count: number }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getHomeCreationDates();
        let cumulativeCount = 0;
        const formattedData = data.map((item) => {
          cumulativeCount += item.count;
          return {
            date: item.date.toISOString().split("T")[0], // Format date as YYYY-MM-DD
            count: cumulativeCount,
          };
        });
        setChartData(formattedData);
      } catch (error) {
        console.error("Failed to fetch property creation dates:", error);
      }
    };

    fetchData();
  }, []);

  const total = useMemo(() => (chartData.length > 0 ? chartData[chartData.length - 1].count : 0), [chartData]);

  return (
    <Card className="flex flex-col w-full h-full">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Properties Created</CardTitle>
          <CardDescription>All properties on Viva Ideal</CardDescription>
        </div>
        <div className="flex">
          <div className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left sm:border-l sm:border-t-0 sm:px-8 sm:py-6">
            <span className="text-xs text-muted-foreground">Total Properties</span>
            <span className="text-lg font-bold leading-none sm:text-3xl">{total.toLocaleString()}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="sm:p-6 h-full">
        <ChartContainer config={chartConfig} className="aspect-auto h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} className="">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => `${value}`}
                domain={[0, "dataMax"]}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className="w-[150px]"
                    nameKey="properties"
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      });
                    }}
                  />
                }
              />
              <Line
                type="monotone"
                dataKey="count"
                name="Total Properties"
                stroke={`var(--color-properties)`}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
