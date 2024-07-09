import { z } from "zod";

export const updateNameSchema = z.object({
  name: z.string().trim().min(1, "Cannot be empty"),
});

export const updateEmailSchema = z.object({
  email: z.string().email("Invalid email").min(1, "Cannot be empty"),
});

export const homeSchema = z.object({
  id: z.number().int(),
  ownerId: z.string().trim().min(1, "Cannot be empty"),
  title: z.string().trim().min(1).nullable(),
  description: z.string().trim().min(1).nullable(),
  address: z.string().optional().nullable(),
  district: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  country: z.string().min(1).nullable(),
  latitude: z.number(),
  longitude: z.number(),
  type: z.array(z.string()),
  features: z.array(z.string()),
  bedrooms: z.number().int(),
  bathrooms: z.number().int(),
  livingrooms: z.number().int(),
  kitchens: z.number().int(),
  capacity: z.number().int(),
  photos: z.array(z.string()),
  price: z.number().min(1, "Cannot be empty"),
  areaSqm: z.number().min(1, "Cannot be empty"),
  isActive: z.boolean(),
  listingFlowStep: z.number().min(0, "Cannot be empty"),
});

export type UpdateNameValues = z.infer<typeof updateNameSchema>;
export type UpdateEmailValues = z.infer<typeof updateEmailSchema>;
export type HomeType = z.infer<typeof homeSchema>;
