"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { CreateCollectionSchema, UpdateCollectionSchema } from "@/lib/validations/collection";
import { canAddCollection, generateSlug } from "@/lib/plan";
import { revalidatePath } from "next/cache";

async function requireShopOwner(shopId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("UNAUTHORIZED");
  const shop = await prisma.shop.findUnique({ where: { id: shopId } });
  if (!shop || shop.ownerId !== session.user.id || shop.deletedAt)
    throw new Error("FORBIDDEN");
  return session.user.id;
}

async function requireCollectionOwner(collectionId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("UNAUTHORIZED");
  const collection = await prisma.collection.findUnique({
    where: { id: collectionId },
    include: { shop: true },
  });
  if (!collection || collection.shop.ownerId !== session.user.id || collection.deletedAt)
    throw new Error("FORBIDDEN");
  return { collection };
}

export async function createCollectionAction(shopId: string, data: unknown) {
  await requireShopOwner(shopId);

  const parsed = CreateCollectionSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const check = await canAddCollection(shopId);
  if (!check.allowed)
    return {
      error: `Collection limit reached (${check.current}/${check.limit}). Upgrade your plan to add more collections.`,
    };

  let slug = generateSlug(parsed.data.name);
  const existing = await prisma.collection.findUnique({
    where: { shopId_slug: { shopId, slug } },
  });
  if (existing) {
    slug = `${slug}-${Math.random().toString(36).slice(2, 5)}`;
  }

  const { name, description, type, coverUrl, coverPublicId, displayOrder, isActive, startsAt, endsAt } = parsed.data;

  const collection = await prisma.collection.create({
    data: {
      shopId,
      slug,
      name,
      description,
      type,
      coverUrl: coverUrl || null,
      coverPublicId: coverPublicId || null,
      displayOrder,
      isActive,
      startsAt: startsAt ? new Date(startsAt) : null,
      endsAt: endsAt ? new Date(endsAt) : null,
    },
  });

  revalidatePath(`/shops/${shopId}/collections`);
  return { success: true, collectionId: collection.id };
}

export async function updateCollectionAction(collectionId: string, data: unknown) {
  const { collection } = await requireCollectionOwner(collectionId);

  const parsed = UpdateCollectionSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { startsAt, endsAt, coverUrl, ...rest } = parsed.data;

  await prisma.collection.update({
    where: { id: collectionId },
    data: {
      ...rest,
      coverUrl: coverUrl !== undefined ? (coverUrl || null) : undefined,
      ...(startsAt !== undefined ? { startsAt: startsAt ? new Date(startsAt) : null } : {}),
      ...(endsAt !== undefined ? { endsAt: endsAt ? new Date(endsAt) : null } : {}),
    },
  });

  revalidatePath(`/shops/${collection.shopId}/collections`);
  return { success: true };
}

export async function deleteCollectionAction(collectionId: string) {
  const { collection } = await requireCollectionOwner(collectionId);

  await prisma.collection.update({
    where: { id: collectionId },
    data: { deletedAt: new Date(), isActive: false },
  });

  revalidatePath(`/shops/${collection.shopId}/collections`);
  return { success: true };
}

export async function addItemToCollectionAction(collectionId: string, itemId: string) {
  await requireCollectionOwner(collectionId);

  try {
    await prisma.itemCollection.create({ data: { collectionId, itemId } });
  } catch (err: unknown) {
    // Unique constraint violation means item is already in collection — ignore
    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      (err as { code: string }).code === "P2002"
    ) {
      return { success: true };
    }
    throw err;
  }

  return { success: true };
}

export async function removeItemFromCollectionAction(collectionId: string, itemId: string) {
  await requireCollectionOwner(collectionId);

  await prisma.itemCollection.deleteMany({ where: { collectionId, itemId } });

  return { success: true };
}
