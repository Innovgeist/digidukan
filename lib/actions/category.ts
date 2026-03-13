"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { CreateCategorySchema, UpdateCategorySchema } from "@/lib/validations/category";
import { canAddCategory, generateSlug } from "@/lib/plan";
import { revalidatePath } from "next/cache";

async function requireShopOwner(shopId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("UNAUTHORIZED");
  const shop = await prisma.shop.findUnique({ where: { id: shopId } });
  if (!shop || shop.ownerId !== session.user.id || shop.deletedAt)
    throw new Error("FORBIDDEN");
  return session.user.id;
}

async function requireCategoryOwner(categoryId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("UNAUTHORIZED");
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    include: { shop: true },
  });
  if (!category || category.shop.ownerId !== session.user.id || category.deletedAt)
    throw new Error("FORBIDDEN");
  return { category };
}

export async function createCategoryAction(shopId: string, data: unknown) {
  await requireShopOwner(shopId);

  const parsed = CreateCategorySchema.safeParse(data);
  if (!parsed.success)
    return { error: parsed.error.issues[0].message };

  // Plan limit check
  const check = await canAddCategory(shopId);
  if (!check.allowed)
    return {
      error: `Category limit reached (${check.current}/${check.limit}). Upgrade your plan for more categories.`,
    };

  // Generate unique slug within shop
  let slug = generateSlug(parsed.data.name);
  const existing = await prisma.category.findUnique({
    where: { shopId_slug: { shopId, slug } },
  });
  if (existing) {
    slug = `${slug}-${Math.random().toString(36).slice(2, 5)}`;
  }

  const category = await prisma.category.create({
    data: {
      shopId,
      name: parsed.data.name,
      slug,
      description: parsed.data.description,
      displayOrder: parsed.data.displayOrder,
    },
  });

  revalidatePath(`/shops/${shopId}/categories`);
  return { success: true, categoryId: category.id };
}

export async function updateCategoryAction(categoryId: string, data: unknown) {
  const { category } = await requireCategoryOwner(categoryId);

  const parsed = UpdateCategorySchema.safeParse(data);
  if (!parsed.success)
    return { error: parsed.error.issues[0].message };

  await prisma.category.update({
    where: { id: categoryId },
    data: parsed.data,
  });

  revalidatePath(`/shops/${category.shopId}/categories`);
  return { success: true };
}

export async function deleteCategoryAction(categoryId: string) {
  const { category } = await requireCategoryOwner(categoryId);

  // Block if category has active items
  const itemCount = await prisma.item.count({
    where: { categoryId, deletedAt: null },
  });
  if (itemCount > 0)
    return {
      error: `Cannot delete: ${itemCount} item(s) use this category. Reassign or delete items first.`,
    };

  // Soft delete
  await prisma.category.update({
    where: { id: categoryId },
    data: { deletedAt: new Date(), isActive: false },
  });

  revalidatePath(`/shops/${category.shopId}/categories`);
  return { success: true };
}

export async function reorderCategoriesAction(
  shopId: string,
  orders: { id: string; displayOrder: number }[]
) {
  await requireShopOwner(shopId);

  await prisma.$transaction(
    orders.map(({ id, displayOrder }) =>
      prisma.category.update({ where: { id }, data: { displayOrder } })
    )
  );

  revalidatePath(`/shops/${shopId}/categories`);
  return { success: true };
}
