import QRCode from "qrcode";
import { v2 as cloudinary } from "cloudinary";
import { prisma } from "@/lib/db";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export async function generateAndSaveQR(shopId: string, slug: string): Promise<string> {
  const targetUrl = `${APP_URL}/s/${slug}`;

  // Generate PNG as data URL
  const dataUrl = await QRCode.toDataURL(targetUrl, {
    width: 512,
    margin: 2,
    color: { dark: "#000000", light: "#FFFFFF" },
  });

  let pngUrl = dataUrl; // fallback to data URL if no Cloudinary

  // Upload to Cloudinary if configured
  if (process.env.CLOUDINARY_CLOUD_NAME) {
    try {
      const result = await cloudinary.uploader.upload(dataUrl, {
        folder: `digidukan/qr/${shopId}`,
        public_id: "qr",
        overwrite: true,
      });
      pngUrl = result.secure_url;
    } catch (err) {
      console.error("Cloudinary QR upload failed, using data URL:", err);
    }
  }

  // Upsert QRCodeAsset
  await prisma.qRCodeAsset.upsert({
    where: { shopId },
    update: { pngUrl, targetUrl, generatedAt: new Date() },
    create: { shopId, pngUrl, targetUrl },
  });

  return pngUrl;
}

export async function getOrGenerateQR(shopId: string, slug: string): Promise<string> {
  const existing = await prisma.qRCodeAsset.findUnique({ where: { shopId } });
  if (existing) return existing.pngUrl;
  return generateAndSaveQR(shopId, slug);
}
