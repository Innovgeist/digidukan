interface Props {
  showWatermark: boolean;
}

export function StorefrontFooter({ showWatermark }: Props) {
  if (!showWatermark) return null;
  return (
    <footer className="mt-6 pb-32 text-center max-w-lg mx-auto px-5 space-y-2">
      <div className="rule-line opacity-50 mb-3" />
      <p className="text-[12px] text-ink-3">
        Powered by{" "}
        <a href="/" className="font-display font-semibold text-ink-2 hover:text-ink underline-offset-2 hover:underline">
          DigiDukan
        </a>
      </p>
      <p className="text-[11px] text-ink-3/70">
        by{" "}
        <a
          href="https://www.innovgeist.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          innovgeist
        </a>
      </p>
    </footer>
  );
}
