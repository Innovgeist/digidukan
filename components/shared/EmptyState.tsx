import Link from "next/link";
import { Inbox, Plus } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    href: string;
  };
}

export default function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
      <div className="mx-auto w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
        <Inbox className="w-7 h-7 text-blue-600" strokeWidth={1.8} />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">{description}</p>
      )}
      {action && (
        <Link
          href={action.href}
          className="inline-flex items-center gap-1.5 bg-blue-600 text-white text-sm font-medium px-5 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" strokeWidth={2.4} />
          {action.label}
        </Link>
      )}
    </div>
  );
}
