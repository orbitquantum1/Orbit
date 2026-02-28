import { motion } from "framer-motion";
import { Coins, ArrowRight, Shield, Cpu, DollarSign, Vote, Server, Clock, ExternalLink, Copy, Link2, Network, TrendingUp, Layers, Building2, Landmark, Wallet, Rocket, Zap } from "lucide-react";

const tokenUtilities = [
  {
    icon: DollarSign,
    title: "Agent Transactions",
    desc: "Agents use ORBIT tokens to settle services, data access, infrastructure usage, and task execution across the network.",
  },
  {
    icon: Server,
    title: "Network Coordination",
    desc: "Enterprise workflows executed through the protocol require token-based settlement for cross-organizational coordination.",
  },
  {
    icon: Cpu,
    title: "Agent Deployment",
    desc: "Organizations deploying fleets of agents use ORBIT tokens to provision computational capacity and protocol resources.",
  },
  {
    icon: Shield,
    title: "Security Staking",
    desc: "Participants stake ORBIT tokens to secure the network and validate agent interactions across the ecosystem.",
  },
  {
    icon: Vote,
    title: "Protocol Governance",
    desc: "Token holders participate in governance decisions guiding the development and evolution of the protocol.",
  },
];

const allocations = [
  { label: "Ecosystem Development", pct: 30, color: "bg-orange-500" },
  { label: "Protocol Treasury", pct: 20, color: "bg-orange-600" },
  { label: "Team & Contributors", pct: 20, color: "bg-orange-400" },
  { label: "Strategic Partners", pct: 15, color: "bg-gray-400" },
  { label: "Public Distribution", pct: 10, color: "bg-gray-500" },
  { label: "Quantum R&D", pct: 5, color: "bg-gray-600" },
];

const revenueStreams = [
  "Enterprise Workflow Fees",
  "Agent Transaction Fees",
  "Infrastructure Usage Fees",
  "Enterprise Licensing",
  "Stablecoin Infrastructure Revenue",
];

