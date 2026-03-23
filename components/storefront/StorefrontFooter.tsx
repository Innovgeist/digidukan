interface Props {
  showWatermark: boolean;
}

export function StorefrontFooter({ showWatermark }: Props) {
  if (!showWatermark) return null;
  return (
    <footer className="mt-8 pb-8 text-center max-w-lg mx-auto space-y-1">
      <p className="text-xs text-gray-400">
        Powered by{" "}
        <a href="/" className="text-blue-500 hover:underline font-medium">
          DigiDukan
        </a>
      </p>
      <p className="text-xs text-gray-300">
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
