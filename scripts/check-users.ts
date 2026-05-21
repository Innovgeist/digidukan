import { PrismaClient } from "@prisma/client";
import { readFileSync } from "node:fs";
for (const line of readFileSync(".env", "utf8").split(/\r?\n/)) {
  const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
  if (m) process.env[m[1]] = m[2].replace(/^"|"$/g, "");
}
const prisma = new PrismaClient();
async function main() {
  const updated = await prisma.shop.update({
    where: { slug: "priya-couture" },
    data: { isPremium: true },
    select: { name: true, slug: true, isPremium: true },
  });
  console.log("Premium toggled:", updated);
  const all = await prisma.shop.findMany({
    where: { slug: { in: ["raj-ka-dhaba", "priya-couture", "vikram-salon"] } },
    select: { slug: true, isPremium: true },
  });
  console.log("All demo shops:", all);
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
