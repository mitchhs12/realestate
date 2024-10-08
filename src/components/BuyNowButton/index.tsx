"use client";
import { useState } from "react";
import { sendBuyMessage } from "@/app/[locale]/homes/actions";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { User } from "next-auth";
import { Icons } from "@/components/Icons/icons";
import { useTheme } from "next-themes";
import { House } from "lucide-react";

interface Props {
  homeId: number;
  user: User | undefined;
  buyNow: string;
  loginToPurchase: string;
  contactThanks: string;
}

export default function BuyNowButton({ homeId, user, buyNow, loginToPurchase, contactThanks }: Props) {
  const [buyingLoading, setBuyingLoading] = useState(false);
  const [buyingError, setBuyingError] = useState(null);
  const [messageSent, setMessageSent] = useState(false);
  const { resolvedTheme: theme } = useTheme();

  const handleBuyNow = async () => {
    setBuyingLoading(true);
    const result = await sendBuyMessage(homeId);
    if (!result.success) {
      setBuyingError(result.message);
    } else {
      setMessageSent(true);
    }
    setBuyingLoading(false);
  };

  return !messageSent ? (
    <Button
      onClick={handleBuyNow}
      className="flex items-center justify-center gap-2 w-full text-xs xs:text-sm"
      disabled={buyingLoading ? true : user ? false : true}
    >
      {buyingLoading ? (
        <span className="flex gap-3 w-full h-full justify-center items-center">
          <Skeleton className="w-20" />
        </span>
      ) : (
        <div className="flex items-center gap-2">
          <div className="flex">
            <House strokeWidth={1.8} size={20} />
          </div>
          <span className="text-xs md:text-sm">{user ? `${buyNow}` : loginToPurchase}</span>
        </div>
      )}
    </Button>
  ) : buyingError ? (
    <div>{buyingError}</div>
  ) : (
    <div className="flex w-full text-xs xs:text-sm md:text-sm">{contactThanks}</div>
  );
}
