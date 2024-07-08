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
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  type: z.array(z.string()).min(1, "Cannot be empty"),
  features: z.array(z.string()).min(1, "Cannot be empty"),
  bedrooms: z.number().int().min(1, "Cannot be empty").nullable(),
  bathrooms: z.number().int().min(1, "Cannot be empty").nullable(),
  capacity: z.number().int().min(1, "Cannot be empty").nullable(),
  photos: z.array(z.string()).min(1, "Cannot be empty"),
  price: z.number().min(1, "Cannot be empty").nullable(),
  areaSqm: z.number().min(1, "Cannot be empty").nullable(),
  isActive: z.boolean(),
  listingFlowStep: z.number().min(0, "Cannot be empty"),
});

export const updateTypeSchema = z.object({
  type: z.array(z.string()).min(1, "Cannot be empty"),
});

export type UpdateNameValues = z.infer<typeof updateNameSchema>;
export type UpdateEmailValues = z.infer<typeof updateEmailSchema>;
export type HomeType = z.infer<typeof homeSchema>;
export type UpdateTypeValues = z.infer<typeof updateTypeSchema>;
