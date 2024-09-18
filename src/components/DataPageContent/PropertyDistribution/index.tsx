"use client";

import { LabelList, Pie, PieChart, Cell } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useState, useEffect } from "react";
import { getPropertyDistribution } from "@/app/[locale]/data/actions";
import { typesMap } from "@/lib/sellFlowData";
import { typeIcons } from "@/components/Icons/typeIcons"; // Import your typeIcons map here
import { useTheme } from "next-themes";

export const description = "A pie chart showing the distribution of property types";

const chartConfig = typesMap
  .map((type, index) => ({
    [type.id]: {
      label: type.name,
      color: `hsl(var(--chart-${(index % 5) + 1}))`,
    },
  }))
  .reduce((acc, curr) => ({ ...acc, ...curr }), {});

const CustomLabel = (props: any, theme: string) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, index, payload } = props;
  const { type } = payload; // Get the type from the payload
  const TypeIcon = typeIcons[type]; // Get the corresponding icon

  if (!TypeIcon) return null; // If no icon is found, return null

  // Calculate label position
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <foreignObject x={x - 12} y={y - 12} width={24} height={24}>
      <TypeIcon color={"white"} width={24} height={24} />
    </foreignObject>
  );
};

export default function PropertyDistribution() {
  const [propertyDistribution, setPropertyDistribution] = useState<{ type: string; count: number }[]>([]);
  const { resolvedTheme: theme } = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPropertyDistribution();
        const formattedData = typesMap
          .map((item) => {
            return {
              type: item.id,
              count: data.find((d) => d.type === item.name)?.count || 0,
              fill: `var(--color-${item.id})`,
            };
          })
          .filter((item) => item.count > 0); // Filter out items with count of 0
        setPropertyDistribution(formattedData); // Directly setting the data here
        console.log(formattedData);
      } catch (error) {
        console.error("Failed to fetch property distribution:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Property Type Distribution</CardTitle>
        <CardDescription>Distribution of property types across active listings</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0 h-full">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square h-full w-full">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent nameKey="type" hideLabel />} />
            {theme && (
              <Pie
                data={propertyDistribution}
                dataKey="count"
                nameKey="type"
                outerRadius={"80%"}
                innerRadius={"50%"}
                labelLine={false} // Disable label lines
                label={(props) => CustomLabel(props, theme)} // Use custom label for icons
              >
                {propertyDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={chartConfig[entry.type]?.color} />
                ))}
              </Pie>
            )}
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
