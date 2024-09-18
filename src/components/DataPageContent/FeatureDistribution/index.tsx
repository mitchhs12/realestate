"use client";

import { LabelList, Pie, PieChart, Cell } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useState, useEffect } from "react";
import { getFeatureDistribution } from "@/app/[locale]/data/actions";
import { featuresMap } from "@/lib/sellFlowData";
import { featureIcons } from "@/components/Icons/featureIcons"; // Import your typeIcons map here
import { useTheme } from "next-themes";

export const description = "A pie chart showing the distribution of property types";

const chartConfig = featuresMap
  .map((feature, index) => ({
    [feature.id]: {
      label: feature.name,
      color: `hsl(var(--chart-${(index % 5) + 1}))`,
    },
  }))
  .reduce((acc, curr) => ({ ...acc, ...curr }), {});

const CustomLabel = (props: any, theme: string) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, index, payload } = props;
  const { feature } = payload; // Get the type from the payload
  const FeatureIcons = featureIcons[feature]; // Get the corresponding icon

  if (!FeatureIcons) return null; // If no icon is found, return null

  // Calculate label position
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <foreignObject x={x - 12} y={y - 12} width={24} height={24}>
      <FeatureIcons color={"white"} width={30} height={30} />
    </foreignObject>
  );
};

export default function PropertyDistribution() {
  const [propertyDistribution, setPropertyDistribution] = useState<{ feature: string; count: number }[]>([]);
  const { resolvedTheme: theme } = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getFeatureDistribution();
        const formattedData = featuresMap
          .map((item) => {
            return {
              feature: item.id,
              count: data.find((d) => d.feature === item.name)?.count || 0,
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
        <CardTitle>Property Feature Distribution</CardTitle>
        <CardDescription>Distribution of property features across all active listings</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0 h-full">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square h-full w-full">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent nameKey="feature" hideLabel />} />
            {theme && (
              <Pie
                data={propertyDistribution}
                dataKey="count"
                nameKey="feature"
                outerRadius={"80%"}
                innerRadius={"50%"}
                labelLine={false} // Disable label lines
                label={(props) => CustomLabel(props, theme)} // Use custom label for icons
              >
                {propertyDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={chartConfig[entry.feature]?.color} />
                ))}
              </Pie>
            )}
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
