interface Props {
  feature: string;  // "items" | "categories" | "collections" | "shops"
  current: number;
  limit: number;
  planName: string;
}

export function PlanLimitBanner({ feature, current, limit, planName }: Props) {
  const atLimit = current >= limit;
  const nearLimit = !atLimit && limit > 0 && current >= limit - 2;

  if (!atLimit && !nearLimit) return null;

  const label = feature.charAt(0).toUpperCase() + feature.slice(1);

  return (
    <div className={`rounded-xl border px-4 py-3 text-sm mb-4 ${
      atLimit
        ? "bg-red-50 border-red-200 text-red-800"
        : "bg-amber-50 border-amber-200 text-amber-800"
    }`}>
      {atLimit ? (
        <p>
          <strong>{label} limit reached</strong> ({current}/{limit} on {planName} plan).{" "}
          <a href="mailto:sales@innovgeist.com" className="underline font-medium">Contact sales@innovgeist.com to upgrade.</a>
        </p>
      ) : (
        <p>
          {current}/{limit} {feature} used on {planName} plan.{" "}
          <a href="mailto:sales@innovgeist.com" className="underline font-medium">Contact sales@innovgeist.com to upgrade.</a>
        </p>
      )}
    </div>
  );
}
