import { SiX } from "react-icons/si";

interface ShareButtonProps {
  text: string;
  url?: string;
  label?: string;
}

export function ShareButton({ text, url, label = "Share on X" }: ShareButtonProps) {
  const handleShare = () => {
    const shareUrl = url || window.location.href;
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(tweetUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-white/10 bg-white/[0.03] text-sm text-white/70 hover:text-white hover:border-orange-500/30 hover:bg-orange-500/5 transition-all"
      data-testid="button-share-x"
    >
      <SiX className="w-3.5 h-3.5" />
      {label}
    </button>
  );
}
