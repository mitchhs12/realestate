"use client";

import { Bar, BarChart, Cell, XAxis, YAxis, Tooltip, CartesianGrid, LabelList } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { useEffect, useState } from "react";
import { getTopUsersByCompletedProperties } from "@/app/[locale]/data/actions";

export const description = "A mixed bar chart";

// Custom Tooltip component to display email
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const { name, email, count } = payload[0].payload;
    return (
      <div className="bg-card p-2 border rounded shadow">
        <p className="count">{`${count} properties`}</p>
        <p className="label">{`Name: ${name}`}</p>
        <p className="intro">{`Email: ${email}`}</p>
      </div>
    );
  }
  return null;
};

export default function UserPropertyCount() {
  const [topUsers, setTopUsers] = useState<{ id: string; name: string; email: string; count: number; fill: string }[]>(
    []
  );
  const [n, setN] = useState(10);
  const [chartConfig, setChartConfig] = useState({});

  useEffect(() => {
    // Fetch the top users and generate the dynamic chart configuration
    const fetchData = async () => {
      try {
        const data = await getTopUsersByCompletedProperties(n);

        // Dynamically generate the chartConfig based on fetched users
        const generatedChartConfig = data
          .map((user, index) => ({
            [user.id]: {
              label: user.name || "Unknown",
              color: `hsl(var(--chart-${(index % 5) + 1}))`, // Cycling through colors
            },
          }))
          .reduce((acc, curr) => ({ ...acc, ...curr }), {});

        const newData = data.map((user, index) => ({
          id: user.id,
          name: user.name || "Unknown",
          email: user.email || "Unknown",
          count: user.count,
          fill: `hsl(var(--chart-${(index % 5) + 1}))`, // Assigning color based on index
        }));

        setTopUsers(newData);
        setChartConfig(generatedChartConfig); // Set chartConfig after generating it
      } catch (error) {
        console.error("Failed to fetch top users:", error);
      }
    };

    fetchData();
  }, [n]);

  const handleN = (n: number) => {
    if (n <= 100) {
      setN(n);
    } else {
      return "Please enter a number less than or equal to 100";
    }
  };

  return (
    <Card className="flex flex-col h-full w-full">
      <CardHeader>
        <CardTitle>{`Top ${n} users with most published properties`}</CardTitle>
        <CardDescription>{`The top ${n} users that have published the greatest number of properties.`}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col w-full h-full">
        <ChartContainer config={chartConfig} className="flex flex-col w-full h-full">
          <BarChart
            className="flex flex-col w-full h-full"
            accessibilityLayer
            margin={{ right: 16 }}
            data={topUsers}
            layout="vertical" // Change to horizontal for vertical bars
          >
            <CartesianGrid horizontal={false} />

            <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
              hide
            />
            <XAxis dataKey="count" type="number" />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" layout="vertical" fill="var(--color-count)" radius={4}>
              <LabelList dataKey="name" position="insideLeft" offset={8} className="fill-white" fontSize={12} />
              {/* <LabelList dataKey="count" position="right" offset={8} className="fill-foreground" fontSize={12} /> */}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
