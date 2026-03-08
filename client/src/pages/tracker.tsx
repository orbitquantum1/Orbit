import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { GitCommit, GitBranch, GitMerge, Shield, Cpu, Database, Server, Package, CheckCircle2, ArrowUpRight, Tag } from "lucide-react";
import { SiGithub } from "react-icons/si";
import { useSEO } from "@/hooks/use-seo";

type ActivityType = "commit" | "merge" | "deploy" | "test" | "security" | "infra" | "protocol" | "release";

interface ActivityEntry {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  author: string;
  timestamp: string;
  branch?: string;
  sha?: string;
  tags?: string[];
  url?: string;
}

const typeConfig: Record<ActivityType, { icon: any; color: string; label: string }> = {
  commit: { icon: GitCommit, color: "text-orange-500", label: "Commit" },
  merge: { icon: GitMerge, color: "text-orange-400", label: "Merge" },
  deploy: { icon: Server, color: "text-orange-600", label: "Deploy" },
  test: { icon: CheckCircle2, color: "text-orange-300", label: "Test" },
  security: { icon: Shield, color: "text-orange-400", label: "Security" },
  infra: { icon: Database, color: "text-gray-400", label: "Infra" },
  protocol: { icon: Cpu, color: "text-orange-500", label: "Protocol" },
  release: { icon: Package, color: "text-orange-400", label: "Release" },
};

function formatRelativeTime(timestamp: string): string {
  const now = new Date();
  const date = new Date(timestamp);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatDate(timestamp: string): string {
  return new Date(timestamp).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}


function ActivityCard({ entry, index }: { entry: ActivityEntry; index: number }) {
  const config = typeConfig[entry.type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.02, 0.5), duration: 0.3 }}
      className="border-b border-white/5 px-4 sm:px-6 py-4 hover:bg-white/[0.02] transition-colors"
      data-testid={`card-activity-${entry.id}`}
    >
      <div className="flex gap-3">
        <div className="flex-shrink-0 mt-1">
          <div className={`w-8 h-8 rounded-md bg-white/5 flex items-center justify-center ${config.color}`}>
            <Icon className="w-4 h-4" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="font-mono text-[10px] tracking-wider text-orange-500/60 uppercase">
              {config.label}
            </span>
            {entry.branch && (
              <span className="font-mono text-[10px] text-white/20 flex items-center gap-1">
                <GitBranch className="w-3 h-3" />
                {entry.branch}
              </span>
            )}
            {entry.sha && (
              <span className="font-mono text-[10px] text-white/20">
                {entry.sha}
              </span>
            )}
          </div>

          <h3 className="text-sm font-medium text-white/90 leading-snug mb-1" data-testid={`text-activity-title-${entry.id}`}>
            {entry.title}
          </h3>

          <p className="text-xs text-white/40 leading-relaxed mb-2">
            {entry.description}
          </p>

          <div className="flex items-center gap-3 flex-wrap">
            {entry.tags && entry.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="font-mono text-[10px] text-white/20 bg-white/5 px-2 py-0.5 rounded-md">
                {tag}
              </span>
            ))}
            <span className="font-mono text-[10px] text-white/20 ml-auto flex-shrink-0">
              {formatRelativeTime(entry.timestamp)}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}


