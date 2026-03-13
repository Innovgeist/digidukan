"use client";

interface ImpersonationBannerProps {
  targetName: string;
  onEnd: () => void;
}

export function ImpersonationBanner({ targetName, onEnd }: ImpersonationBannerProps) {
  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-2 bg-amber-500 text-amber-950 shadow-md"
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-center gap-2 text-sm font-medium">
        <span
          className="inline-block w-2 h-2 rounded-full bg-amber-900 opacity-70 animate-pulse"
          aria-hidden="true"
        />
        You are viewing as{" "}
        <span className="font-bold">{targetName}</span>{" "}
        <span className="text-amber-800">(impersonation mode)</span>
      </div>

      <button
        onClick={onEnd}
        className="ml-4 px-3 py-1 text-xs font-semibold rounded-md bg-amber-900 text-amber-50 hover:bg-amber-800 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-900 focus:ring-offset-1"
      >
        End Session
      </button>
    </div>
  );
}
