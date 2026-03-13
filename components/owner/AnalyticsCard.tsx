interface Props {
  icon: string;
  label: string;
  count7d: number;
  count30d: number;
}

export function AnalyticsCard({ icon, label, count7d, count30d }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">{icon}</span>
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
