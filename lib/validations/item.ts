import { z } from "zod";

export const CreateItemSchema = z.object({
  name: z.string().min(1, "Item name is required").max(150),
  itemType: z.enum(["PRODUCT", "SERVICE"]).default("PRODUCT"),
  price: z
    .string()
    .refine((v) => !isNaN(Number(v)) && Number(v) >= 0, "Enter a valid price"),
  oldPrice: z
    .string()
    .optional()
    .refine(
      (v) => !v || (!isNaN(Number(v)) && Number(v) >= 0),
      "Enter a valid old price"
    ),
  categoryId: z.string().optional().or(z.literal("")).transform(v => v === "" ? undefined : v),
  description: z.string().max(500).optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  imagePublicId: z.string().optional(),
  isAvailable: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  isBestseller: z.boolean().default(false),
  displayOrder: z.number().int().min(0).default(0),
  dietaryType: z.enum(["VEG", "NON_VEG", "EGG", "NA"]).default("NA"),
});

export const UpdateItemSchema = CreateItemSchema.partial();

export type CreateItemInput = z.infer<typeof CreateItemSchema>;
export type UpdateItemInput = z.infer<typeof UpdateItemSchema>;
