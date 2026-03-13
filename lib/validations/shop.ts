import { z } from "zod";

export const CreateShopSchema = z.object({
  name: z.string().min(2, "Shop name must be at least 2 characters").max(100),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .max(60)
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  businessType: z.enum(["RETAIL", "SERVICE", "MIXED"]),
  phone: z.string().min(10, "Enter a valid phone number"),
  whatsappNumber: z.string().min(10, "Enter a valid WhatsApp number"),
  description: z.string().max(500).optional(),
  email: z.string().email().optional().or(z.literal("")),
  address: z.string().max(200).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  country: z.string().default("India"),
  postalCode: z.string().max(20).optional(),
  mapsUrl: z.string().url("Enter a valid URL").optional().or(z.literal("")),
});

export const UpdateShopSchema = CreateShopSchema.partial().extend({
  name: z.string().min(2).max(100).optional(),
  slug: z
    .string()
    .min(2)
    .max(60)
    .regex(/^[a-z0-9-]+$/)
    .optional(),
});

export const ShopSettingsSchema = z.object({
  isOpen: z.boolean(),
  businessHoursEnabled: z.boolean(),
});

export const ShopBannerSchema = z.object({
  text: z.string().min(1, "Banner text is required").max(200),
  isActive: z.boolean(),
  expiresAt: z.string().optional(),
});

export const ShopBrandingSchema = z.object({
  primaryColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color")
    .default("#3B82F6"),
  logoUrl: z.string().url().optional().or(z.literal("")),
  logoPublicId: z.string().optional(),
  coverUrl: z.string().url().optional().or(z.literal("")),
  coverPublicId: z.string().optional(),
});

export type CreateShopInput = z.infer<typeof CreateShopSchema>;
export type UpdateShopInput = z.infer<typeof UpdateShopSchema>;
export type ShopBrandingInput = z.infer<typeof ShopBrandingSchema>;
export type ShopBannerInput = z.infer<typeof ShopBannerSchema>;
