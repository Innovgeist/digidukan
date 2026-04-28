"use client";
import { useState, useRef } from "react";
import { uploadImageAction } from "@/lib/actions/upload";
import Image from "next/image";
import { ImagePlus, Loader2 } from "lucide-react";

interface Props {
  folder: string;
  value: string;
  onChange: (url: string, publicId: string) => void;
  label?: string;
  aspectHint?: string;
}

export function ImageUpload({ folder, value, onChange, label = "Upload Image", aspectHint }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    const result = await uploadImageAction(formData, folder);

    if (result.error) {
      setError(result.error);
    } else if (result.url && result.publicId) {
      onChange(result.url, result.publicId);
    }

    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div>
      <div
        onClick={() => !uploading && inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${
          value ? "border-gray-300 bg-gray-50" : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
        }`}
      >
        {value ? (
          <div className="flex flex-col items-center gap-2">
            <div className="relative w-20 h-20">
              <Image src={value} alt="Uploaded" fill className="object-cover rounded-lg" />
            </div>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onChange("", ""); }}
              className="text-xs text-red-500 hover:underline"
            >
              Remove
            </button>
          </div>
        ) : uploading ? (
          <div className="py-4">
            <Loader2 className="w-6 h-6 text-blue-600 animate-spin mx-auto mb-2" />
            <p className="text-sm text-gray-500">Uploading...</p>
          </div>
        ) : (
          <div className="py-4 flex flex-col items-center gap-1">
            <ImagePlus className="w-6 h-6 text-gray-500" strokeWidth={1.8} />
            <p className="text-sm font-medium text-gray-700">{label}</p>
            {aspectHint && <p className="text-xs text-gray-400">{aspectHint}</p>}
            <p className="text-xs text-gray-400">JPEG, PNG, WebP · max 5MB</p>
          </div>
        )}
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  );
}
