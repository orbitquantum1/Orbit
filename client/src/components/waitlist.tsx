import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check, Copy, Share2 } from "lucide-react";
import { SiX } from "react-icons/si";
import { apiRequest } from "@/lib/queryClient";

export function WaitlistForm({ variant = "default" }: { variant?: "default" | "compact" }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [position, setPosition] = useState<number | null>(null);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const ref = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("ref") : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || status === "loading") return;

    setStatus("loading");
    try {
      const body: Record<string, string> = { email };
      if (ref) body.referredBy = ref;
      const res = await apiRequest("POST", "/api/waitlist", body);
      const data = await res.json();
      if (data.success) {
        setStatus("success");
        setPosition(data.position);
        setReferralCode(data.referralCode || null);
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const referralUrl = referralCode && typeof window !== "undefined" ? `${window.location.origin}?ref=${referralCode}` : "";

  const copyReferral = () => {
    if (referralUrl) {
      navigator.clipboard.writeText(referralUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareOnX = () => {
    const text = `I just joined the @orbitquantum waitlist. The transaction layer for AI agents and the robot economy is coming. $ORB on @base via @bankrbot.`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(referralUrl)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`${variant === "compact" ? "max-w-sm" : "max-w-md"}`}
        data-testid="waitlist-success"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
            <Check className="w-4 h-4 text-orange-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-white">You're on the list.</p>
            {position && (
              <p className="text-xs text-muted-foreground font-mono">Position #{position}</p>
            )}
          </div>
        </div>

        {referralCode && (
          <div className="space-y-3">
            <p className="text-xs text-white/50">Share your link to move up the list:</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 px-3 py-2 rounded-md bg-white/[0.05] border border-white/10 font-mono text-xs text-orange-500 truncate">
                {referralUrl}
              </div>
              <button
                onClick={copyReferral}
                className="p-2 rounded-md border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition-colors flex-shrink-0"
                data-testid="button-copy-referral"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-orange-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-white/50" />
                )}
              </button>
            </div>
            <button
              onClick={shareOnX}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-white/10 bg-white/[0.03] text-xs text-white/70 hover:text-white hover:border-orange-500/30 hover:bg-orange-500/5 transition-all"
              data-testid="button-share-referral-x"
            >
              <SiX className="w-3 h-3" />
              Share on X
            </button>
          </div>
        )}
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`flex gap-2 ${variant === "compact" ? "max-w-sm" : "max-w-md"}`} data-testid="form-waitlist">
      <input
        type="email"
        value={email}
        onChange={(e) => { setEmail(e.target.value); setStatus("idle"); }}
        placeholder="Enter your email"
        required
        className="flex-1 px-4 py-2.5 rounded-md bg-white/[0.05] border border-white/10 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 transition-all"
        data-testid="input-waitlist-email"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-orange-500 text-black text-sm font-semibold hover:bg-orange-400 transition-colors disabled:opacity-50 flex-shrink-0"
        data-testid="button-waitlist-submit"
      >
        {status === "loading" ? (
          <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
        ) : (
          <>
            Join
            <ArrowRight className="w-3.5 h-3.5" />
          </>
        )}
      </button>
    </form>
  );
}
