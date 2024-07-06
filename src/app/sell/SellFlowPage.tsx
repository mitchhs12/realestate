"use client";

import { useForm } from "react-hook-form";
import { User } from "next-auth";
import { UpdateNameValues, updateNameSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormControl, FormItem, FormLabel, FormDescription, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Props {
  user: User;
}

export default function SellFlowPage({ user }: Props) {
  const form = useForm<UpdateNameValues>({
    resolver: zodResolver(updateNameSchema),
    defaultValues: { name: user.name || "" },
  });

  return (
    <main className="flex flex-col px-3 pt-2 items-start mx-8">
      <h1 className="max-w-7xl text-3xl font-medium">Sell your home</h1>
    </main>
  );
}
