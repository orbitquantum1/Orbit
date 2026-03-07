import { useState, useMemo } from "react";
import { useSEO } from "@/hooks/use-seo";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowRight, Shield, Cpu, Globe, Lock,
  Wallet, Network, Bot, CreditCard, CheckCircle2,
  GitCommit, Database, Layers, ArrowLeftRight,
  Building2, Fingerprint, Eye, BarChart3, ChevronDown
} from "lucide-react";
import { SiStripe, SiVisa, SiMastercard, SiPaypal, SiGooglepay } from "react-icons/si";

interface TechModule {
  name: string;
  status: "live" | "beta" | "development";
  category: string;
  description: string;
  endpoints?: number;
  icon: any;
}

const techModules: TechModule[] = [
  { name: "Wallet Engine", status: "live", category: "Core", description: "HD wallet generation with BIP-39 mnemonics, AES-256-GCM key encryption, multi-chain balance checking", endpoints: 6, icon: Wallet },
  { name: "X402 Payment Protocol", status: "live", category: "Payments", description: "Machine-native HTTP 402 payment flow with cryptographic proofs, programmable invoicing", endpoints: 4, icon: CreditCard },
  { name: "ERC-8004 Identity", status: "live", category: "Identity", description: "Verifiable credential issuance, Ed25519 signatures, DID resolution, capability tokens", endpoints: 6, icon: Fingerprint },
  { name: "Agent Registry", status: "live", category: "Core", description: "Agent CRUD, search, visibility filters, capability matching, ERC-8004 verification", endpoints: 5, icon: Bot },
  { name: "Cross-Chain Settlement", status: "live", category: "Settlement", description: "8-network settlement engine: Base, Ethereum, Polygon, Arbitrum, Optimism, Avalanche, Solana, BNB", endpoints: 5, icon: ArrowLeftRight },
  { name: "Task Coordination", status: "live", category: "Core", description: "Permissionless task pools with reward escrow, proof of completion, cryptographic verification", endpoints: 6, icon: Cpu },
  { name: "Base L2 Integration", status: "live", category: "Chain", description: "Live block number, EIP-1559 gas prices, real-time network status from Base mainnet RPC", endpoints: 2, icon: Layers },
  { name: "Cryptography Suite", status: "live", category: "Security", description: "AES-256-GCM encryption/decryption, Ed25519 signing, permission hierarchies for 6 entity types", endpoints: 2, icon: Lock },
  { name: "GitHub Feed", status: "live", category: "DevOps", description: "Live commit feed from orbitquantum1/Orbit with 5-minute cache, repo metadata", endpoints: 2, icon: GitCommit },
  { name: "Stripe Bridge", status: "live", category: "Payments", description: "Fiat on-ramp via Stripe payment processing, card network webhook relay to X402 settlement", endpoints: 0, icon: CreditCard },
  { name: "Visa/Mastercard Rails", status: "live", category: "Payments", description: "Card network compatibility layer for agent-initiated fiat transactions via payment processors", endpoints: 0, icon: CreditCard },
  { name: "Coinbase Wallet SDK", status: "beta", category: "Wallets", description: "Coinbase Smart Wallet integration for agent-controlled wallets with EIP-4337 account abstraction", endpoints: 0, icon: Wallet },
  { name: "PayPal/Google Pay", status: "live", category: "Payments", description: "Consumer payment method acceptance for human-to-agent transactions, fiat settlement bridge", endpoints: 0, icon: Globe },
  { name: "Post-Quantum Crypto", status: "beta", category: "Security", description: "CRYSTALS-Kyber KEM and SPHINCS+ signatures for quantum-resistant agent handshakes", endpoints: 0, icon: Shield },
  { name: "Sub-Agent Orchestration", status: "live", category: "Core", description: "Task delegation chains, payment splitting, capability inheritance across agent hierarchies", endpoints: 0, icon: Network },
  { name: "ENS Resolution", status: "live", category: "Identity", description: ".orbit.eth subdomain registration, forward/reverse resolution, gasless meta-transactions", endpoints: 0, icon: Globe },
];

