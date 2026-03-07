import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export function WaitlistForm({ variant = "default" }: { variant?: "default" | "compact" }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [position, setPosition] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || status === "loading") return;

    setStatus("loading");
    try {
      const res = await apiRequest("POST", "/api/waitlist", { email });
      const data = await res.json();
      if (data.success) {
        setStatus("success");
        setPosition(data.position);
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`flex items-center gap-3 ${variant === "compact" ? "" : "py-3"}`}
        data-testid="waitlist-success"
      >
        <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
          <Check className="w-4 h-4 text-orange-500" />
        </div>
        <div>
          <p className="text-sm font-medium text-white">You're on the list.</p>
          {position && (
            <p className="text-xs text-muted-foreground font-mono">Position #{position}</p>
          )}
        </div>
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
