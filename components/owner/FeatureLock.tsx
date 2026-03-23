import { Lock, Crown } from "lucide-react";

interface Props {
  feature: string;
  planName: string;
  children?: React.ReactNode;
}

export function FeatureLock({ feature, planName, children }: Props) {
  return (
    <div className="relative">
      {children && (
        <div className="opacity-30 pointer-events-none select-none" aria-hidden="true">
          {children}
        </div>
      )}
      <div className={`${children ? "absolute inset-0" : ""} flex items-center justify-center`}>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 text-center max-w-xs mx-auto">
          <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-3">
            <Lock className="w-6 h-6 text-amber-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Upgrade Required</h3>
          <p className="text-sm text-gray-500 mb-4">
            {feature} requires a paid plan. You are currently on the <strong>{planName}</strong> plan.
          </p>
          <a
            href="mailto:sales@innovgeist.com"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Crown className="w-4 h-4" />
            Contact Sales
          </a>
          <p className="text-xs text-gray-400 mt-3">
            <a href="mailto:sales@innovgeist.com" className="text-blue-600 hover:underline">sales@innovgeist.com</a>
            {" · "}
            <a href="tel:+919305602733" className="text-blue-600 hover:underline">+91-9305602733</a>
          </p>
        </div>
      </div>
    </div>
  );
}