export default function Token() {
  return (
    <div className="min-h-screen pt-20 lg:pt-32 pb-16 lg:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 lg:mb-20"
        >
          <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase mb-3 block" data-testid="text-token-label">
            Token Economics
          </span>
          <h1 className="font-display font-bold text-3xl lg:text-6xl tracking-tight mb-4" data-testid="text-token-title">
            ORBIT Token <span className="font-normal text-orange-500">($ORB)</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            The economic and coordination asset powering the machine economy, enabling humans, AI agents, robots, enterprises, military, and government to transact, stake, and govern at scale.
          </p>
        </motion.div>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-16 lg:mb-24"
          data-testid="section-deployment-status"
        >
          <div className="rounded-md border border-orange-500/30 bg-orange-500/5 dark:bg-orange-500/[0.04] p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-md bg-orange-500/10 flex items-center justify-center">
                <Rocket className="w-5 h-5 text-orange-500 animate-pulse" />
              </div>
              <div>
                <h2 className="font-display font-semibold text-lg" data-testid="text-deployment-heading">Token Launch</h2>
                <span className="font-mono text-xs tracking-wider text-orange-500 uppercase" data-testid="text-deployment-status">Launching on Base via Bankrbot</span>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="p-4 rounded-md bg-card/50 dark:bg-white/[0.02] border border-border/50" data-testid="placeholder-contract-address">
                <div className="flex items-center gap-2 mb-2">
                  <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Contract Address</span>
                </div>
                <div className="font-mono text-sm text-muted-foreground/60">0x0000...0000</div>
                <span className="text-xs text-orange-500/80 font-mono mt-1 block">Pending Deployment</span>
              </div>

              <div className="p-4 rounded-md bg-card/50 dark:bg-white/[0.02] border border-border/50" data-testid="placeholder-chain">
                <div className="flex items-center gap-2 mb-2">
                  <Link2 className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Chain</span>
                </div>
                <div className="font-mono text-sm font-semibold">Base (8453)</div>
                <span className="text-xs text-orange-500/80 font-mono mt-1 block">Coinbase L2</span>
              </div>

              <div className="p-4 rounded-md bg-card/50 dark:bg-white/[0.02] border border-border/50" data-testid="placeholder-launchpad">
                <div className="flex items-center gap-2 mb-2">
                  <Rocket className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Launchpad</span>
                </div>
                <div className="font-mono text-sm font-semibold">Bankrbot</div>
                <span className="text-xs text-orange-500/80 font-mono mt-1 block">Fair Launch</span>
              </div>

              <div className="p-4 rounded-md bg-card/50 dark:bg-white/[0.02] border border-border/50" data-testid="placeholder-explorer">
                <div className="flex items-center gap-2 mb-2">
                  <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Block Explorer</span>
                </div>
                <div className="font-mono text-sm text-muted-foreground/60">BaseScan</div>
                <span className="text-xs text-orange-500/80 font-mono mt-1 block">Available After Launch</span>
              </div>
            </div>

            <div className="p-4 rounded-md bg-black/20 border border-border/30">
              <div className="flex items-start gap-3">
                <Zap className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-semibold mb-1">Fair Launch on Base via Bankrbot</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    $ORB launches on Base (Coinbase L2) through Bankrbot with no presale, no VC allocation, and no insider rounds. The entire protocol infrastructure -- wallets, identity, payments, and coordination -- runs natively on Base. Every agent wallet generated through ORBIT is a real Ethereum wallet on Base (Chain ID 8453).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        <section className="mb-16 lg:mb-24" data-testid="section-token-supply">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display font-bold text-2xl lg:text-3xl tracking-tight mb-3">
                Total Supply
              </h2>
              <div className="font-display font-bold text-3xl sm:text-5xl lg:text-7xl dark:text-gradient text-gradient-light mb-6" data-testid="text-total-supply">
                10,000,000,000
              </div>
              <p className="text-muted-foreground leading-relaxed mb-6">
                The ORBIT token supply is structured to balance ecosystem incentives, long-term treasury management, team alignment, and public participation. Staking incentives support network security and encourage long-term participation.
              </p>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="px-4 py-2 rounded-md bg-card border border-border/50 text-sm font-mono" data-testid="text-ticker">
                  Ticker: <span className="text-primary font-semibold">$ORB</span>
                </div>
                <div className="px-4 py-2 rounded-md bg-card border border-border/50 text-sm font-mono" data-testid="text-stablecoin">
                  Stablecoin: <span className="text-orange-500 font-semibold">ORB-USD (Roadmap)</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              {allocations.map((a, i) => (
                <div key={a.label} className="flex items-center gap-3 sm:gap-4" data-testid={`allocation-${i}`}>
                  <div className="w-16 sm:w-24 text-right text-sm font-mono text-muted-foreground">
                    {a.pct}%
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-sm font-medium">{a.label}</span>
                    </div>
                    <div className="h-3 rounded-full bg-muted/50 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${a.pct * 3.33}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
                        className={`h-full rounded-full ${a.color}`}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        <section className="mb-16 lg:mb-24" data-testid="section-token-utility">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display font-bold text-xl lg:text-3xl tracking-tight mb-3">
              Token Utility
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Five core functions driving value and utility within the ORBIT ecosystem.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tokenUtilities.map((u, i) => (
              <motion.div
                key={u.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="p-6 rounded-md border border-border/50 bg-card/50 dark:bg-white/[0.02] hover-elevate"
                data-testid={`card-utility-${i}`}
              >
                <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center mb-4">
                  <u.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-base mb-2">{u.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{u.desc}</p>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="p-6 rounded-md border border-primary/20 bg-primary/5 dark:bg-primary/[0.05] hover-elevate"
              data-testid="card-revenue"
            >
              <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center mb-4">
                <Coins className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-base mb-3">Revenue Streams</h3>
              <ul className="space-y-2">
                {revenueStreams.map((r, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ArrowRight className="w-3 h-3 text-primary flex-shrink-0" />
                    {r}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </section>

        <section data-testid="section-stablecoin">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-md overflow-hidden"
          >
            <img
              src="/images/quantum-bg.png"
              alt="Quantum background"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/70 to-black/50" />
            <div className="relative p-6 sm:p-8 lg:p-16">
              <div className="max-w-xl">
                <span className="font-mono text-xs tracking-widest text-orange-500 uppercase mb-3 block">
                  Stablecoin (Roadmap)
                </span>
                <h2 className="font-display font-bold text-2xl lg:text-4xl text-white tracking-tight mb-4" data-testid="text-stablecoin-heading">
                  Orbit Stablecoin (ORB-USD)
                </h2>
                <p className="text-white/60 leading-relaxed mb-8">
                  A programmable stablecoin designed for large-scale machine-to-machine financial settlement. Full reserve backing with regulated financial institutions, programmable smart-contract settlement, and compatibility with enterprise accounting systems.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    "Full Reserve Backing",
                    "Smart Contract Settlement",
                    "Enterprise Compatible",
                    "High Throughput",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-white/70">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