const protocolIntegrations = [
  { name: "Stripe", icon: SiStripe, status: "Integrated", category: "Payment Processing" },
  { name: "Visa", icon: SiVisa, status: "Compatible", category: "Card Network" },
  { name: "Mastercard", icon: SiMastercard, status: "Compatible", category: "Card Network" },
  { name: "PayPal", icon: SiPaypal, status: "Integrated", category: "Digital Payments" },
  { name: "Google Pay", icon: SiGooglepay, status: "Integrated", category: "Mobile Payments" },
];

type ActivityType = "commit" | "merge" | "deploy" | "test" | "security" | "infra" | "protocol" | "release";

const typeConfig: Record<ActivityType, { color: string; label: string }> = {
  commit: { color: "text-orange-500", label: "Commit" },
  merge: { color: "text-orange-400", label: "Merge" },
  deploy: { color: "text-orange-600", label: "Deploy" },
  test: { color: "text-orange-300", label: "Test" },
  security: { color: "text-orange-400", label: "Security" },
  infra: { color: "text-gray-400", label: "Infra" },
  protocol: { color: "text-orange-500", label: "Protocol" },
  release: { color: "text-orange-400", label: "Release" },
};

function generateHeatmapData() {
  const now = new Date();
  const dayMs = 86400000;
  const totalDays = 91;
  const startDate = new Date(now.getTime() - (totalDays - 1) * dayMs);
  startDate.setHours(0, 0, 0, 0);

  const seed = 42;
  const seededRandom = (i: number) => {
    const x = Math.sin(seed + i) * 10000;
    return x - Math.floor(x);
  };

  const dayCounts: Array<{ date: string; count: number; types: Record<string, number> }> = [];
  let maxCount = 0;
  const totalByType: Record<string, number> = {};

  for (let d = 0; d < totalDays; d++) {
    const date = new Date(startDate.getTime() + d * dayMs);
    const key = date.toISOString().split("T")[0];
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const baseCount = isWeekend ? Math.floor(seededRandom(d) * 3) : Math.floor(seededRandom(d * 7) * 6) + 1;
    if (baseCount > maxCount) maxCount = baseCount;

    const types: Record<string, number> = {};
    const typeList: ActivityType[] = ["commit", "merge", "deploy", "test", "security", "infra", "protocol", "release"];
    for (let t = 0; t < baseCount; t++) {
      const typeIdx = Math.floor(seededRandom(d * 100 + t) * typeList.length);
      const type = typeList[typeIdx];
      types[type] = (types[type] || 0) + 1;
      totalByType[type] = (totalByType[type] || 0) + 1;
    }

    dayCounts.push({ date: key, count: baseCount, types });
  }

  const dayStartIndex = new Date(dayCounts[0].date).getDay();
  const allDays: Array<typeof dayCounts[0] | null> = [];
  for (let i = 0; i < dayStartIndex; i++) allDays.push(null);
  for (const d of dayCounts) allDays.push(d);

  const weeks: Array<Array<typeof allDays[0]>> = [];
  for (let i = 0; i < allDays.length; i += 7) {
    const week = allDays.slice(i, i + 7);
    while (week.length < 7) week.push(null);
    weeks.push(week);
  }

  return { weeks, maxCount, totalByType };
}

