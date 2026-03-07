import { motion } from "framer-motion";
import { useSEO } from "@/hooks/use-seo";
import { Tag, Rocket, Shield, Globe, Cpu, Wallet, CreditCard, Network, Bot, BookOpen, BarChart3, FileText } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const releases = [
  {
    version: "v0.5.0",
    date: "2025-06-01",
    tag: "Latest",
    title: "Education Hub, Tracker & Marketplace Enhancements",
    icon: BookOpen,
    changes: [
      { type: "added", text: "Education hub with structured learning paths and protocol courses" },
      { type: "added", text: "Real-time protocol activity tracker with live transaction feed" },
      { type: "added", text: "Marketplace agent hiring flow with capability filtering" },
      { type: "added", text: "System status page for monitoring protocol components" },
      { type: "added", text: "Changelog and FAQ documentation pages" },
      { type: "improved", text: "Marketplace search and discovery with advanced filters" },
      { type: "improved", text: "Agent detail views with trust score visualization" },
      { type: "fixed", text: "Navigation dropdown positioning on mobile viewports" },
    ],
  },
  {
    version: "v0.4.0",
    date: "2025-04-15",
    tag: "Stable",
    title: "Waitlist, Merch Store & Community Tools",
    icon: Rocket,
    changes: [
      { type: "added", text: "Waitlist registration system for $ORB fair launch on Base" },
      { type: "added", text: "Official ORBIT merch store with full product catalog" },
      { type: "added", text: "Team page showcasing core contributors" },
      { type: "added", text: "News and announcements feed" },
      { type: "improved", text: "Landing page hero section with animated astronaut visual" },
      { type: "improved", text: "Footer with comprehensive site navigation" },
      { type: "fixed", text: "Dark mode contrast ratios across all page components" },
    ],
  },
  {
    version: "v0.3.0",
    date: "2025-02-28",
    tag: "Stable",
    title: "X402 Protocol & Settlement Engine",
    icon: CreditCard,
    changes: [
      { type: "added", text: "X402 payment protocol page with HTTP 402 flow documentation" },
      { type: "added", text: "Cross-network settlement engine supporting 8 chains" },
      { type: "added", text: "Programmable invoicing and micropayment settlement" },
      { type: "added", text: "Settlement status tracking and fee quoting engine" },
      { type: "improved", text: "Wallet engine with multi-network transaction support" },
      { type: "improved", text: "API route validation using Zod schemas" },
      { type: "fixed", text: "Settlement initiation error handling for edge cases" },
    ],
  },
  {
    version: "v0.2.0",
    date: "2024-12-10",
    tag: "Stable",
    title: "Registry, Identity & On-Chain Verification",
    icon: Shield,
    changes: [
      { type: "added", text: "ERC-8004 on-chain identity registry for agents and robots" },
      { type: "added", text: "Registry showcase page with identity verification demos" },
      { type: "added", text: "Cryptographic identity verification system" },
      { type: "added", text: "Trust scoring and reputation engine" },
      { type: "added", text: "Platform overview with integration ecosystem" },
      { type: "improved", text: "Agent capability attestation and permission hierarchies" },
      { type: "fixed", text: "Identity resolution across cross-wallet lookups" },
    ],
  },
  {
    version: "v0.1.0",
    date: "2024-09-20",
    tag: "Genesis",
    title: "Core Wallet System & Protocol Foundation",
    icon: Wallet,
    changes: [
      { type: "added", text: "Universal digital wallet supporting human, AI agent, and robot participants" },
      { type: "added", text: "Enterprise multi-sig and military hardened wallet types" },
      { type: "added", text: "Government sovereign wallet with air-gapped deployment support" },
      { type: "added", text: "$ORB token economics design and fee structure" },
      { type: "added", text: "Whitepaper and roadmap documentation" },
      { type: "added", text: "Developer resources and protocol architecture docs" },
      { type: "added", text: "AES-256 symmetric encryption for agent communications" },
    ],
  },
];

const typeColors: Record<string, string> = {
  added: "text-orange-500",
  improved: "text-blue-400",
  fixed: "text-emerald-400",
};

const typeLabels: Record<string, string> = {
  added: "Added",
  improved: "Improved",
  fixed: "Fixed",
};

export default function Changelog() {
  useSEO({
    title: "Changelog",
    description: "ORBIT protocol release notes. Track every feature shipped across wallets, X402, registry, marketplace, and more.",
  });

  return (
    <div className="min-h-screen pt-20 lg:pt-32 pb-16 lg:pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeUp} className="mb-12 lg:mb-20">
          <span
            className="font-mono text-xs tracking-widest text-muted-foreground uppercase mb-3 block"
            data-testid="text-changelog-label"
          >
            Changelog
          </span>
          <h1
            className="font-display font-bold text-3xl lg:text-6xl tracking-tight mb-6"
            data-testid="text-changelog-title"
          >
            What we{" "}
            <span className="dark:text-gradient text-gradient-light">shipped.</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
            A versioned record of every feature, improvement, and fix across the
            ORBIT protocol. Built in the open, shipped when ready.
          </p>
        </motion.div>

        <div className="relative">
          <div className="absolute left-[19px] top-0 bottom-0 w-px bg-border/40 hidden sm:block" />

          <div className="space-y-12">
            {releases.map((release, ri) => (
              <motion.div
                key={release.version}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: ri * 0.05 }}
                className="relative"
                data-testid={`card-changelog-${release.version}`}
              >
                <div className="flex items-start gap-4 sm:gap-6">
                  <div className="relative z-10 w-10 h-10 rounded-md bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                    <release.icon className="w-5 h-5 text-orange-500" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <span
                        className="font-mono text-sm font-semibold text-orange-500"
                        data-testid={`text-version-${release.version}`}
                      >
                        {release.version}
                      </span>
                      {release.tag === "Latest" && (
                        <span className="font-mono text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-md bg-orange-500/10 text-orange-500 border border-orange-500/20">
                          {release.tag}
                        </span>
                      )}
                      {release.tag === "Genesis" && (
                        <span className="font-mono text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-md bg-white/5 text-muted-foreground border border-border/30">
                          {release.tag}
                        </span>
                      )}
                    </div>

                    <h2
                      className="font-display font-semibold text-lg tracking-tight mb-1"
                      data-testid={`text-release-title-${release.version}`}
                    >
                      {release.title}
                    </h2>
                    <span className="font-mono text-xs text-muted-foreground/60 block mb-4">
                      {release.date}
                    </span>

                    <div className="rounded-md border border-border/30 bg-card/50 dark:bg-white/[0.02] overflow-hidden">
                      <div className="divide-y divide-border/20">
                        {release.changes.map((change, ci) => (
                          <div
                            key={ci}
                            className="flex items-start gap-3 px-4 py-3"
                            data-testid={`changelog-item-${release.version}-${ci}`}
                          >
                            <span
                              className={`font-mono text-[10px] tracking-wider uppercase w-16 flex-shrink-0 pt-0.5 ${typeColors[change.type]}`}
                            >
                              {typeLabels[change.type]}
                            </span>
                            <span className="text-sm text-foreground/80 leading-relaxed">
                              {change.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
