import type { CartItem } from "@/lib/cart";

export function generateWhatsAppMessage(
  shopName: string,
  items: CartItem[],
  total: number,
  customerNote?: string
): string {
  const itemLines = items
    .map(
      (item, i) =>
        `${i + 1}. ${item.name} x${item.quantity} - ₹${(item.price * item.quantity).toLocaleString("en-IN")}`
    )
    .join("\n");

  let message = `Hello, I want to order from *${shopName}*.\n\nItems:\n${itemLines}\n\nEstimated Total: ₹${total.toLocaleString("en-IN")}`;

  if (customerNote?.trim()) {
    message += `\n\nNote: ${customerNote.trim()}`;
  }

  message += "\n\nPlease confirm availability and delivery details.";

  return message;
}

export function getWhatsAppUrl(whatsappNumber: string, message: string): string {
  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, "");
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}
