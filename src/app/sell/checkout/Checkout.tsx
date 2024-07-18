"use client";
import { User } from "next-auth";
import { useContext, useEffect } from "react";
import { SellContext } from "@/context/SellContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  user: User;
  sellFlatIndex: number;
  sellFlowIndices: { outerIndex: number; innerIndex: number };
  stepPercentage: number[];
}

export default function Checkout({ user, sellFlatIndex, sellFlowIndices, stepPercentage }: Props) {
  const { setSellFlowFlatIndex, setSellFlowIndices, setStepPercentage, setIsLoading } = useContext(SellContext);

  useEffect(() => {
    setSellFlowIndices(sellFlowIndices);
    setSellFlowFlatIndex(sellFlatIndex);
    setStepPercentage(stepPercentage);
    setIsLoading(false);
  }, []);

  const freePerks = [
    {
      title: "Standard Listing",
      description: "Your property will be listed with basic visibility.",
    },
    {
      title: "Basic Support",
      description: "Get support within 24-48 hours.",
    },
    {
      title: "Limited Photos",
      description: "Upload up to 5 photos.",
    },
    {
      title: "No Social Media Promotion",
      description: "Your listing will not be promoted on our social media channels.",
    },
  ];

  const premiumPerks = [
    {
      title: "Featured Listing",
      description: "Your property will be highlighted and appear at the top of searches.",
    },
    {
      title: "Priority Support",
      description: "Get support within 1-2 hours.",
    },
    {
      title: "Unlimited Photos",
      description: "Upload unlimited photos.",
    },
    {
      title: "Social Media Promotion",
      description: "Your listing will be promoted on our social media channels.",
    },
  ];

  return (
    <div className="flex flex-col h-full w-full items-center gap-y-20">
      <div className="flex flex-col mb-20 w-full h-full justify-start items-center text-center gap-y-12">
        <div className="flex flex-col">
          <div className="flex items-center justify-center py-3">
            <h1 className="flex items-center text-3xl">Checkout</h1>
          </div>
          <div className="flex flex-col px-8 mt-5">
            <h3 className="text-lg w-full">Select your listing type</h3>
          </div>
        </div>
        <div className="flex flex-col gap-8 lg:flex-row w-full justify-between p-4">
          <div className="flex justify-center items-center w-full">
            <Card className="min-w-[300px] max-w-[500px] h-full">
              <CardHeader>
                <CardTitle className="flex justify-center items-center text-bold">Standard</CardTitle>
                <CardDescription className="flex justify-center items-center text-light">
                  Regular listing
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                {freePerks.map((perk, index) => (
                  <div key={index} className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
                    <span className="flex h-2 w-2 translate-y-1 rounded-full bg-primary" />
                    <div className="flex flex-col justify-start space-y-1 text-start">
                      <p className="flex justify-start text-sm font-medium leading-none">{perk.title}</p>
                      <p className="flex justify-start text-sm text-muted-foreground">{perk.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button className="w-full">Free Forever</Button>
              </CardFooter>
            </Card>
          </div>
          <div className="flex justify-center items-center w-full">
            <Card className="min-w-[300px] max-w-[500px] h-full">
              <CardHeader>
                <CardTitle className="flex justify-center items-center text-bold">Premium</CardTitle>
                <CardDescription className="flex justify-center items-center text-light">
                  Featured listing
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                {premiumPerks.map((perk, index) => (
                  <div key={index} className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
                    <span className="flex h-2 w-2 translate-y-1 rounded-full bg-primary" />
                    <div className="flex flex-col justify-start space-y-1 text-start">
                      <p className="flex justify-start text-sm font-medium leading-none">{perk.title}</p>
                      <p className="flex justify-start text-sm text-muted-foreground">{perk.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button className="w-full" disabled={true}>
                  Coming soon...
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
