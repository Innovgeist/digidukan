import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ─── Plans ──────────────────────────────────────────────────────────────────
  const freePlan = await prisma.plan.upsert({
    where: { name: "Free" },
    update: {},
    create: {
      name: "Free",
      planType: "FREE",
      maxShops: 1,
      maxItems: 25,
      maxCategories: 3,
      maxCollections: 2,
      analyticsEnabled: false,
      pdfExportEnabled: false,
      watermarkEnabled: true,
      customBranding: false,
    },
  });

  const paidPlan = await prisma.plan.upsert({
    where: { name: "Paid Monthly" },
    update: {},
    create: {
      name: "Paid Monthly",
      planType: "PAID_MONTHLY",
      maxShops: 3,
      maxItems: 500,
      maxCategories: -1,
      maxCollections: -1,
      analyticsEnabled: true,
      pdfExportEnabled: true,
      watermarkEnabled: false,
      customBranding: true,
    },
  });

  console.log("✅ Plans created:", freePlan.name, "|", paidPlan.name);

  // ─── Super Admin ─────────────────────────────────────────────────────────────
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@digidukan.com";
  const adminRawPassword = process.env.ADMIN_PASSWORD ?? "Admin@1234";
  if (!adminRawPassword) {
    throw new Error("ADMIN_PASSWORD env var is required for seeding. Set it before running this script.");
  }
  const adminPassword = await bcrypt.hash(adminRawPassword, 12);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash: adminPassword },
    create: {
      email: adminEmail,
      name: "Super Admin",
      passwordHash: adminPassword,
      role: "SUPER_ADMIN",
    },
  });

  console.log("✅ Super admin created:", admin.email);

  // ─── Demo Owner 1: Raj (Free Plan — Restaurant) ────────────────────────────
  const demoPassword = await bcrypt.hash("Demo@1234", 12);

  const raj = await prisma.user.upsert({
    where: { email: "raj@demo.com" },
    update: { passwordHash: demoPassword },
    create: {
      email: "raj@demo.com",
      name: "Raj Sharma",
      passwordHash: demoPassword,
      role: "OWNER",
      ownerProfile: {
        create: { onboardingStep: 3, onboardingDone: true },
      },
    },
  });

  const rajShop = await prisma.shop.upsert({
    where: { slug: "raj-ka-dhaba" },
    update: {},
    create: {
      ownerId: raj.id,
      name: "Raj Ka Dhaba",
      slug: "raj-ka-dhaba",
      businessType: "RETAIL",
      phone: "+919876543210",
      whatsappNumber: "+919876543210",
      description: "Authentic North Indian street food and thali meals since 1998.",
      address: "Shop 12, Main Market, Lajpat Nagar",
      city: "New Delhi",
      state: "Delhi",
      postalCode: "110024",
      status: "PUBLISHED",
      isOpen: true,
      lastPublishedAt: new Date(),
      branding: {
        create: { primaryColor: "#E53E3E" },
      },
      subscription: {
        create: { planId: freePlan.id, isActive: true },
      },
      banner: {
        create: {
          text: "Free delivery on orders above ₹300!",
          isActive: true,
        },
      },
      hours: {
        createMany: {
          data: [
            { dayOfWeek: 0, openTime: "10:00", closeTime: "22:00", isClosed: false },
            { dayOfWeek: 1, openTime: "10:00", closeTime: "22:00", isClosed: false },
            { dayOfWeek: 2, openTime: "10:00", closeTime: "22:00", isClosed: false },
            { dayOfWeek: 3, openTime: "10:00", closeTime: "22:00", isClosed: false },
            { dayOfWeek: 4, openTime: "10:00", closeTime: "22:00", isClosed: false },
            { dayOfWeek: 5, openTime: "10:00", closeTime: "23:00", isClosed: false },
            { dayOfWeek: 6, openTime: "10:00", closeTime: "23:00", isClosed: false },
          ],
        },
      },
    },
  });

  // Categories for Raj Ka Dhaba
  const rajStarters = await prisma.category.upsert({
    where: { shopId_slug: { shopId: rajShop.id, slug: "starters" } },
    update: {},
    create: {
      shopId: rajShop.id,
      name: "Starters",
      slug: "starters",
      description: "Crispy & spicy appetizers",
      displayOrder: 0,
    },
  });

  const rajMainCourse = await prisma.category.upsert({
    where: { shopId_slug: { shopId: rajShop.id, slug: "main-course" } },
    update: {},
    create: {
      shopId: rajShop.id,
      name: "Main Course",
      slug: "main-course",
      description: "Hearty North Indian meals",
      displayOrder: 1,
    },
  });

  const rajBeverages = await prisma.category.upsert({
    where: { shopId_slug: { shopId: rajShop.id, slug: "beverages" } },
    update: {},
    create: {
      shopId: rajShop.id,
      name: "Beverages",
      slug: "beverages",
      description: "Hot & cold drinks",
      displayOrder: 2,
    },
  });

  // Items for Raj Ka Dhaba
  const rajItems = await Promise.all([
    prisma.item.create({
      data: {
        shopId: rajShop.id,
        categoryId: rajStarters.id,
        name: "Paneer Tikka",
        itemType: "PRODUCT",
        price: 220,
        description: "Marinated cottage cheese grilled in tandoor",
        isAvailable: true,
        isFeatured: true,
        dietaryType: "VEG",
        displayOrder: 0,
      },
    }),
    prisma.item.create({
      data: {
        shopId: rajShop.id,
        categoryId: rajStarters.id,
        name: "Chicken Seekh Kebab",
        itemType: "PRODUCT",
        price: 280,
        oldPrice: 320,
        description: "Minced chicken kebabs with aromatic spices",
        isAvailable: true,
        dietaryType: "NON_VEG",
        displayOrder: 1,
      },
    }),
    prisma.item.create({
      data: {
        shopId: rajShop.id,
        categoryId: rajStarters.id,
        name: "Aloo Tikki Chaat",
        itemType: "PRODUCT",
        price: 120,
        description: "Crispy potato patties with tangy chutneys",
        isAvailable: true,
        isBestseller: true,
        dietaryType: "VEG",
        displayOrder: 2,
      },
    }),
    prisma.item.create({
      data: {
        shopId: rajShop.id,
        categoryId: rajMainCourse.id,
        name: "Dal Makhani",
        itemType: "PRODUCT",
        price: 180,
        description: "Slow-cooked black lentils in creamy gravy",
        isAvailable: true,
        isBestseller: true,
        isFeatured: true,
        dietaryType: "VEG",
        displayOrder: 0,
      },
    }),
    prisma.item.create({
      data: {
        shopId: rajShop.id,
        categoryId: rajMainCourse.id,
        name: "Butter Chicken",
        itemType: "PRODUCT",
        price: 280,
        description: "Tender chicken in rich tomato-butter sauce",
        isAvailable: true,
        isBestseller: true,
        dietaryType: "NON_VEG",
        displayOrder: 1,
      },
    }),
    prisma.item.create({
      data: {
        shopId: rajShop.id,
        categoryId: rajMainCourse.id,
        name: "Chole Bhature",
        itemType: "PRODUCT",
        price: 150,
        description: "Spiced chickpea curry with fried bread",
        isAvailable: true,
        dietaryType: "VEG",
        displayOrder: 2,
      },
    }),
    prisma.item.create({
      data: {
        shopId: rajShop.id,
        categoryId: rajMainCourse.id,
        name: "Egg Curry",
        itemType: "PRODUCT",
        price: 160,
        description: "Boiled eggs in spicy onion-tomato gravy",
        isAvailable: true,
        dietaryType: "EGG",
        displayOrder: 3,
      },
    }),
    prisma.item.create({
      data: {
        shopId: rajShop.id,
        categoryId: rajBeverages.id,
        name: "Masala Chai",
        itemType: "PRODUCT",
        price: 30,
        description: "Classic Indian spiced tea",
        isAvailable: true,
        dietaryType: "VEG",
        displayOrder: 0,
      },
    }),
    prisma.item.create({
      data: {
        shopId: rajShop.id,
        categoryId: rajBeverages.id,
        name: "Mango Lassi",
        itemType: "PRODUCT",
        price: 80,
        description: "Creamy yogurt smoothie with fresh mango",
        isAvailable: true,
        isFeatured: true,
        dietaryType: "VEG",
        displayOrder: 1,
      },
    }),
    prisma.item.create({
      data: {
        shopId: rajShop.id,
        categoryId: rajBeverages.id,
        name: "Sweet Lime Soda",
        itemType: "PRODUCT",
        price: 50,
        description: "Fresh lime with soda and a hint of sugar",
        isAvailable: true,
        dietaryType: "VEG",
        displayOrder: 2,
      },
    }),
  ]);

  // Collection for Raj Ka Dhaba
  const rajFeatured = await prisma.collection.upsert({
    where: { shopId_slug: { shopId: rajShop.id, slug: "bestsellers" } },
    update: {},
    create: {
      shopId: rajShop.id,
      name: "Bestsellers",
      slug: "bestsellers",
      description: "Our most loved dishes",
      type: "FEATURED",
      displayOrder: 0,
    },
  });

  // Link bestseller items to collection
  const bestsellerItems = rajItems.filter((_, i) => [0, 3, 4, 8].includes(i));
  await Promise.all(
    bestsellerItems.map((item) =>
      prisma.itemCollection.create({
        data: { itemId: item.id, collectionId: rajFeatured.id },
      })
    )
  );

  console.log("✅ Raj Ka Dhaba seeded:", rajItems.length, "items");

  // ─── Demo Owner 2: Priya (Paid Plan — Boutique) ────────────────────────────

  const priya = await prisma.user.upsert({
    where: { email: "priya@demo.com" },
    update: { passwordHash: demoPassword },
    create: {
      email: "priya@demo.com",
      name: "Priya Mehta",
      passwordHash: demoPassword,
      role: "OWNER",
      ownerProfile: {
        create: { onboardingStep: 3, onboardingDone: true },
      },
    },
  });

  const priyaShop = await prisma.shop.upsert({
    where: { slug: "priya-couture" },
    update: {},
    create: {
      ownerId: priya.id,
      name: "Priya Couture",
      slug: "priya-couture",
      businessType: "RETAIL",
      phone: "+919988776655",
      whatsappNumber: "+919988776655",
      description: "Handcrafted ethnic wear and fusion fashion for women.",
      address: "2nd Floor, Linking Road",
      city: "Mumbai",
      state: "Maharashtra",
      postalCode: "400050",
      status: "PUBLISHED",
      isOpen: true,
      lastPublishedAt: new Date(),
      branding: {
        create: { primaryColor: "#9F7AEA" },
      },
      subscription: {
        create: { planId: paidPlan.id, isActive: true },
      },
    },
  });

  const priyaSarees = await prisma.category.upsert({
    where: { shopId_slug: { shopId: priyaShop.id, slug: "sarees" } },
    update: {},
    create: {
      shopId: priyaShop.id,
      name: "Sarees",
      slug: "sarees",
      description: "Traditional and contemporary sarees",
      displayOrder: 0,
    },
  });

  const priyaKurtis = await prisma.category.upsert({
    where: { shopId_slug: { shopId: priyaShop.id, slug: "kurtis" } },
    update: {},
    create: {
      shopId: priyaShop.id,
      name: "Kurtis",
      slug: "kurtis",
      description: "Everyday and party-wear kurtis",
      displayOrder: 1,
    },
  });

  const priyaAccessories = await prisma.category.upsert({
    where: { shopId_slug: { shopId: priyaShop.id, slug: "accessories" } },
    update: {},
    create: {
      shopId: priyaShop.id,
      name: "Accessories",
      slug: "accessories",
      description: "Jewellery, bags, and more",
      displayOrder: 2,
    },
  });

  const priyaItems = await Promise.all([
    prisma.item.create({
      data: {
        shopId: priyaShop.id,
        categoryId: priyaSarees.id,
        name: "Banarasi Silk Saree",
        itemType: "PRODUCT",
        price: 4500,
        oldPrice: 5200,
        description: "Pure silk saree with traditional zari work",
        isAvailable: true,
        isFeatured: true,
        isBestseller: true,
        dietaryType: "NA",
        displayOrder: 0,
      },
    }),
    prisma.item.create({
      data: {
        shopId: priyaShop.id,
        categoryId: priyaSarees.id,
        name: "Chanderi Cotton Saree",
        itemType: "PRODUCT",
        price: 2200,
        description: "Lightweight cotton saree perfect for summer",
        isAvailable: true,
        dietaryType: "NA",
        displayOrder: 1,
      },
    }),
    prisma.item.create({
      data: {
        shopId: priyaShop.id,
        categoryId: priyaSarees.id,
        name: "Georgette Party Saree",
        itemType: "PRODUCT",
        price: 3200,
        description: "Embroidered georgette saree with sequin border",
        isAvailable: true,
        isFeatured: true,
        dietaryType: "NA",
        displayOrder: 2,
      },
    }),
    prisma.item.create({
      data: {
        shopId: priyaShop.id,
        categoryId: priyaKurtis.id,
        name: "Block Print Anarkali",
        itemType: "PRODUCT",
        price: 1800,
        description: "Hand block-printed Anarkali kurti in Jaipur cotton",
        isAvailable: true,
        isBestseller: true,
        dietaryType: "NA",
        displayOrder: 0,
      },
    }),
    prisma.item.create({
      data: {
        shopId: priyaShop.id,
        categoryId: priyaKurtis.id,
        name: "Chikankari Straight Kurti",
        itemType: "PRODUCT",
        price: 1400,
        description: "Lucknowi chikan embroidery on soft muslin",
        isAvailable: true,
        dietaryType: "NA",
        displayOrder: 1,
      },
    }),
    prisma.item.create({
      data: {
        shopId: priyaShop.id,
        categoryId: priyaKurtis.id,
        name: "Denim Fusion Kurti",
        itemType: "PRODUCT",
        price: 1200,
        description: "Indo-western denim kurti with mirror work",
        isAvailable: false,
        dietaryType: "NA",
        displayOrder: 2,
      },
    }),
    prisma.item.create({
      data: {
        shopId: priyaShop.id,
        categoryId: priyaAccessories.id,
        name: "Kundan Earrings",
        itemType: "PRODUCT",
        price: 650,
        oldPrice: 800,
        description: "Traditional kundan drop earrings with pearl accents",
        isAvailable: true,
        isFeatured: true,
        dietaryType: "NA",
        displayOrder: 0,
      },
    }),
    prisma.item.create({
      data: {
        shopId: priyaShop.id,
        categoryId: priyaAccessories.id,
        name: "Embroidered Potli Bag",
        itemType: "PRODUCT",
        price: 550,
        description: "Zardozi embroidered potli bag for festive occasions",
        isAvailable: true,
        dietaryType: "NA",
        displayOrder: 1,
      },
    }),
  ]);

  // Collections for Priya Couture
  const priyaNewArrivals = await prisma.collection.upsert({
    where: { shopId_slug: { shopId: priyaShop.id, slug: "new-arrivals" } },
    update: {},
    create: {
      shopId: priyaShop.id,
      name: "New Arrivals",
      slug: "new-arrivals",
      description: "Just landed! Fresh styles this season",
      type: "CUSTOM",
      displayOrder: 0,
    },
  });

  const priyaWedding = await prisma.collection.upsert({
    where: { shopId_slug: { shopId: priyaShop.id, slug: "wedding-season" } },
    update: {},
    create: {
      shopId: priyaShop.id,
      name: "Wedding Season",
      slug: "wedding-season",
      description: "Curated picks for the shaadi season",
      type: "SEASONAL",
      displayOrder: 1,
    },
  });

  await Promise.all([
    // New Arrivals: Chanderi, Denim Kurti, Potli Bag
    prisma.itemCollection.create({ data: { itemId: priyaItems[1].id, collectionId: priyaNewArrivals.id } }),
    prisma.itemCollection.create({ data: { itemId: priyaItems[5].id, collectionId: priyaNewArrivals.id } }),
    prisma.itemCollection.create({ data: { itemId: priyaItems[7].id, collectionId: priyaNewArrivals.id } }),
    // Wedding Season: Banarasi, Georgette, Kundan Earrings, Potli Bag
    prisma.itemCollection.create({ data: { itemId: priyaItems[0].id, collectionId: priyaWedding.id } }),
    prisma.itemCollection.create({ data: { itemId: priyaItems[2].id, collectionId: priyaWedding.id } }),
    prisma.itemCollection.create({ data: { itemId: priyaItems[6].id, collectionId: priyaWedding.id } }),
    prisma.itemCollection.create({ data: { itemId: priyaItems[7].id, collectionId: priyaWedding.id } }),
  ]);

  console.log("✅ Priya Couture seeded:", priyaItems.length, "items");

  // ─── Demo Owner 3: Vikram (Free Plan — Service Business) ───────────────────

  const vikram = await prisma.user.upsert({
    where: { email: "vikram@demo.com" },
    update: { passwordHash: demoPassword },
    create: {
      email: "vikram@demo.com",
      name: "Vikram Patel",
      passwordHash: demoPassword,
      role: "OWNER",
      ownerProfile: {
        create: { onboardingStep: 3, onboardingDone: true },
      },
    },
  });

  const vikramShop = await prisma.shop.upsert({
    where: { slug: "vikram-salon" },
    update: {},
    create: {
      ownerId: vikram.id,
      name: "Vikram's Style Studio",
      slug: "vikram-salon",
      businessType: "SERVICE",
      phone: "+918877665544",
      whatsappNumber: "+918877665544",
      description: "Premium men's grooming and styling services in Koramangala.",
      address: "80 Feet Road, Koramangala 4th Block",
      city: "Bengaluru",
      state: "Karnataka",
      postalCode: "560034",
      status: "PUBLISHED",
      isOpen: true,
      businessHoursEnabled: true,
      lastPublishedAt: new Date(),
      branding: {
        create: { primaryColor: "#2D3748" },
      },
      subscription: {
        create: { planId: freePlan.id, isActive: true },
      },
      hours: {
        createMany: {
          data: [
            { dayOfWeek: 0, openTime: "09:00", closeTime: "21:00", isClosed: false },
            { dayOfWeek: 1, openTime: "09:00", closeTime: "21:00", isClosed: true },
            { dayOfWeek: 2, openTime: "09:00", closeTime: "21:00", isClosed: false },
            { dayOfWeek: 3, openTime: "09:00", closeTime: "21:00", isClosed: false },
            { dayOfWeek: 4, openTime: "09:00", closeTime: "21:00", isClosed: false },
            { dayOfWeek: 5, openTime: "09:00", closeTime: "21:00", isClosed: false },
            { dayOfWeek: 6, openTime: "10:00", closeTime: "22:00", isClosed: false },
          ],
        },
      },
    },
  });

  const vikramHaircuts = await prisma.category.upsert({
    where: { shopId_slug: { shopId: vikramShop.id, slug: "haircuts" } },
    update: {},
    create: {
      shopId: vikramShop.id,
      name: "Haircuts",
      slug: "haircuts",
      description: "Cuts and styling for all hair types",
      displayOrder: 0,
    },
  });

  const vikramGrooming = await prisma.category.upsert({
    where: { shopId_slug: { shopId: vikramShop.id, slug: "grooming" } },
    update: {},
    create: {
      shopId: vikramShop.id,
      name: "Grooming",
      slug: "grooming",
      description: "Beard, facial, and skin care",
      displayOrder: 1,
    },
  });

  const vikramItems = await Promise.all([
    prisma.item.create({
      data: {
        shopId: vikramShop.id,
        categoryId: vikramHaircuts.id,
        name: "Classic Haircut",
        itemType: "SERVICE",
        price: 300,
        description: "Precision cut with wash and style",
        isAvailable: true,
        isBestseller: true,
        dietaryType: "NA",
        displayOrder: 0,
      },
    }),
    prisma.item.create({
      data: {
        shopId: vikramShop.id,
        categoryId: vikramHaircuts.id,
        name: "Fade Haircut",
        itemType: "SERVICE",
        price: 400,
        description: "Skin fade, mid fade, or taper — your choice",
        isAvailable: true,
        isFeatured: true,
        dietaryType: "NA",
        displayOrder: 1,
      },
    }),
    prisma.item.create({
      data: {
        shopId: vikramShop.id,
        categoryId: vikramHaircuts.id,
        name: "Hair Color",
        itemType: "SERVICE",
        price: 800,
        oldPrice: 1000,
        description: "Full head colour with premium ammonia-free product",
        isAvailable: true,
        dietaryType: "NA",
        displayOrder: 2,
      },
    }),
    prisma.item.create({
      data: {
        shopId: vikramShop.id,
        categoryId: vikramGrooming.id,
        name: "Beard Trim & Shape",
        itemType: "SERVICE",
        price: 200,
        description: "Precise beard shaping with hot towel finish",
        isAvailable: true,
        isBestseller: true,
        dietaryType: "NA",
        displayOrder: 0,
      },
    }),
    prisma.item.create({
      data: {
        shopId: vikramShop.id,
        categoryId: vikramGrooming.id,
        name: "Royal Facial",
        itemType: "SERVICE",
        price: 600,
        description: "Deep cleanse facial with charcoal mask and massage",
        isAvailable: true,
        isFeatured: true,
        dietaryType: "NA",
        displayOrder: 1,
      },
    }),
    prisma.item.create({
      data: {
        shopId: vikramShop.id,
        categoryId: vikramGrooming.id,
        name: "Head Massage",
        itemType: "SERVICE",
        price: 250,
        description: "Relaxing 20-minute champi with coconut oil",
        isAvailable: true,
        dietaryType: "NA",
        displayOrder: 2,
      },
    }),
  ]);

  const vikramFeatured = await prisma.collection.upsert({
    where: { shopId_slug: { shopId: vikramShop.id, slug: "popular-services" } },
    update: {},
    create: {
      shopId: vikramShop.id,
      name: "Popular Services",
      slug: "popular-services",
      description: "Our most booked services",
      type: "FEATURED",
      displayOrder: 0,
    },
  });

  await Promise.all(
    [vikramItems[0], vikramItems[1], vikramItems[3], vikramItems[4]].map((item) =>
      prisma.itemCollection.create({
        data: { itemId: item.id, collectionId: vikramFeatured.id },
      })
    )
  );

  console.log("✅ Vikram's Style Studio seeded:", vikramItems.length, "items");

  console.log("\n✅ Seeding complete!");
  console.log("──────────────────────────────────────");
  console.log("Demo accounts (password: Demo@1234):");
  console.log("  raj@demo.com    → Raj Ka Dhaba (restaurant, Free plan)");
  console.log("  priya@demo.com  → Priya Couture (boutique, Paid plan)");
  console.log("  vikram@demo.com → Vikram's Style Studio (salon, Free plan)");
  console.log("Admin: admin@digidukan.com / Admin@1234");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