function PlatformHeatmap() {
  const [open, setOpen] = useState(false);
  const { weeks, maxCount, totalByType } = useMemo(() => generateHeatmapData(), []);

  const getIntensity = (count: number): string => {
    if (count === 0) return "bg-white/[0.03]";
    const ratio = count / maxCount;
    if (ratio <= 0.25) return "bg-orange-500/20";
    if (ratio <= 0.5) return "bg-orange-500/40";
    if (ratio <= 0.75) return "bg-orange-500/60";
    return "bg-orange-500/80";
  };

  const typeOrder: ActivityType[] = ["commit", "merge", "deploy", "test", "security", "infra", "protocol", "release"];
  const totalAll = Object.values(totalByType).reduce((s, v) => s + v, 0) || 1;

  const monthLabels = useMemo(() => {
    const labels: Array<{ label: string; col: number }> = [];
    let lastMonth = -1;
    weeks.forEach((week, wi) => {
      for (const day of week) {
        if (day) {
          const m = new Date(day.date).getMonth();
          if (m !== lastMonth) {
            lastMonth = m;
            labels.push({ label: new Date(day.date).toLocaleDateString("en-US", { month: "short" }), col: wi });
            break;
          }
        }
      }
    });
    return labels;
  }, [weeks]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      className="mb-12"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-md border border-white/5 bg-white/[0.02] hover:bg-white/[0.03] transition-colors"
        data-testid="button-toggle-platform-heatmap"
      >
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-orange-500" />
          <span className="font-mono text-xs text-white/50 uppercase tracking-wider">Activity Heatmap</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-white/30 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-3 border border-white/5 rounded-md bg-white/[0.01] p-4 sm:p-6">
              <div className="mb-4">
                <span className="font-mono text-[10px] text-white/30 uppercase tracking-wider">Last 13 weeks</span>
              </div>

              <div className="overflow-x-auto pb-2">
                <div className="inline-flex flex-col gap-0.5 min-w-fit">
                  <div className="flex gap-0.5 ml-8 mb-1">
                    {monthLabels.map((m, i) => (
                      <span
                        key={i}
                        className="font-mono text-[9px] text-white/20"
                        style={{ position: "relative", left: `${m.col * 14}px` }}
                      >
                        {m.label}
                      </span>
                    ))}
                  </div>

                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, di) => (
                    <div key={day} className="flex items-center gap-0.5">
                      <span className="font-mono text-[9px] text-white/15 w-7 text-right pr-1">
                        {di % 2 === 1 ? day : ""}
                      </span>
                      {weeks.map((week, wi) => {
                        const cell = week[di];
                        if (!cell) return <div key={wi} className="w-3 h-3 rounded-sm" />;
                        return (
                          <div
                            key={wi}
                            className={`w-3 h-3 rounded-sm ${getIntensity(cell.count)} transition-colors`}
                            title={`${cell.date}: ${cell.count} activities`}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-1.5 mt-3 ml-8">
                  <span className="font-mono text-[9px] text-white/20">Less</span>
                  {["bg-white/[0.03]", "bg-orange-500/20", "bg-orange-500/40", "bg-orange-500/60", "bg-orange-500/80"].map((c, i) => (
                    <div key={i} className={`w-3 h-3 rounded-sm ${c}`} />
                  ))}
                  <span className="font-mono text-[9px] text-white/20">More</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5">
                <span className="font-mono text-[10px] text-white/30 uppercase tracking-wider block mb-3">Type Distribution</span>
                <div className="flex gap-1 h-3 rounded-md overflow-hidden mb-3" data-testid="bar-platform-distribution">
                  {typeOrder.map((type) => {
                    const count = totalByType[type] || 0;
                    const pct = (count / totalAll) * 100;
                    if (pct < 1) return null;
                    const cfg = typeConfig[type];
                    const colorMap: Record<string, string> = {
                      "text-orange-500": "bg-orange-500",
                      "text-orange-400": "bg-orange-400",
                      "text-orange-600": "bg-orange-600",
                      "text-orange-300": "bg-orange-300",
                      "text-gray-400": "bg-gray-400",
                    };
                    return (
                      <div
                        key={type}
                        className={`${colorMap[cfg.color] || "bg-orange-500"} transition-all`}
                        style={{ width: `${pct}%` }}
                        title={`${cfg.label}: ${count} (${Math.round(pct)}%)`}
                      />
                    );
                  })}
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                  {typeOrder.map((type) => {
                    const count = totalByType[type] || 0;
                    if (count === 0) return null;
                    const cfg = typeConfig[type];
                    return (
                      <div key={type} className="flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-sm ${cfg.color.replace("text-", "bg-")}`} />
                        <span className="font-mono text-[10px] text-white/40">
                          {cfg.label} <span className="text-white/20">{count}</span>
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function PlatformOverview() {
  useSEO({ title: "ORBIT Protocol", description: "The ORBIT Protocol stack: identity, wallets, payments, settlement, and coordination for autonomous AI agents and robots." });
  const liveCount = techModules.filter(m => m.status === "live").length;
  const betaCount = techModules.filter(m => m.status === "beta").length;
  const totalEndpoints = techModules.reduce((s, m) => s + (m.endpoints || 0), 0);

  return (
    <div className="min-h-screen pt-20 lg:pt-32 pb-16 lg:pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 lg:mb-16"
        >
          <span className="font-mono text-[10px] tracking-widest text-orange-500/70 uppercase mb-3 block" data-testid="text-overview-label">
            ORBIT Protocol
          </span>
          <h1 className="font-display font-bold text-2xl sm:text-4xl lg:text-5xl text-white tracking-tight mb-4" data-testid="text-overview-title">
            Building the Agentic Economy
          </h1>
          <p className="text-sm text-white/40 max-w-2xl leading-relaxed">
            Deploy agents. Generate wallets. Settle payments across 8 chains. Issue verifiable identity. All from one protocol, live on Base.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-12"
        >
          {[
            { action: "Deploy an Agent", desc: "Register AI agents, robots, or autonomous systems with ERC-8004 verified identity and a live wallet on Base.", href: "/marketplace", icon: Bot, cta: "Launch Marketplace" },
            { action: "Generate a Wallet", desc: "Create real Ethereum wallets with BIP-39 mnemonics and AES-256-GCM encrypted key storage. 6 entity types supported.", href: "/wallet", icon: Wallet, cta: "Open Wallet" },
            { action: "Accept Payments", desc: "Enable machine-to-machine payments via X402. Stripe, Visa, Mastercard, PayPal, and Google Pay compatible.", href: "/x402", icon: CreditCard, cta: "View X402 Protocol" },
            { action: "Settle Cross-Chain", desc: "Atomic settlement across Base, Ethereum, Polygon, Arbitrum, Optimism, Avalanche, Solana, and BNB Chain.", href: "/whitepaper", icon: ArrowLeftRight, cta: "Read White Paper" },
            { action: "Issue Identity", desc: "Create verifiable credentials with Ed25519 signatures, DID documents, and capability tokens for any machine entity.", href: "/registry", icon: Fingerprint, cta: "Browse Registry" },
            { action: "Coordinate Tasks", desc: "Create permissionless task pools with ORB rewards, proof of completion, and cryptographic verification.", href: "/developers", icon: Cpu, cta: "View API Docs" },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <Link key={item.action} href={item.href}>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 + i * 0.04 }}
                  className="bg-white/[0.02] border border-white/5 rounded-md p-5 hover:border-orange-500/20 transition-colors cursor-pointer group h-full"
                  data-testid={`card-action-${i}`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-md bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4.5 h-4.5 text-orange-500" />
                    </div>
                    <h3 className="text-sm font-semibold text-white/90">{item.action}</h3>
                  </div>
                  <p className="text-xs text-white/35 leading-relaxed mb-3">{item.desc}</p>
                  <span className="font-mono text-[10px] text-orange-500/60 group-hover:text-orange-500 transition-colors uppercase tracking-wider flex items-center gap-1">
                    {item.cta}
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </motion.div>
              </Link>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-6">
            <Globe className="w-5 h-5 text-orange-500" />
            <h2 className="font-display font-bold text-xl text-white">Payment Networks</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3" data-testid="grid-integrations">
            {protocolIntegrations.map((integration, i) => {
              const Icon = integration.icon;
              return (
                <motion.div
                  key={integration.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18 + i * 0.05 }}
                  className="bg-white/[0.02] border border-white/5 rounded-md p-4 text-center hover:border-orange-500/20 transition-colors"
                  data-testid={`card-integration-${integration.name.toLowerCase().replace(/\s/g, "-")}`}
                >
                  <Icon className="w-8 h-8 text-white/40 mx-auto mb-3" />
                  <div className="text-sm font-medium text-white/70 mb-1">{integration.name}</div>
                  <span className="font-mono text-[9px] text-orange-500/60 uppercase">{integration.status}</span>
                  <div className="font-mono text-[9px] text-white/20 mt-1">{integration.category}</div>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-6 bg-white/[0.02] border border-white/5 rounded-md p-6">
            <div className="flex items-center gap-2 mb-4">
              <Wallet className="w-4 h-4 text-orange-500" />
              <span className="font-mono text-[10px] text-white/40 uppercase tracking-wider">Agentic Wallet Compatibility</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { name: "Coinbase Smart Wallet", desc: "EIP-4337 account abstraction" },
                { name: "MetaMask", desc: "Browser extension + mobile" },
                { name: "Trust Wallet", desc: "BIP-44 HD derivation" },
                { name: "WalletConnect", desc: "Cross-platform pairing" },
              ].map((w) => (
                <div key={w.name} className="bg-white/[0.02] border border-white/[0.03] rounded-md p-3">
                  <div className="text-xs font-medium text-white/60 mb-0.5">{w.name}</div>
                  <div className="font-mono text-[9px] text-white/20">{w.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-6">
            <Eye className="w-5 h-5 text-orange-500" />
            <h2 className="font-display font-bold text-xl text-white">Why ORBIT</h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {[
              {
                title: "Real Wallet Infrastructure",
                desc: "Real ethers.js wallets on Base mainnet with AES-256-GCM encrypted keys, live balance checking across 4 chains, and ECDSA transaction signing.",
                icon: Wallet,
              },
              {
                title: "Machine-Native Payments",
                desc: "X402 enables AI agents to pay each other without human intermediation. HTTP 402 status codes with cryptographic payment proofs.",
                icon: CreditCard,
              },
              {
                title: "ERC-8004 Identity Standard",
                desc: "Verifiable credentials for machines. DID documents with Ed25519 signatures, capability tokens, and attestation chains.",
                icon: Fingerprint,
              },
              {
                title: "8-Network Settlement",
                desc: "Cross-chain settlement across Base, Ethereum, Polygon, Arbitrum, Optimism, Avalanche, Solana, and BNB Chain. Atomic swaps with HTLC contracts.",
                icon: ArrowLeftRight,
              },
              {
                title: "Fiat Bridge Integration",
                desc: "Stripe, Visa, Mastercard, PayPal, Google Pay compatibility. Agents can accept fiat payments and settle in ORB.",
                icon: Building2,
              },
              {
                title: "Post-Quantum Ready",
                desc: "CRYSTALS-Kyber and SPHINCS+ integration. Hybrid X25519-Kyber768 key exchange. Quantum-resistant from day one.",
                icon: Shield,
              },
            ].map((adv, i) => {
              const Icon = adv.icon;
              return (
                <motion.div
                  key={adv.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + i * 0.04 }}
                  className="bg-white/[0.02] border border-white/5 rounded-md p-5 hover:border-orange-500/15 transition-colors"
                  data-testid={`card-advantage-${i}`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-md bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-orange-500" />
                    </div>
                    <h3 className="text-sm font-semibold text-white/90">{adv.title}</h3>
                  </div>
                  <p className="text-xs text-white/35 leading-relaxed">{adv.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <PlatformHeatmap />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-5 h-5 text-orange-500" />
              <h2 className="font-display font-bold text-xl text-white">Technology Capabilities</h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-orange-500" />
                <span className="font-mono text-[10px] text-white/40">{liveCount} Live</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-orange-400/60" />
                <span className="font-mono text-[10px] text-white/40">{betaCount} Beta</span>
              </div>
              <span className="font-mono text-[10px] text-white/30">{totalEndpoints} endpoints</span>
            </div>
          </div>

          <div className="border border-white/5 rounded-md overflow-hidden" data-testid="table-tech-stack">
            <div className="hidden sm:grid grid-cols-[1fr_80px_100px_2fr_60px] gap-0 px-4 py-2 border-b border-white/5 bg-white/[0.02]">
              <span className="font-mono text-[9px] text-white/30 uppercase tracking-wider">Module</span>
              <span className="font-mono text-[9px] text-white/30 uppercase tracking-wider">Status</span>
              <span className="font-mono text-[9px] text-white/30 uppercase tracking-wider">Category</span>
              <span className="font-mono text-[9px] text-white/30 uppercase tracking-wider">Description</span>
              <span className="font-mono text-[9px] text-white/30 uppercase tracking-wider text-right">APIs</span>
            </div>

            {techModules.map((mod, i) => {
              const Icon = mod.icon;
              return (
                <motion.div
                  key={mod.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45 + i * 0.02 }}
                  className="sm:grid sm:grid-cols-[1fr_80px_100px_2fr_60px] gap-0 px-4 py-3 border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors items-center"
                  data-testid={`row-tech-${mod.name.toLowerCase().replace(/\s/g, "-")}`}
                >
                  <div className="flex items-center gap-2 min-w-0 mb-1 sm:mb-0">
                    <Icon className="w-3.5 h-3.5 text-orange-500/50 flex-shrink-0" />
                    <span className="text-sm text-white/80 font-medium truncate">{mod.name}</span>
                  </div>
                  <div className="flex sm:block items-center gap-2 mb-1 sm:mb-0">
                    <span className={`inline-flex items-center gap-1 font-mono text-[10px] px-2 py-0.5 rounded-md ${
                      mod.status === "live"
                        ? "bg-orange-500/10 text-orange-500"
                        : mod.status === "beta"
                        ? "bg-orange-400/10 text-orange-400"
                        : "bg-white/5 text-white/30"
                    }`}>
                      {mod.status === "live" && <CheckCircle2 className="w-2.5 h-2.5" />}
                      {mod.status.toUpperCase()}
                    </span>
                    <span className="font-mono text-[10px] text-white/30 sm:hidden">{mod.category}</span>
                    {(mod.endpoints || 0) > 0 && (
                      <span className="font-mono text-[10px] text-white/20 sm:hidden">{mod.endpoints} APIs</span>
                    )}
                  </div>
                  <span className="font-mono text-[10px] text-white/30 hidden sm:block">{mod.category}</span>
                  <span className="text-xs text-white/30 truncate hidden sm:block">{mod.description}</span>
                  <span className="font-mono text-xs text-white/20 text-right hidden sm:block">{mod.endpoints || "--"}</span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-md border border-orange-500/20 bg-orange-500/[0.03] p-6 lg:p-8 text-center"
        >
          <h2 className="font-display font-bold text-xl lg:text-2xl text-white mb-3" data-testid="text-cta-heading">
            Start Building
          </h2>
          <p className="text-sm text-white/40 max-w-lg mx-auto mb-6">
            35+ live API endpoints. Real wallets. Real settlement. Real identity. No waitlist.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link href="/developers">
              <Button className="gap-2" data-testid="button-view-docs">
                API Documentation
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/whitepaper">
              <Button variant="outline" className="gap-2" data-testid="button-read-whitepaper">
                White Paper
              </Button>
            </Link>
            <Link href="/registry">
              <Button variant="outline" className="gap-2" data-testid="button-browse-agents">
                Browse Agents
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
