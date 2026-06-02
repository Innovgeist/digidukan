import type { Metadata } from "next";
import { HomeLanding } from "@/components/home/HomeLanding";

export const metadata: Metadata = {
  title: "DigiDukan — QR aur WhatsApp wali digital dukaan",
  description:
    "DigiDukan helps local shops create a digital catalog, share it by QR code, and receive orders on WhatsApp.",
};

export default function HomePage() {
  return <HomeLanding />;
}
