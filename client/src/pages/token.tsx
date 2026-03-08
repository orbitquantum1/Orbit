import { motion } from "framer-motion";
import { Coins, ArrowRight, Shield, Cpu, DollarSign, Vote, Server, Clock, ExternalLink, Copy, Link2, Network, TrendingUp, Layers, Building2, Landmark, Wallet, Rocket, Zap, RefreshCw, UserCheck, Store, Receipt, BarChart3, Lock, CircleDollarSign, Bot, Download } from "lucide-react";
import { useSEO } from "@/hooks/use-seo";
import { ShareButton } from "@/components/share-button";

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

const fairLaunchFeatures = [
  { label: "100% Fair Launch", desc: "All tokens enter the open market via Bankrbot. No presale, no VC, no insider rounds, no team allocation." },
  { label: "1% Buy/Sell Tax", desc: "Every $ORB trade generates revenue for the ORBIT Treasury. The AI Treasury Manager deploys this into buy and burn, vault positions, and yield strategies." },
  { label: "No Hidden Wallets", desc: "No dev wallet, no marketing wallet, no team vesting. Every token is available on the open market from day one." },
  { label: "Treasury-Backed Value", desc: "Protocol revenue from 11 fee streams flows directly to the treasury. The majority is targeted for $ORB buy and burn, reducing supply and increasing holder value." },
];

const revenueStreamsDetailed = [
  {
    icon: Wallet,
    title: "Wallet Generation Fees",
    desc: "Protocol fee on every wallet created. Every autonomous agent needs a wallet to operate on Base.",
    fee: "$1 per wallet",
  },
  {
    icon: Receipt,
    title: "Transaction Fees",
    desc: "Small percentage on every agent-to-agent payment routed through the x402 protocol payment rails.",
    fee: "0.1% per tx",
  },
  {
    icon: UserCheck,
    title: "Identity Minting Fees",
    desc: "ERC-8004 identity verification and credential issuance for agents, robots, and machines entering the network.",
    fee: "$2 per mint",
  },
  {
    icon: Store,
    title: "Marketplace Commissions",
    desc: "Percentage on all robot and agent API marketplace transactions, connecting service providers with consumers.",
    fee: "2.5% commission",
  },
  {
    icon: BarChart3,
    title: "Token Trading Fees",
    desc: "Buy/sell fee on $ORB transactions. All trading fee revenue flows directly to the protocol treasury.",
    fee: "1% buy/sell",
  },
  {
    icon: CircleDollarSign,
    title: "Registry Fees",
    desc: "Verified agent and robot identity registration in the decentralized registry, enabling trust and discoverability.",
    fee: "$5 per registration",
  },
  {
    icon: Lock,
    title: "Staking Yields",
    desc: "Security staking rewards distributed from protocol revenue to participants who secure the network.",
    fee: "Variable APY",
  },
];

const flywheelSteps = [
  { label: "Agents Need Wallets", icon: Bot },
  { label: "Wallets Need Identity", icon: UserCheck },
  { label: "Identity Enables Marketplace", icon: Store },
  { label: "Marketplace Generates Fees", icon: Receipt },
  { label: "Fees Buy Back $ORB", icon: TrendingUp },
];

