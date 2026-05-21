/**
 * Seeds a premium "Royal Brew & Co." heritage cafe with categories, items, and
 * a curated Unsplash image for each item. Idempotent — re-run any time.
 *
 *   npx tsx scripts/seed-cafe.ts
 *
 * Storefront URL after seeding: /s/royal-brew-cafe
 * Owner login:  cafe@demo.com / Demo@1234
 */

import { PrismaClient, type DietaryType, type ItemType } from "@prisma/client";
import bcrypt from "bcryptjs";
import { readFileSync } from "node:fs";

// Load .env for DATABASE_URL etc.
for (const line of readFileSync(".env", "utf8").split(/\r?\n/)) {
  const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
  if (m) process.env[m[1]] = m[2].replace(/^"|"$/g, "");
}

const prisma = new PrismaClient();

const SHOP_SLUG = "royal-brew-cafe";
const OWNER_EMAIL = "cafe@demo.com";
const OWNER_PASSWORD = "Demo@1234";

// Unsplash direct photo URLs — free for commercial use, no API key required.
// Format: https://images.unsplash.com/photo-{id}?w=800&auto=format&fit=crop&q=80
const img = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=800&auto=format&fit=crop&q=80`;

type SeedItem = {
  name: string;
  price: number;
  oldPrice?: number;
  description: string;
  imageId: string; // Unsplash photo ID
  isFeatured?: boolean;
  isBestseller?: boolean;
  dietaryType?: DietaryType;
  itemType?: ItemType;
};

type SeedCategory = {
  name: string;
  slug: string;
  description: string;
  items: SeedItem[];
};

const MENU: SeedCategory[] = [
  {
    name: "Espresso Bar",
    slug: "espresso-bar",
    description: "Single-origin espressos crafted by our resident barista.",
    items: [
      {
        name: "Cappuccino",
        price: 220,
        description:
          "A double shot of espresso topped with velvet-textured milk foam, finished with a whisper of cocoa.",
        imageId: "1572442388796-11668a67e53d",
        isBestseller: true,
        dietaryType: "VEG",
      },
      {
        name: "Espresso Doppio",
        price: 180,
        description:
          "Two ounces of intensity — our house blend pulled at exactly 25 seconds, neat.",
        imageId: "1510707577719-ae7c14805e3a",
        dietaryType: "VEG",
      },
      {
        name: "Café Latte",
        price: 240,
        description:
          "Espresso laid over silken steamed milk with a delicate rosetta of latte art.",
        imageId: "1541167760496-1628856ab772",
        isFeatured: true,
        dietaryType: "VEG",
      },
      {
        name: "Americano",
        price: 190,
        description:
          "A long, clean cup — espresso lengthened with hot water for an unhurried morning.",
        imageId: "1521302200778-33500795e128",
        dietaryType: "VEG",
      },
      {
        name: "Mocha Royale",
        price: 280,
        oldPrice: 320,
        description:
          "Dark Belgian chocolate folded into espresso, crowned with whipped cream and cocoa nibs.",
        imageId: "1517701604599-bb29b565090c",
        isFeatured: true,
        dietaryType: "VEG",
      },
    ],
  },
  {
    name: "Brews & Botanicals",
    slug: "brews-botanicals",
    description: "Loose-leaf teas and infusions sourced from heritage estates.",
    items: [
      {
        name: "Royal Masala Chai",
        price: 140,
        description:
          "Assam tea simmered with cardamom, cinnamon, and clove — served in a heritage brass pot.",
        imageId: "1597481499750-3e6b22637e12",
        isBestseller: true,
        dietaryType: "VEG",
      },
      {
        name: "Earl Grey Imperial",
        price: 180,
        description:
          "Ceylon black tea perfumed with bergamot oil from Calabria. A cup for quiet afternoons.",
        imageId: "1576092768241-dec231879fc3",
        dietaryType: "VEG",
      },
      {
        name: "Matcha Ceremonial",
        price: 260,
        description:
          "Stone-ground Japanese matcha whisked into warm foam — vivid, earthy, restorative.",
        imageId: "1515823064-d6e0c04616a7",
        isFeatured: true,
        dietaryType: "VEG",
      },
      {
        name: "Chamomile & Honey",
        price: 160,
        description:
          "Egyptian chamomile flowers infused slowly, sweetened with wild forest honey.",
        imageId: "1576092762791-dd9e2220abd1",
        dietaryType: "VEG",
      },
    ],
  },
  {
    name: "Patisserie",
    slug: "patisserie",
    description: "Hand-laminated viennoiserie baked fresh each morning.",
    items: [
      {
        name: "Butter Croissant",
        price: 150,
        description:
          "Forty-eight hours of cold lamination, finished with French cultured butter.",
        imageId: "1555507036-ab1f4038808a",
        isBestseller: true,
        dietaryType: "VEG",
      },
      {
        name: "Pain au Chocolat",
        price: 180,
        description:
          "Two batons of single-estate dark chocolate folded into croissant dough.",
        imageId: "1509440159596-0249088772ff",
        dietaryType: "VEG",
      },
      {
        name: "Cinnamon Roll",
        price: 200,
        description:
          "Slow-proved dough swirled with Saigon cinnamon and finished with brown-butter glaze.",
        imageId: "1607920591413-4ec007e70023",
        isFeatured: true,
        dietaryType: "VEG",
      },
      {
        name: "Almond Danish",
        price: 220,
        description:
          "Buttery laminated pastry filled with marzipan and topped with toasted almond petals.",
        imageId: "1620921568790-c1cf8984624c",
        dietaryType: "EGG",
      },
    ],
  },
  {
    name: "All-Day Plates",
    slug: "all-day-plates",
    description: "Composed plates for breakfast through to early evening.",
    items: [
      {
        name: "Avocado on Sourdough",
        price: 340,
        description:
          "Crushed avocado, lemon zest, and aleppo flake on house-baked sourdough.",
        imageId: "1588137378633-dea1336ce1e2",
        dietaryType: "VEG",
      },
      {
        name: "Club Royale",
        price: 380,
        description:
          "Slow-roasted chicken, smoked streaky bacon, and aged cheddar on toasted brioche.",
        imageId: "1528735602780-2552fd46c7af",
        isBestseller: true,
        dietaryType: "NON_VEG",
      },
      {
        name: "Grilled Halloumi Salad",
        price: 320,
        description:
          "Charred halloumi over heirloom greens with pomegranate and mint vinaigrette.",
        imageId: "1546069901-ba9599a7e63c",
        dietaryType: "VEG",
      },
    ],
  },
  {
    name: "Sweet Conclusions",
    slug: "sweet-conclusions",
    description: "Patisserie desserts — restrained, elegant, intentional.",
    items: [
      {
        name: "Tiramisu Classico",
        price: 280,
        description:
          "Espresso-soaked savoiardi layered with mascarpone cream and Amaretto.",
        imageId: "1571877227200-a0d98ea607e9",
        isFeatured: true,
        dietaryType: "EGG",
      },
      {
        name: "Basque Cheesecake",
        price: 260,
        oldPrice: 300,
        description:
          "Caramelised top, custard-soft centre, finished with sea-salt flakes.",
        imageId: "1551024601-bec78aea704b",
        isBestseller: true,
        dietaryType: "EGG",
      },
      {
        name: "Dark Chocolate Truffle",
        price: 240,
        description:
          "Single-origin Ecuadorian chocolate ganache rolled in cocoa, three to a serving.",
        imageId: "1606313564200-e75d5e30476c",
        dietaryType: "VEG",
      },
    ],
  },
];

async function main() {
  console.log("☕  Seeding Royal Brew & Co. (premium heritage cafe)…\n");

  // Plans
  const paidPlan = await prisma.plan.findFirst({
    where: { planType: "PAID_MONTHLY", isActive: true },
  });
  if (!paidPlan) throw new Error("No active PAID_MONTHLY plan — run the main seed first.");

  // Owner
  const passwordHash = await bcrypt.hash(OWNER_PASSWORD, 12);
  const owner = await prisma.user.upsert({
    where: { email: OWNER_EMAIL },
    update: { passwordHash, name: "Royal Brew Owner" },
    create: {
      email: OWNER_EMAIL,
      name: "Royal Brew Owner",
      passwordHash,
      role: "OWNER",
      ownerProfile: { create: { onboardingStep: 3, onboardingDone: true } },
    },
  });
  console.log(`✅ Owner: ${owner.email}`);

  // Shop
  const shop = await prisma.shop.upsert({
    where: { slug: SHOP_SLUG },
    update: {
      isPremium: true,
      status: "PUBLISHED",
      isOpen: true,
      lastPublishedAt: new Date(),
    },
    create: {
      ownerId: owner.id,
      name: "Royal Brew & Co.",
      slug: SHOP_SLUG,
      businessType: "RETAIL",
      phone: "+919876501234",
      whatsappNumber: "+919876501234",
      description:
        "An unhurried café in the heart of the city — heritage brews, hand-laminated patisserie, and plates composed with intention.",
      address: "12 Lansdowne Road, Civil Lines",
      city: "Bengaluru",
      state: "Karnataka",
      postalCode: "560001",
      mapsUrl: "https://maps.google.com/?q=Bengaluru+cafe",
      status: "PUBLISHED",
      isOpen: true,
      isPremium: true,
      businessHoursEnabled: true,
      lastPublishedAt: new Date(),
      branding: {
        create: {
          primaryColor: "#0e4a3a",
          coverUrl:
            "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1600&auto=format&fit=crop&q=85",
        },
      },
      subscription: {
        create: { planId: paidPlan.id, isActive: true },
      },
      banner: {
        create: {
          text: "New seasonal release — Mocha Royale, now available.",
          isActive: true,
        },
      },
      hours: {
        createMany: {
          data: [
            { dayOfWeek: 0, openTime: "08:00", closeTime: "22:00", isClosed: false },
            { dayOfWeek: 1, openTime: "07:30", closeTime: "22:00", isClosed: false },
            { dayOfWeek: 2, openTime: "07:30", closeTime: "22:00", isClosed: false },
            { dayOfWeek: 3, openTime: "07:30", closeTime: "22:00", isClosed: false },
            { dayOfWeek: 4, openTime: "07:30", closeTime: "23:00", isClosed: false },
            { dayOfWeek: 5, openTime: "07:30", closeTime: "23:00", isClosed: false },
            { dayOfWeek: 6, openTime: "08:00", closeTime: "23:00", isClosed: false },
          ],
        },
      },
    },
  });
  console.log(`✅ Shop:  ${shop.name} (/s/${shop.slug})  premium=${shop.isPremium}`);

  // Wipe existing items + categories for clean re-seed
  await prisma.itemCollection.deleteMany({
    where: { item: { shopId: shop.id } },
  });
  await prisma.item.deleteMany({ where: { shopId: shop.id } });
  await prisma.collection.deleteMany({ where: { shopId: shop.id } });
  await prisma.category.deleteMany({ where: { shopId: shop.id } });

  const featuredItems: { id: string }[] = [];
  const bestsellerItems: { id: string }[] = [];

  // Categories + items
  let displayOrder = 0;
  for (const cat of MENU) {
    const category = await prisma.category.create({
      data: {
        shopId: shop.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        displayOrder: displayOrder++,
      },
    });

    let itemOrder = 0;
    for (const it of cat.items) {
      const item = await prisma.item.create({
        data: {
          shopId: shop.id,
          categoryId: category.id,
          name: it.name,
          itemType: it.itemType ?? "PRODUCT",
          price: it.price,
          oldPrice: it.oldPrice ?? null,
          description: it.description,
          imageUrl: img(it.imageId),
          isAvailable: true,
          isFeatured: it.isFeatured ?? false,
          isBestseller: it.isBestseller ?? false,
          dietaryType: it.dietaryType ?? "NA",
          displayOrder: itemOrder++,
        },
      });
      if (it.isFeatured) featuredItems.push({ id: item.id });
      if (it.isBestseller) bestsellerItems.push({ id: item.id });
    }
    console.log(`   ├─ ${cat.name}: ${cat.items.length} items`);
  }

  // Collection — Bestsellers
  if (bestsellerItems.length > 0) {
    const bestsellersCollection = await prisma.collection.create({
      data: {
        shopId: shop.id,
        name: "Most Loved",
        slug: "most-loved",
        description: "The selections our regulars return for.",
        type: "FEATURED",
        displayOrder: 0,
      },
    });
    for (const it of bestsellerItems) {
      await prisma.itemCollection.create({
        data: { itemId: it.id, collectionId: bestsellersCollection.id },
      });
    }
  }

  // Collection — Featured / Seasonal
  if (featuredItems.length > 0) {
    const featuredCollection = await prisma.collection.create({
      data: {
        shopId: shop.id,
        name: "Seasonal Selection",
        slug: "seasonal-selection",
        description: "Curated for the current season — limited release.",
        type: "SEASONAL",
        displayOrder: 1,
      },
    });
    for (const it of featuredItems) {
      await prisma.itemCollection.create({
        data: { itemId: it.id, collectionId: featuredCollection.id },
      });
    }
  }

  console.log("\n──────────────────────────────────────");
  console.log(`Storefront:  http://localhost:3000/s/${SHOP_SLUG}`);
  console.log(`Owner login: ${OWNER_EMAIL} / ${OWNER_PASSWORD}`);
  console.log("──────────────────────────────────────");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
