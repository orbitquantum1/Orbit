import { motion } from "framer-motion";
import { useSEO } from "@/hooks/use-seo";
import { Wallet, CreditCard, Network, Bot, Shield, Lock, Cpu, Globe, Landmark, Building2, Swords, CircuitBoard, User, CheckCircle2, Circle } from "lucide-react";

const milestones = [
  {
    title: "Digital Wallet",
    icon: Wallet,
    desc: "A universal wallet supporting every participant in the machine economy.",
    items: [
      { label: "Human wallet", done: true },
      { label: "AI agent wallet", done: true },
      { label: "Robot wallet", done: true },
      { label: "Enterprise multi-sig wallet", done: true },
      { label: "Military hardened wallet", done: true },
      { label: "Government sovereign wallet", done: true },
      { label: "Cross-wallet identity resolution", done: true },
      { label: "Hardware security module integration", done: false },
    ],
  },
  {
    title: "X402 Payment Protocol",
    icon: CreditCard,
    desc: "Machine-native payments built on the HTTP 402 standard.",
    items: [
      { label: "HTTP 402 request/response flow", done: true },
      { label: "Micropayment settlement", done: true },
      { label: "Programmable invoicing", done: true },
      { label: "Agent-to-agent payment channels", done: false },
      { label: "Streaming payment support", done: false },
      { label: "Escrow and dispute resolution", done: false },
    ],
  },
  {
    title: "Cross-Network Settlement",
    icon: Network,
    desc: "Connecting transactions across every chain, payment rail, and stablecoin.",
    items: [
      { label: "Settlement initiation API", done: true },
      { label: "Multi-network support (8 chains)", done: true },
      { label: "Fee schedule and quoting engine", done: true },
      { label: "Settlement status tracking", done: true },
      { label: "Ethereum mainnet settlement", done: false },
      { label: "Base L2 integration (primary chain)", done: true },
      { label: "Solana bridge", done: false },
      { label: "ORB-USD stablecoin launch", done: false },
    ],
  },
  {
    title: "Agent & Robot Collaboration",
    icon: Bot,
    desc: "Multi-agent orchestration and autonomous task execution at scale.",
    items: [
      { label: "ORBIT Marketplace (agent registry)", done: true },
      { label: "Agent discovery and hiring", done: true },
      { label: "ERC-8004 on-chain identity", done: true },
      { label: "Trust scoring and reputation", done: true },
      { label: "Multi-agent task delegation", done: false },
      { label: "Sub-agent orchestration trees", done: false },
      { label: "Cross-fleet coordination protocols", done: false },
      { label: "Autonomous SLA enforcement", done: false },
    ],
  },
  {
    title: "Post-Quantum Cryptography",
    icon: Lock,
    desc: "Military-grade encryption securing every agent interaction against quantum threats.",
    items: [
      { label: "CRYSTALS-Kyber key encapsulation", done: false },
      { label: "SPHINCS+ digital signatures", done: false },
      { label: "Hybrid lattice-based schemes", done: false },
      { label: "NIST PQC standard alignment", done: false },
      { label: "AES-256 symmetric encryption", done: true },
      { label: "Quantum key distribution (QKD)", done: false },
      { label: "Post-quantum TLS for agent comms", done: false },
    ],
  },
  {
    title: "Resilient Cybersecurity",
    icon: Shield,
    desc: "Zero-trust architecture and defense-grade security across the protocol.",
    items: [
      { label: "Zero-trust agent authentication", done: false },
      { label: "Cryptographic identity verification", done: true },
      { label: "Role-based access control", done: true },
      { label: "Continuous threat monitoring", done: false },
      { label: "Automated incident response", done: false },
      { label: "Red team/blue team simulation", done: false },
      { label: "Sovereign air-gapped deployment", done: false },
    ],
  },
  {
    title: "Transaction Layer",
    icon: Cpu,
    desc: "The economic settlement infrastructure for autonomous systems.",
    items: [
      { label: "$ORB token economics design", done: true },
      { label: "Agent transaction fee structure", done: true },
      { label: "$ORB fair launch on Base via Bankrbot", done: false },
      { label: "BaseScan contract verification", done: false },
      { label: "Security staking", done: false },
      { label: "Protocol governance", done: false },
      { label: "DEX liquidity provisioning", done: false },
      { label: "Cross-chain liquidity pools", done: false },
      { label: "Enterprise billing integration", done: false },
    ],
  },
  {
    title: "Coordination Layer",
    icon: Globe,
    desc: "Protocol-level coordination for the machine economy at planetary scale.",
    items: [
      { label: "Agent registry and discovery", done: true },
      { label: "Capability attestation", done: true },
      { label: "Permission hierarchies", done: true },
      { label: "Cross-chain identity portability", done: false },
      { label: "Interplanetary delay-tolerant networking", done: false },
      { label: "Orbital compute coordination", done: false },
      { label: "Satellite mesh networking", done: false },
    ],
  },
];