export default function Token() {
  useSEO({ title: "$ORB Token", description: "Fair launch on Base via Bankrbot. No presale, no VC, no insider rounds. The native token powering the machine economy." });
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
          <div className="mt-6 flex justify-center gap-3 flex-wrap">
            <ShareButton
              text="$ORB: Fair launch on Base via Bankrbot. No presale, no VC, no insider rounds. The native token powering the machine economy."
              label="Share $ORB"
            />
            <a
              href="/api/downloads/tokenomics"
              download
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-orange-500 text-black text-sm font-semibold hover:bg-orange-400 transition-colors"
              data-testid="button-download-tokenomics"
            >
              <Download className="w-4 h-4" /> Download Tokenomics PDF
            </a>
          </div>
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

        <section id="supply" className="mb-16 lg:mb-24 overflow-hidden" data-testid="section-token-supply">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display font-bold text-2xl lg:text-3xl tracking-tight mb-3">
                Total Supply
              </h2>
              <div className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl dark:text-gradient text-gradient-light mb-6 break-words" data-testid="text-total-supply">
                100,000,000,000
              </div>
              <p className="text-muted-foreground leading-relaxed mb-6">
                100% fair launch via Bankrbot on Base. No presale, no VC rounds, no team allocation, no insider tokens. Every $ORB enters the open market equally. The protocol generates revenue through an autonomous 1% buy/sell tax that flows directly to the ORBIT Treasury.
              </p>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="px-4 py-2 rounded-md bg-card border border-border/50 text-sm font-mono" data-testid="text-ticker">
                  Ticker: <span className="text-primary font-semibold">$ORB</span>
                </div>
                <div className="px-4 py-2 rounded-md bg-card border border-border/50 text-sm font-mono" data-testid="text-chain">
                  Chain: <span className="text-orange-500 font-semibold">Base</span>
                </div>
                <div className="px-4 py-2 rounded-md bg-card border border-border/50 text-sm font-mono" data-testid="text-launch">
                  Launch: <span className="text-orange-500 font-semibold">Bankrbot Fair Launch</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              {fairLaunchFeatures.map((f, i) => (
                <div key={f.label} className="p-4 rounded-md border border-border/50 bg-card/50 dark:bg-white/[0.02]" data-testid={`fair-launch-${i}`}>
                  <h4 className="text-sm font-semibold text-orange-500 mb-1">{f.label}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        <section id="utility" className="mb-16 lg:mb-24" data-testid="section-token-utility">
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
              className="p-6 rounded-md border border-orange-500/20 bg-orange-500/5 dark:bg-orange-500/[0.03] hover-elevate"
              data-testid="card-revenue-summary"
            >
              <div className="w-10 h-10 rounded-md bg-orange-500/10 flex items-center justify-center mb-4">
                <Coins className="w-5 h-5 text-orange-500" />
              </div>
              <h3 className="font-display font-semibold text-base mb-3">7 Revenue Streams</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                Protocol-level fees across wallets, transactions, identity, marketplace, trading, registry, and staking.
              </p>
              <a href="#revenue" className="inline-flex items-center gap-1.5 text-sm text-orange-500 font-medium">
                View Details <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </motion.div>
          </div>
        </section>

        <section id="revenue" className="mb-16 lg:mb-24" data-testid="section-revenue-model">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="font-mono text-xs tracking-widest text-orange-500 uppercase mb-3 block">
              Protocol Economics
            </span>
            <h2 className="font-display font-bold text-xl lg:text-3xl tracking-tight mb-3" data-testid="text-revenue-heading">
              Protocol Revenue Model
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Seven distinct revenue streams create sustainable protocol economics. Every agent interaction generates value that flows back to $ORB holders.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {revenueStreamsDetailed.map((stream, i) => (
              <motion.div
                key={stream.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="p-6 rounded-md border border-border/50 bg-card/50 dark:bg-white/[0.02] hover-elevate"
                data-testid={`card-revenue-stream-${i}`}
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="w-10 h-10 rounded-md bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                    <stream.icon className="w-5 h-5 text-orange-500" />
                  </div>
                  <span className="font-mono text-xs text-orange-500 bg-orange-500/10 px-2 py-1 rounded-md whitespace-nowrap" data-testid={`text-fee-${i}`}>
                    {stream.fee}
                  </span>
                </div>
                <h3 className="font-display font-semibold text-base mb-2" data-testid={`text-revenue-title-${i}`}>{stream.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{stream.desc}</p>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.42 }}
              className="p-6 rounded-md border border-orange-500/30 bg-orange-500/5 dark:bg-orange-500/[0.04] flex flex-col justify-center"
              data-testid="card-revenue-total"
            >
              <div className="w-10 h-10 rounded-md bg-orange-500/10 flex items-center justify-center mb-4">
                <TrendingUp className="w-5 h-5 text-orange-500" />
              </div>
              <h3 className="font-display font-semibold text-base mb-2">Compounding Revenue</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                As agent adoption grows, every revenue stream compounds. More agents means more wallets, more identities, more transactions, and more marketplace activity -- all feeding back into $ORB value.
              </p>
            </motion.div>
          </div>
        </section>

        <section id="flywheel" className="mb-16 lg:mb-24" data-testid="section-flywheel">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-md border border-orange-500/30 bg-orange-500/5 dark:bg-orange-500/[0.04] p-6 lg:p-10"
          >
            <div className="text-center mb-10">
              <span className="font-mono text-xs tracking-widest text-orange-500 uppercase mb-3 block">
                Sustainable Economics
              </span>
              <h2 className="font-display font-bold text-xl lg:text-3xl tracking-tight mb-3" data-testid="text-flywheel-heading">
                Protocol Revenue Flywheel
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto text-sm">
                A self-reinforcing cycle where agent adoption drives protocol revenue, which drives $ORB value, which attracts more agents.
              </p>
            </div>

            <div className="flex flex-col lg:flex-row items-center justify-center gap-3 lg:gap-0">
              {flywheelSteps.map((step, i) => (
                <div key={step.label} className="flex items-center gap-3 lg:gap-0" data-testid={`flywheel-step-${i}`}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.12 }}
                    className="flex flex-col items-center gap-2"
                  >
                    <div className="w-14 h-14 rounded-md bg-card dark:bg-white/[0.04] border border-border/50 flex items-center justify-center">
                      <step.icon className="w-6 h-6 text-orange-500" />
                    </div>
                    <span className="font-mono text-xs text-center text-muted-foreground max-w-[120px] leading-tight">
                      {step.label}
                    </span>
                  </motion.div>
                  {i < flywheelSteps.length - 1 && (
                    <div className="hidden lg:flex items-center px-3">
                      <ArrowRight className="w-5 h-5 text-orange-500/60" />
                    </div>
                  )}
                  {i < flywheelSteps.length - 1 && (
                    <div className="flex lg:hidden items-center">
                      <ArrowRight className="w-4 h-4 text-orange-500/60 rotate-90" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-center">
              <div className="flex items-center gap-2 px-4 py-2 rounded-md bg-card dark:bg-white/[0.04] border border-border/50">
                <RefreshCw className="w-4 h-4 text-orange-500" />
                <span className="font-mono text-xs text-muted-foreground">Cycle repeats with growing adoption</span>
              </div>
            </div>
          </motion.div>
        </section>

        <section id="agent-economy" className="mb-16 lg:mb-24" data-testid="section-agent-economy">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="font-mono text-xs tracking-widest text-orange-500 uppercase mb-3 block">
              Market Validation
            </span>
            <h2 className="font-display font-bold text-xl lg:text-3xl tracking-tight mb-3" data-testid="text-agent-economy-heading">
              The Agent Economy Is Here
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Autonomous AI agents are already generating real revenue, managing treasuries, and trading on Base. They all need wallet infrastructure, identity, and payment rails. ORBIT provides this.
            </p>
          </motion.div>

        </section>

        <section id="protocol-fee-schedule" className="mb-16 lg:mb-24" data-testid="section-protocol-fee-schedule">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="font-mono text-xs tracking-widest text-orange-500 uppercase mb-3 block">
              Protocol Fee Schedule
            </span>
            <h2 className="font-display font-bold text-xl lg:text-3xl tracking-tight mb-3" data-testid="text-fee-schedule-heading">
              How ORBIT Generates Revenue
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Every autonomous agent on Base needs infrastructure. ORBIT charges protocol fees across every interaction, from wallet creation to marketplace transactions.
            </p>
          </motion.div>

          <div className="rounded-md border border-border/50 bg-card/50 dark:bg-white/[0.02] overflow-hidden mb-10">
            <div className="divide-y divide-border/20">
              {[
                { stream: "Wallet Generation", fee: "$1 per wallet", detail: "Every agent needs a Base wallet to hold assets, transact, and manage funds. ORBIT generates and secures wallets on-chain." },
                { stream: "Transaction Fees", fee: "0.1% per transaction", detail: "Every payment, transfer, and settlement routed through ORBIT infrastructure pays a 0.1% protocol fee." },
                { stream: "Identity Minting", fee: "$2 per mint", detail: "Agents mint ERC-8004 identity documents to prove verification status, capabilities, and on-chain reputation." },
                { stream: "Marketplace Commissions", fee: "2.5% per sale", detail: "Agent services, API access, compute, and data listed on the ORBIT marketplace pay 2.5% commission on every transaction." },
                { stream: "Token Trading Fees", fee: "1% buy / 1% sell", detail: "$ORB has a 1% buy and 1% sell tax. All trading fee revenue flows directly to the protocol treasury." },
                { stream: "Registry Fees", fee: "$5 per registration", detail: "Agents and robots register in the ORBIT registry for discoverability, verification, and trust scoring." },
                { stream: "Staking Yields", fee: "Variable APY", detail: "All protocol revenue feeds the staking pool. $ORB holders who stake earn yield from every fee stream above." },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 px-5 lg:px-6 py-4" data-testid={`fee-schedule-${i}`}>
                  <span className="font-mono text-xs text-orange-500 bg-orange-500/10 px-2.5 py-1 rounded-md whitespace-nowrap mt-0.5 min-w-[140px] text-center">
                    {item.fee}
                  </span>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium">{item.stream}</span>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-md border border-orange-500/30 bg-orange-500/5 dark:bg-orange-500/[0.04] p-6 lg:p-8"
            data-testid="card-protocol-revenue-thesis"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-md bg-orange-500/10 flex items-center justify-center flex-shrink-0 mt-1">
                <Layers className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-lg mb-3">The Infrastructure Layer Captures Everything</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  As the agent economy scales from hundreds to millions of autonomous agents on Base, every single one needs wallets, identity, payments, marketplace access, and coordination. ORBIT is the protocol layer underneath all of them. Every agent interaction generates protocol revenue that flows back to $ORB holders through the treasury.
                </p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  {[
                    { icon: Wallet, label: "Wallets", desc: "Base native" },
                    { icon: UserCheck, label: "Identity", desc: "ERC-8004" },
                    { icon: DollarSign, label: "Payments", desc: "x402 protocol" },
                    { icon: Store, label: "Marketplace", desc: "API discovery" },
                    { icon: Network, label: "Coordination", desc: "Task pools" },
                  ].map((need, i) => (
                    <div
                      key={need.label}
                      className="flex items-center gap-3 p-3 rounded-md bg-black/10 dark:bg-white/[0.02] border border-border/30"
                      data-testid={`protocol-need-${i}`}
                    >
                      <need.icon className="w-4 h-4 text-orange-500 flex-shrink-0" />
                      <div>
                        <div className="text-sm font-medium">{need.label}</div>
                        <div className="font-mono text-xs text-muted-foreground">{need.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        <section id="stablecoin" data-testid="section-stablecoin">
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