const releases = [
  {
    version: "v0.5.0",
    date: "2025-06-01",
    tag: "Latest",
    title: "Education Hub, Tracker & Marketplace Enhancements",
    changes: [
      { type: "added", text: "Education hub with structured learning paths and protocol courses" },
      { type: "added", text: "Real-time protocol activity tracker with live transaction feed" },
      { type: "added", text: "Marketplace agent hiring flow with capability filtering" },
      { type: "added", text: "System status page for monitoring protocol components" },
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
    changes: [
      { type: "added", text: "Waitlist registration system for $ORB fair launch on Base" },
      { type: "added", text: "Official ORBIT merch store with full product catalog" },
      { type: "added", text: "Team page showcasing core contributors" },
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
    changes: [
      { type: "added", text: "X402 payment protocol page with HTTP 402 flow documentation" },
      { type: "added", text: "Cross-network settlement engine supporting 8 chains" },
      { type: "added", text: "Programmable invoicing and micropayment settlement" },
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
    changes: [
      { type: "added", text: "ERC-8004 on-chain identity registry for agents and robots" },
      { type: "added", text: "Cryptographic identity verification system" },
      { type: "added", text: "Trust scoring and reputation engine" },
      { type: "improved", text: "Agent capability attestation and permission hierarchies" },
      { type: "fixed", text: "Identity resolution across cross-wallet lookups" },
    ],
  },
  {
    version: "v0.1.0",
    date: "2024-09-20",
    tag: "Genesis",
    title: "Core Wallet System & Protocol Foundation",
    changes: [
      { type: "added", text: "Universal digital wallet supporting human, AI agent, and robot participants" },
      { type: "added", text: "Enterprise multi-sig and military hardened wallet types" },
      { type: "added", text: "$ORB token economics design and fee structure" },
      { type: "added", text: "Whitepaper and roadmap documentation" },
      { type: "added", text: "AES-256 symmetric encryption for agent communications" },
    ],
  },
];

const releaseTypeColors: Record<string, string> = {
  added: "text-orange-500",
  improved: "text-white/50",
  fixed: "text-white/30",
};

const releaseTypeLabels: Record<string, string> = {
  added: "Added",
  improved: "Improved",
  fixed: "Fixed",
};

export default function Tracker() {
  useSEO({ title: "ORBIT Development Tracker", description: "Live development feed from the ORBIT Protocol GitHub. Real commits, real progress." });

  const { data: githubCommits } = useQuery<any[]>({
    queryKey: ["/api/github/commits"],
  });

  const activities = useMemo(() => {
    const all: ActivityEntry[] = [];
    if (githubCommits) {
      for (const gc of githubCommits) {
        all.push({
          id: `gh-${gc.sha?.slice(0, 7)}`,
          type: "commit" as ActivityType,
          title: gc.message?.split("\n")[0] || "",
          description: gc.message?.split("\n").slice(1).join(" ").trim() || "",
          author: gc.author || "ORBIT Protocol",
          timestamp: gc.date,
          branch: "main",
          sha: gc.sha?.slice(0, 7),
          tags: ["github", "verified"],
          url: gc.url,
        });
      }
    }
    all.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return all;
  }, [githubCommits]);

  const [filter, setFilter] = useState<ActivityType | "all">("all");
  const filtered = filter === "all" ? activities : activities.filter((a) => a.type === filter);

  return (
    <div className="min-h-screen pt-20 lg:pt-32 pb-16 lg:pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 lg:mb-12"
        >
          <span className="font-mono text-[10px] tracking-widest text-orange-500/70 uppercase mb-3 block" data-testid="text-tracker-label">
            Development Activity
          </span>
          <h1 className="font-display font-bold text-2xl sm:text-4xl lg:text-5xl text-white tracking-tight mb-4" data-testid="text-tracker-title">
            ORBIT Development Tracker
          </h1>
          <p className="text-sm text-white/40 max-w-xl leading-relaxed">
            Live development feed from the ORBIT Protocol GitHub repository. Real commits, real progress.
          </p>
        </motion.div>


        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex items-center gap-2 mb-6 overflow-x-auto pb-2"
        >
          {(["all", "commit", "merge", "deploy", "test", "security", "infra", "protocol", "release"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`font-mono text-[10px] tracking-wider uppercase px-3 py-1.5 rounded-md whitespace-nowrap transition-colors ${
                filter === type
                  ? "bg-orange-500/20 text-orange-500 border border-orange-500/30"
                  : "bg-white/[0.03] text-white/30 border border-white/5 hover:text-white/50"
              }`}
              data-testid={`button-filter-${type}`}
            >
              {type === "all" ? "All Activity" : type}
            </button>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="border border-white/5 rounded-md bg-white/[0.01] overflow-hidden"
        >
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-white/5 bg-white/[0.02]">
            <div className="flex items-center gap-2">
              <SiGithub className="w-4 h-4 text-white/40" />
              <span className="font-mono text-xs text-white/50">orbitquantum1/Orbit</span>
            </div>
            <a
              href="https://github.com/orbitquantum1/Orbit"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 font-mono text-[10px] text-orange-500/60 hover:text-orange-500 transition-colors"
              data-testid="link-github-repo"
            >
              View Repository
              <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>

          {filtered.map((entry, i) => (
            <ActivityCard key={entry.id} entry={entry} index={i} />
          ))}

          <div className="px-4 sm:px-6 py-4 text-center">
            <span className="font-mono text-[10px] text-white/20 uppercase tracking-wider">
              Showing {filtered.length} of {activities.length} entries
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 lg:mt-24"
        >
          <div className="mb-8">
            <span className="font-mono text-[10px] tracking-widest text-orange-500/70 uppercase mb-3 block">
              Changelog
            </span>
            <h2 className="font-display font-bold text-xl sm:text-2xl lg:text-3xl text-white tracking-tight mb-3">
              What we shipped.
            </h2>
            <p className="text-sm text-white/40 max-w-xl leading-relaxed">
              A versioned record of every feature, improvement, and fix across the ORBIT protocol.
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-[19px] top-0 bottom-0 w-px bg-white/5 hidden sm:block" />

            <div className="space-y-10">
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
                      <Tag className="w-5 h-5 text-orange-500" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1 flex-wrap">
                        <span className="font-mono text-sm font-semibold text-orange-500" data-testid={`text-version-${release.version}`}>
                          {release.version}
                        </span>
                        {release.tag === "Latest" && (
                          <span className="font-mono text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-md bg-orange-500/10 text-orange-500 border border-orange-500/20">
                            {release.tag}
                          </span>
                        )}
                        {release.tag === "Genesis" && (
                          <span className="font-mono text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-md bg-white/5 text-white/40 border border-white/10">
                            {release.tag}
                          </span>
                        )}
                      </div>

                      <h3 className="font-display font-semibold text-lg tracking-tight mb-1">
                        {release.title}
                      </h3>
                      <span className="font-mono text-xs text-white/20 block mb-4">
                        {release.date}
                      </span>

                      <div className="rounded-md border border-white/5 bg-white/[0.02] overflow-hidden">
                        <div className="divide-y divide-white/5">
                          {release.changes.map((change, ci) => (
                            <div key={ci} className="flex items-start gap-3 px-4 py-3" data-testid={`changelog-item-${release.version}-${ci}`}>
                              <span className={`font-mono text-[10px] tracking-wider uppercase w-16 flex-shrink-0 pt-0.5 ${releaseTypeColors[change.type]}`}>
                                {releaseTypeLabels[change.type]}
                              </span>
                              <span className="text-sm text-white/60 leading-relaxed">
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
        </motion.div>
      </div>
    </div>
  );
}
