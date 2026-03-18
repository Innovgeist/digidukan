"use server";

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function uploadImageAction(formData: FormData, folder: string) {
  const file = formData.get("file") as File | null;
  if (!file) return { error: "No file provided" };

  if (!ALLOWED_TYPES.includes(file.type))
    return { error: "Only JPEG, PNG, WebP, and GIF images are allowed" };

  if (file.size > MAX_SIZE_BYTES)
    return { error: "File size must be under 5MB" };

  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    if (process.env.NODE_ENV === "production") {
      return { error: "Image uploads are not configured. Please contact support." };
    }
    // Dev fallback: return a placeholder so the rest of the form still works
    return {
      success: true,
      url: `https://placehold.co/400x400?text=${encodeURIComponent(file.name)}`,
      publicId: `placeholder_${Date.now()}`,
    };
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString("base64");
    const dataUri = `data:${file.type};base64,${base64}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: `digidukan/${folder}`,
      transformation: [{ quality: "auto", fetch_format: "auto" }],
    });

    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    return { error: "Upload failed. Please try again." };
  }
}

export async function deleteImageAction(publicId: string) {
  if (!process.env.CLOUDINARY_CLOUD_NAME || publicId.startsWith("placeholder_")) {
    return { success: true };
  }

  try {
    await cloudinary.uploader.destroy(publicId);
    return { success: true };
  } catch (err) {
    console.error("Cloudinary delete error:", err);
    return { error: "Failed to delete image" };
  }
}
