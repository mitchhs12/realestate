"use client";

import { User } from "next-auth";
import {
  getAllUserIds,
  getAllPropertyIds,
  transferMultiplePropertiesToAnotherUser,
  listPortalConfigs,
  createPortalConfig,
  getPortalConfig,
  updatePortalConfig,
  createCoupon,
} from "@/app/[locale]/admin/actions";
import { useEffect, useState, useMemo } from "react";
import {
  Select,
  SelectGroup,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ReloadIcon } from "@radix-ui/react-icons";
import MultiSelect from "@/components/ui/multiselect";
import { Input } from "@/components/ui/input";
import { changeSellerMode } from "../actions";
import { useSession } from "next-auth/react";

interface Props {
  user: User;
}

export default function AdminPage({ user }: Props) {
  const [loading, setLoading] = useState(true);
  const [userIds, setUserIds] = useState<{ id: string; email: string | null }[]>([]);
  const [propertyIds, setPropertyIds] = useState<{ id: number; ownerId: string }[]>([]);
  const [selectedProperties, setSelectedProperties] = useState<number[]>([]);
  const [targetUser, setTargetUser] = useState<string | null>(null);
  const [couponAmount, setCouponAmount] = useState<null | number>(null);
  const [generatingCoupon, setGeneratingCoupon] = useState(false);
  const [newCouponCode, setNewCouponCode] = useState<string | null>(null);
  const [duration, setDuration] = useState<any>(null);
  const [repeatingDuration, setRepeatingDuration] = useState<number | undefined>(undefined);
  const { toast } = useToast();
  const session = useSession();

  useEffect(() => {
    setLoading(true);
    getAllUserIds().then((data) => setUserIds(data));
    getAllPropertyIds().then((data) => setPropertyIds(data));
    setLoading(false);
  }, [user]);

  const handleTransfer = async () => {
    setLoading(true);
    if (!selectedProperties.length || !targetUser) {
      console.log("No property or target user selected");
      return;
    }
    try {
      await transferMultiplePropertiesToAnotherUser(selectedProperties, targetUser);
      toast({
        title: "Property Transferred",
        description: `Property ${selectedProperties} have been transferred to ${targetUser}`,
        duration: 5000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to transfer property",
        duration: 5000,
      });
    }
    setLoading(false);
  };

  return (
    <main className="flex flex-col px-3 py-10 items-start mx-8 gap-6">
      <h1 className="max-w-7xl space-y-6 text-3xl font-bold">Admin Control</h1>
      <div className="flex flex-col max-w-4xl gap-20">
        <div className="flex flex-col gap-6">
          <h3 className="text-xl">Billing Portal Management</h3>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <div className="flex gap-3 items-center">
                All:{" "}
                <Button
                  onClick={() => {
                    listPortalConfigs().then((result) => {
                      console.log(JSON.stringify(result, null, 2));
                    });
                  }}
                >
                  List Billing Portal Configs
                </Button>
              </div>
              <div className="flex gap-3 items-center">
                Buyers:
                <Button
                  disabled={false}
                  onClick={() => {
                    createPortalConfig(false);
                  }}
                >
                  Create
                </Button>
                <Button disabled={false} onClick={() => updatePortalConfig(false)}>
                  Update
                </Button>
                <Button
                  onClick={() =>
                    getPortalConfig(true).then((result) => {
                      console.log(JSON.stringify(result, null, 2));
                    })
                  }
                >
                  Get
                </Button>
              </div>
              <div className="flex gap-3 items-center">
                Sellers:
                <Button
                  disabled={false}
                  onClick={() => {
                    createPortalConfig(true);
                  }}
                >
                  Create
                </Button>
                <Button disabled={false} onClick={() => updatePortalConfig(true)}>
                  Update
                </Button>
                <Button
                  onClick={() =>
                    getPortalConfig(true).then((result) => {
                      console.log(JSON.stringify(result, null, 2));
                    })
                  }
                >
                  Get
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-xl">Coupon Codes</h2>
          <div className="flex flex-col justify-center items-start gap-3">
            <Select onValueChange={setDuration}>
              <SelectTrigger>
                <SelectValue placeholder="Select a coupon duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Durations</SelectLabel>
                  <SelectItem value="once">
                    Once (Applies to the first charge from a subscription with this coupon applied. )
                  </SelectItem>
                  <SelectItem value="repeating">
                    Repeating (Applies to charges in the first months from a subscription with this coupon applied. )
                  </SelectItem>
                  <SelectItem value="forever">
                    Forever (Applies to all charges from a subscription with this coupon applied. )
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            {duration === "repeating" && (
              <div className="flex items-center gap-3">
                <div className="w-full">Enter time in months:</div>
                <Input
                  className="w-32"
                  placeholder={String(12)}
                  type={"number"}
                  onChange={(e) => {
                    setRepeatingDuration(Number(e.target.value));
                  }}
                />
              </div>
            )}
            <div className="flex gap-2 items-center text-2xl">
              <Input
                placeholder={String(33.3)}
                type={"number"}
                onChange={(e) => {
                  setCouponAmount(Number(e.target.value));
                }}
              />
              %
            </div>
            <Button
              disabled={
                !couponAmount ||
                couponAmount < 0 ||
                couponAmount > 100 ||
                !duration ||
                (duration === "repeating" && (!repeatingDuration || repeatingDuration < 1)) ||
                generatingCoupon
              }
              onClick={() => {
                if (couponAmount) {
                  setGeneratingCoupon(true);
                  createCoupon(couponAmount, duration, repeatingDuration).then((coupon) => {
                    setNewCouponCode(coupon);
                    setGeneratingCoupon(false);
                  });
                }
              }}
              type={"submit"}
            >
              {generatingCoupon ? (
                <div className="flex gap-3 items-center">
                  <ReloadIcon className="w-6 h-6 animate-spin" />
                  Loading...{" "}
                </div>
              ) : (
                "Generate Coupon"
              )}
            </Button>
            {newCouponCode && (
              <div className="flex items-center gap-3">
                <div>New Coupon Code:</div>
                <div>{newCouponCode}</div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col w-full gap-3">
          <h2 className="text-xl">Transfer Property</h2>
          <div className="flex flex-col w-full items-center">
            <MultiSelect
              items={propertyIds.map((property) => ({
                id: property.id,
                // find email from ownerId
                label: `Property ${property.id} - Owner: ${userIds.find((user) => user.id === property.ownerId)?.email}`,
              }))}
              selectedItems={selectedProperties}
              onChange={setSelectedProperties}
            />
          </div>
          {selectedProperties.length > 0 && (
            <div className="flex flex-col w-full gap-3 max-w-4xl items-center">
              <h2 className="flex w-full text-xl">Transfer to:</h2>
              <Select
                disabled={loading}
                onValueChange={(value) => {
                  setTargetUser(value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a User ID" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>User IDs</SelectLabel>
                    {userIds.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.email || "No Email"}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          )}
          {targetUser && (
            <Button disabled={loading} className="w-[100px]" onClick={handleTransfer}>
              {loading ? <ReloadIcon className="animate-spin w-6 h-6" /> : "Transfer"}
            </Button>
          )}
        </div>
        <div className="flex flex-col gap-3 w-full">
          <h2 className="text-xl">Reset Account SellerMode</h2>
          <Button
            onClick={() => {
              setLoading(true);
              changeSellerMode().then(() => {
                setLoading(false);
                session.update();
              });
            }}
            disabled={loading}
          >
            {loading ? <ReloadIcon className="animate-spin w-6 h-6" /> : "Reset to 'null'"}
          </Button>
        </div>
      </div>
    </main>
  );
}
