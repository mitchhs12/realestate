"use client";

import { User } from "next-auth";
import {
  getAllUserIds,
  getAllPropertyIds,
  transferMultiplePropertiesToAnotherUser,
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

interface Props {
  user: User;
}

export default function AdminPage({ user }: Props) {
  const [loading, setLoading] = useState(true);
  const [userIds, setUserIds] = useState<{ id: string; email: string | null }[]>([]);
  const [propertyIds, setPropertyIds] = useState<{ id: number; ownerId: string }[]>([]);
  const [selectedProperties, setSelectedProperties] = useState<number[]>([]);
  const [targetUser, setTargetUser] = useState<string | null>(null);
  const { toast } = useToast();

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
      <div className="flex flex-col w-full max-w-4xl gap-3">
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
    </main>
  );
}