export default function Roadmap() {
  useSEO({ title: "Roadmap", description: "ORBIT development milestones. Track progress across wallets, X402 protocol, settlement, agent collaboration, and post-quantum cryptography." });
  const totalItems = milestones.reduce((sum, m) => sum + m.items.length, 0);
  const doneItems = milestones.reduce((sum, m) => sum + m.items.filter((i) => i.done).length, 0);
  const pct = Math.round((doneItems / totalItems) * 100);

  return (
    <div className="min-h-screen pt-20 lg:pt-32 pb-16 lg:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 lg:mb-20"
        >
          <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase mb-3 block" data-testid="text-roadmap-label">
            Roadmap
          </span>
          <h1 className="font-display font-bold text-3xl lg:text-6xl tracking-tight mb-6" data-testid="text-roadmap-title">
            Building the{" "}
            <span className="dark:text-gradient text-gradient-light">infrastructure.</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed mb-8">
            ORBIT is being built in the open. No timelines, no hype cycles. Each milestone ships when it is ready. The roadmap below reflects what exists today and what is actively in development.
          </p>

          <div className="flex items-center gap-4 mb-2">
            <div className="flex-1 h-3 rounded-full bg-muted/50 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="h-full rounded-full bg-orange-500"
              />
            </div>
            <span className="font-mono text-sm font-semibold text-orange-500" data-testid="text-roadmap-pct">{pct}%</span>
          </div>
          <div className="flex items-center gap-4 sm:gap-6 text-xs text-muted-foreground font-mono flex-wrap">
            <span data-testid="text-roadmap-done">{doneItems} completed</span>
            <span>{totalItems - doneItems} in progress</span>
            <span>{totalItems} total</span>
          </div>
        </motion.div>

        <div className="space-y-8">
          {milestones.map((milestone, mi) => {
            const done = milestone.items.filter((i) => i.done).length;
            const total = milestone.items.length;
            return (
              <motion.div
                key={milestone.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: mi * 0.04 }}
                className="rounded-md border border-border/50 bg-card/50 dark:bg-white/[0.02] overflow-hidden"
                data-testid={`card-roadmap-${mi}`}
              >
                <div className="p-6 lg:p-8 border-b border-border/30">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-md bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                      <milestone.icon className="w-5 h-5 text-orange-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-4 mb-1">
                        <h2 className="font-display font-semibold text-lg tracking-tight">{milestone.title}</h2>
                        <span className="font-mono text-xs text-muted-foreground flex-shrink-0">{done}/{total}</span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{milestone.desc}</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 lg:p-8">
                  <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3">
                    {milestone.items.map((item, ii) => (
                      <div key={ii} className="flex items-center gap-3" data-testid={`roadmap-item-${mi}-${ii}`}>
                        {item.done ? (
                          <CheckCircle2 className="w-4 h-4 text-orange-500 flex-shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-muted-foreground/40 flex-shrink-0" />
                        )}
                        <span className={`text-sm ${item.done ? "text-foreground" : "text-muted-foreground/60"}`}>
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="px-6 lg:px-8 pb-4">
                  <div className="h-1.5 rounded-full bg-muted/30 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${(done / total) * 100}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="h-full rounded-full bg-orange-500/60"
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
