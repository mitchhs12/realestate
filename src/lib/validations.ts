import { z } from "zod";

export const updateNameSchema = z.object({
  name: z.string().trim().min(1, "Cannot be empty"),
});

export const updateEmailSchema = z.object({
  email: z.string().email("Invalid email").min(1, "Cannot be empty"),
});

export const createListingSchema = z.object({
  ownerId: z.string().trim().min(1, "Cannot be empty"),
  title: z.string().trim().min(1, "Cannot be empty"),
  description: z.string().trim().min(1, "Cannot be empty"),
  address: z.string().optional().nullable(),
  district: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  country: z.string().min(1, "Cannot be empty"),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  type: z.array(z.string()).min(1, "Cannot be empty"),
  features: z.array(z.string()).min(1, "Cannot be empty"),
  bedrooms: z.number().int().min(1, "Cannot be empty"),
  bathrooms: z.number().int().min(1, "Cannot be empty"),
  capacity: z.number().int().min(1, "Cannot be empty"),
  photos: z.array(z.string()).min(1, "Cannot be empty"),
  price: z.number().min(1, "Cannot be empty"),
  areaSqm: z.number().min(1, "Cannot be empty"),
  listingFlowStep: z.number().min(0, "Cannot be empty"),
});

export type UpdateNameValues = z.infer<typeof updateNameSchema>;
export type UpdateEmailValues = z.infer<typeof updateEmailSchema>;
export type CreateListingValues = z.infer<typeof createListingSchema>;
