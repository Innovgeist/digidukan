"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { CreateItemSchema, UpdateItemSchema } from "@/lib/validations/item";
import { canAddItem } from "@/lib/plan";
import { revalidatePath } from "next/cache";
import { deleteImageAction } from "./upload";

async function requireShopOwner(shopId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("UNAUTHORIZED");
  const shop = await prisma.shop.findUnique({ where: { id: shopId } });
  if (!shop || shop.ownerId !== session.user.id || shop.deletedAt)
    throw new Error("FORBIDDEN");
  return session.user.id;
}

async function requireItemOwner(itemId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("UNAUTHORIZED");
  const item = await prisma.item.findUnique({
    where: { id: itemId },
    include: { shop: true },
  });
  if (!item || item.shop.ownerId !== session.user.id || item.deletedAt)
    throw new Error("FORBIDDEN");
  return { item };
}

export async function createItemAction(shopId: string, data: unknown) {
  await requireShopOwner(shopId);

  const parsed = CreateItemSchema.safeParse(data);
  if (!parsed.success)
    return { error: parsed.error.issues[0].message };

  // Plan limit check
  const check = await canAddItem(shopId);
  if (!check.allowed)
    return {
      error: `Item limit reached (${check.current}/${check.limit}). Upgrade your plan to add more items.`,
    };

  const { price, oldPrice, ...rest } = parsed.data;

  const item = await prisma.item.create({
    data: {
      shopId,
      price: parseFloat(price),
      oldPrice: oldPrice ? parseFloat(oldPrice) : null,
      ...rest,
    },
  });

  revalidatePath(`/shops/${shopId}/items`);
  return { success: true, itemId: item.id };
}

export async function updateItemAction(itemId: string, data: unknown) {
  const { item } = await requireItemOwner(itemId);

  const parsed = UpdateItemSchema.safeParse(data);
  if (!parsed.success)
    return { error: parsed.error.issues[0].message };

  const { price, oldPrice, ...rest } = parsed.data;

  // If image changed, delete old one from Cloudinary
  if (rest.imagePublicId && item.imagePublicId && rest.imagePublicId !== item.imagePublicId) {
    await deleteImageAction(item.imagePublicId).catch(() => {});
  }

  await prisma.item.update({
    where: { id: itemId },
    data: {
      ...(price !== undefined ? { price: parseFloat(price) } : {}),
      ...(oldPrice !== undefined ? { oldPrice: oldPrice ? parseFloat(oldPrice) : null } : {}),
      ...rest,
    },
  });

  revalidatePath(`/shops/${item.shopId}/items`);
  return { success: true };
}

export async function deleteItemAction(itemId: string) {
  const { item } = await requireItemOwner(itemId);

  // Delete image from Cloudinary if exists
  if (item.imagePublicId) {
    await deleteImageAction(item.imagePublicId).catch(() => {});
  }

  // Soft delete
  await prisma.item.update({
    where: { id: itemId },
    data: { deletedAt: new Date() },
  });

  revalidatePath(`/shops/${item.shopId}/items`);
  return { success: true };
}

export async function toggleItemAvailabilityAction(itemId: string) {
  const { item } = await requireItemOwner(itemId);

  await prisma.item.update({
    where: { id: itemId },
    data: { isAvailable: !item.isAvailable },
  });

  revalidatePath(`/shops/${item.shopId}/items`);
  return { success: true, isAvailable: !item.isAvailable };
}
