const statusStyles: Record<string, string> = {
  PUBLISHED: "bg-secondary/10 text-secondary border-secondary/20",
  DRAFT: "bg-surface-variant text-on-surface-variant border-outline-variant/40",
  SUSPENDED: "bg-error-container text-on-error-container border-error/20",
  ARCHIVED: "bg-tertiary-container/10 text-tertiary border-tertiary/20",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-full font-[family-name:var(--font-inter)] text-[12px] font-semibold tracking-wide border ${
        statusStyles[status] ?? "bg-surface-variant text-on-surface-variant border-outline-variant/40"
      }`}
    >
      {status}
    </span>
  );
}
