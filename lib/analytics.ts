/**
 * Client-side analytics tracking — fire-and-forget.
 * Never awaited, never throws.
 */
export function trackEvent(
  shopSlug: string,
  eventType: string,
  extra?: object
): void {
  fetch(`/api/public/shop/${shopSlug}/track`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event: eventType, ...extra }),
  }).catch(() => {});
}
