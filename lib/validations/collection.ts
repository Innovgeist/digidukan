import { z } from "zod";

export const CreateCollectionSchema = z.object({
  name: z.string().min(1, "Collection name is required").max(100),
  type: z.enum(["SEASONAL", "OCCASION", "FEATURED", "CUSTOM"]).default("CUSTOM"),
  description: z.string().max(300).optional(),
  coverUrl: z.string().url().optional().or(z.literal("")),
  coverPublicId: z.string().optional(),
  displayOrder: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
  startsAt: z.string().optional(),
  endsAt: z.string().optional(),
});

export const UpdateCollectionSchema = CreateCollectionSchema.partial();
export type CreateCollectionInput = z.infer<typeof CreateCollectionSchema>;
export type UpdateCollectionInput = z.infer<typeof UpdateCollectionSchema>;
