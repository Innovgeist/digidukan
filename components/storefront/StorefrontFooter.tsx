interface Props {
  showWatermark: boolean;
}

export function StorefrontFooter({ showWatermark }: Props) {
  if (!showWatermark) return null;
  return (
    <footer className="mt-8 pb-8 text-center max-w-lg mx-auto">
      <p className="text-xs text-gray-400">
        Powered by{" "}
        <a href="/" className="text-blue-500 hover:underline font-medium">
          DigiDukan
        </a>
      </p>
    </footer>
  );
}
