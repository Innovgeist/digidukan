import type { LucideIcon } from "lucide-react";

interface Props {
  icon: LucideIcon;
  label: string;
  count7d: number;
  count30d: number;
}

export function AnalyticsCard({ icon: Icon, label, count7d, count30d }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
          <Icon className="w-4 h-4" strokeWidth={2} />
        </span>
        <span className="text-sm font-medium text-gray-700">{label}</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-2xl font-bold text-gray-900">{count7d.toLocaleString()}</p>
          <p className="text-xs text-gray-400 mt-0.5">Last 7 days</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-500">{count30d.toLocaleString()}</p>
          <p className="text-xs text-gray-400 mt-0.5">Last 30 days</p>
        </div>
      </div>
    </div>
  );
}
