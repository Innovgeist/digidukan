const statusStyles: Record<string, string> = {
  PUBLISHED: "bg-green-100 text-green-700",
  DRAFT: "bg-gray-100 text-gray-600",
  SUSPENDED: "bg-red-100 text-red-700",
  ARCHIVED: "bg-yellow-100 text-yellow-700",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
        statusStyles[status] ?? "bg-gray-100 text-gray-600"
      }`}
    >
      {status.toLowerCase()}
    </span>
  );
}
