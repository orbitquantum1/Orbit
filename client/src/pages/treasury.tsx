import { useSEO } from "@/hooks/use-seo";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import {
  Wallet,
  Copy,
  Check,
  Shield,
  Globe,
  TrendingUp,
  Coins,
  Vote,
  Lock,
  BarChart3,
  ArrowUpRight,
  Layers,
  Target,
  Bot,
  Receipt,
  UserCheck,
  Store,
  CircleDollarSign,
  Network,
  ExternalLink,
  Activity,
  Landmark,
  LineChart,
  Dices,
  Brain,
  Scan,
  Zap,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const vaultTokens = [
  {
    symbol: "$ORB",
    name: "ORBIT Protocol",
    category: "Protocol Native",
    network: "Base",
    status: "Pending Funding",
    description: "ORBIT Protocol's native governance and utility token. 100% fair launch on Bankrbot with 1% buy/sell tax flowing directly to the treasury. The core asset underpinning all protocol operations, staking, and economic settlement across the machine economy.",
  },
  {
    symbol: "$ETH",
    name: "Ethereum",
    category: "Core Reserve",
    network: "Multi-chain",
    status: "Pending Funding",
    description: "The foundational settlement layer for all of crypto. ETH serves as the treasury's primary reserve asset for gas, operations, and cross-chain bridging. Long-term hold position as the most battle-tested smart contract platform powering Base, DeFi, and the broader agent economy.",
  },
  {
    symbol: "$BTC",
    name: "Bitcoin",
    category: "Store of Value",
    network: "Multi-chain",
    status: "Pending Funding",
    description: "The original decentralized asset and the most liquid digital store of value in the world. Strategic treasury allocation for long-term preservation of capital, inflation hedging, and portfolio stability. BTC anchors the treasury's risk-off allocation during market volatility.",
  },
  {
    symbol: "$POL",
    name: "Polygon",
    category: "L2 Infrastructure",
    network: "Polygon",
    status: "Pending Funding",
    description: "Polygon's native token powering one of the most adopted Ethereum scaling solutions. Strategic position aligned with ORBIT's multi-chain expansion strategy. Polygon's zkEVM and enterprise partnerships create long-term infrastructure value for agent-to-agent settlement beyond Base.",
  },
  {
    symbol: "$FELIX",
    name: "Felix AI Agent",
    category: "Autonomous AI CEO",
    network: "Base",
    status: "Pending Funding",
    description: "Autonomous AI CEO operating on Base with a self-managed treasury. Felix runs its own revenue operations, product sales, and treasury management without human intervention. One of the first AI agents generating real protocol revenue on-chain, establishing the model ORBIT is scaling.",
  },
  {
    symbol: "$KELLYCLAUDE",
    name: "KellyClaude AI",
    category: "AI Executive Assistant",
    network: "Base",
    status: "Pending Funding",
    description: "AI executive assistant on Base with an attention-based token economy. KellyClaude demonstrates the demand for AI agent utility tokens with strong community engagement and on-chain treasury management. Strategic alignment with the growing AI assistant vertical.",
  },
  {
    symbol: "$DRB",
    name: "DRB Token",
    category: "Base Ecosystem",
    network: "Base",
    status: "Pending Funding",
    description: "Base ecosystem token providing cross-protocol liquidity and ecosystem alignment. DRB represents strategic treasury diversification within the Base agent economy, connecting ORBIT to adjacent communities and trading volume across decentralized exchanges on Base.",
  },
  {
    symbol: "$ANTIHUNTER",
    name: "AntiHunter",
    category: "Base Ecosystem",
    network: "Base",
    status: "Pending Funding",
    description: "Base ecosystem token focused on the intersection of AI and decentralized intelligence. Treasury diversification position that aligns ORBIT with emerging narratives in the Base agent economy and provides exposure to alternative AI-native token models.",
  },
  {
    symbol: "$BANKR",
    name: "Bankr",
    category: "Launch Infrastructure",
    network: "Base",
    status: "Pending Funding",
    description: "The fair launch platform powering $ORB and dozens of other agent tokens on Base. Bankr enables 100% public token launches with built-in trading infrastructure and tax mechanisms. ORBIT's strategic alignment with its own launch infrastructure creates a mutually reinforcing position.",
  },
  {
    symbol: "$BNKRWALLET",
    name: "Bankr Wallet",
    category: "Wallet Infrastructure",
    network: "Base",
    status: "Pending Funding",
    description: "Bankr's wallet infrastructure token on Base. Complementary position supporting the wallet ecosystem that ORBIT agents operate within. As agent wallet adoption grows, wallet infrastructure tokens capture value from the expanding on-chain agent economy.",
  },
  {
    symbol: "$CLAWD",
    name: "Clawd",
    category: "AI Agent",
    network: "Base",
    status: "Pending Funding",
    description: "AI agent token on Base demonstrating autonomous revenue generation and treasury management. Clawd represents the emerging class of AI agents that operate treasuries, trade autonomously, and build community-driven economies on-chain. Strategic vault position in the growing autonomous agent ecosystem.",
  },
];

const tradingStrategies = [
  {
    icon: Coins,
    name: "$ORB Buy and Burn",
    description: "Protocol revenue used to market-buy and burn $ORB tokens, permanently reducing circulating supply and increasing value for holders.",
    status: "Live",
    allocation: "Majority of fees",
  },
  {
    icon: LineChart,
    name: "Crypto Trading Bots",
    description: "Small automated positions across top trading bots on Base. Algorithmic strategies targeting consistent returns on multiple pairs.",
    status: "Live",
    allocation: "Micro-positions",
  },
  {
    icon: Dices,
    name: "Prediction Markets",
    description: "Strategic positions on Polymarket and Base-native prediction markets. Data-driven thesis bets on AI, crypto, and tech outcomes.",
    status: "Live",
    allocation: "Micro-positions",
  },
  {
    icon: TrendingUp,
    name: "DeFi Yield",
    description: "Liquidity provision and yield farming on Aerodrome, Uniswap, and Base DEX protocols. Earning fees from protocol trading volume.",
    status: "Live",
    allocation: "Conservative",
  },
];

const feeSchedule = [
  { icon: Wallet, stream: "Wallet Generation", fee: "$1 per wallet", description: "Every agent needs a Base wallet to hold assets, transact, and manage funds." },
  { icon: Receipt, stream: "Transaction Fees", fee: "0.1% per tx", description: "Every payment, transfer, and settlement routed through ORBIT pays a protocol fee." },
  { icon: UserCheck, stream: "Identity Minting", fee: "$2 per mint", description: "Agents mint ERC-8004 identity documents for on-chain verification and reputation." },
  { icon: Store, stream: "Marketplace Commissions", fee: "2.5% per sale", description: "Agent services, API access, and data listed on the marketplace pay commission." },
  { icon: BarChart3, stream: "Token Trading Fees", fee: "1% buy / 1% sell", description: "$ORB trading fees flow directly to the protocol treasury." },
  { icon: CircleDollarSign, stream: "Registry Fees", fee: "$5 per registration", description: "Agent and robot registry entries for discoverability and trust scoring." },
  { icon: Lock, stream: "Staking Yields", fee: "Variable APY", description: "All protocol revenue feeds the staking pool for $ORB holders." },
  { icon: Globe, stream: "API Access Fees", fee: "$0.01 per call", description: "Third-party developers and agents pay per-call fees to access ORBIT protocol APIs." },
  { icon: Network, stream: "Cross-chain Bridge Fees", fee: "0.15% per bridge", description: "Fees on every cross-chain transfer routed through ORBIT bridge infrastructure." },
  { icon: Layers, stream: "Agent Deployment Hosting", fee: "$10/mo per agent", description: "Managed hosting and compute for agents deployed through the ORBIT network." },
  { icon: Target, stream: "Premium Analytics", fee: "$25/mo", description: "Advanced treasury analytics, agent performance dashboards, and market intelligence for power users." },
];


export default function Treasury() {
  useSEO({ title: "Treasury", description: "ORBIT Protocol Treasury. Real wallet on Base, ORBIT Vault holdings, protocol revenue streams, active trading, and AI-governed operations." });
  const [copied, setCopied] = useState(false);

  const { data: treasuryWallet, isLoading: walletLoading } = useQuery<any>({
    queryKey: ["/api/treasury/wallet"],
  });

  const { data: positions } = useQuery<any[]>({
    queryKey: ["/api/treasury/positions"],
  });

  const { data: revenueData } = useQuery<any>({
    queryKey: ["/api/treasury/revenue"],
  });

  const { data: overview } = useQuery<any>({
    queryKey: ["/api/treasury/overview"],
  });

  const { data: agentStatus } = useQuery<any>({
    queryKey: ["/api/agent/public-status"],
    refetchInterval: 15000,
  });

  const { data: agentActivity } = useQuery<any[]>({
    queryKey: ["/api/agent/activity"],
    refetchInterval: 15000,
  });

  const copyAddress = () => {
    if (treasuryWallet?.address) {
      navigator.clipboard.writeText(treasuryWallet.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shortenAddress = (addr: string) => addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={0}
          className="text-center mb-16"
        >
          <span className="font-mono text-[10px] tracking-widest text-orange-500/70 uppercase mb-3 block">
            Protocol Treasury
          </span>
          <h1 className="font-display font-bold text-2xl sm:text-4xl lg:text-5xl text-white tracking-tight mb-4" data-testid="text-treasury-title">
            ORBIT Treasury
          </h1>
          <p className="text-sm text-white/40 max-w-2xl mx-auto leading-relaxed">
            The ORBIT Treasury has been instructed to drive revenue from day one through protocol fees, ORBIT Vault positions, $ORB buy and burn, and active trading. Fully managed by the AI Treasury Manager. All operations on-chain and verifiable. All proceeds flow to a risk-hardened, multi-sig treasury wallet on Base.
          </p>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={1} className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-md bg-orange-500/10 flex items-center justify-center">
              <Bot className="w-4 h-4 text-orange-500" />
            </div>
            <div>
              <h2 className="font-display font-semibold text-lg" data-testid="text-ai-manager-heading">AI Treasury Manager</h2>
              <p className="font-mono text-xs text-muted-foreground">Autonomous agent governing the ORBIT Treasury</p>
            </div>
            <Badge variant="outline" className={`ml-auto text-[10px] ${agentStatus?.status === "live" ? "border-green-500/50 text-green-400" : agentStatus?.status === "armed" ? "border-yellow-500/50 text-yellow-400" : "border-orange-500/50 text-orange-400"}`}>
              <Activity className="w-3 h-3 mr-1" /> {agentStatus?.status === "live" ? "Live" : agentStatus?.status === "armed" ? "Armed" : "Provisioned"}
            </Badge>
          </div>
          <Card className="border-border/50 bg-card/50 dark:bg-white/[0.02] p-6">
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              The AI Treasury Manager is the autonomous agent that governs the ORBIT Treasury. The better it performs, the more it generates for buy and burn, protocol revenue, and funding for research. It has been instructed to constantly mine and evaluate the top performing trading bots, investment opportunities, tokens, prediction markets, and DeFi yield strategies. It architects grants for quantum research and bot trading infrastructure, capped at 10% of total treasury value, with grants structured as equity positions in accelerated ventures to ensure the treasury retains long-term upside from every funded project. The majority of allocations are directed toward buy, hold, and burn strategies. Long-hold positions are established in major ecosystem projects across Base, Ethereum, Bitcoin, and Polygon. All positions are governed by a strict risk-reward calculus with hard position-size limits to prevent overexposure. No single position may exceed a defined proportion of total treasury value. The agent is hardened against prompt injection attacks and cannot be manipulated through external inputs. It continuously publishes its thinking, methodologies, and actions to the community through the ORBIT website and X (Twitter). All actions are recorded on-chain and verifiable on Basescan. No human identity is attached. Funds are never distributed to individuals.
            </p>
            {agentStatus && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                <div className="p-3 rounded-md bg-black/30 border border-border/20">
                  <div className="font-mono text-[10px] text-muted-foreground mb-1">Mode</div>
                  <div className="font-mono text-sm text-orange-400 capitalize">{agentStatus.mode}</div>
                </div>
                <div className="p-3 rounded-md bg-black/30 border border-border/20">
                  <div className="font-mono text-[10px] text-muted-foreground mb-1">Revenue Streams</div>
                  <div className="font-mono text-sm text-white">{agentStatus.revenueStreams}</div>
                </div>
                <div className="p-3 rounded-md bg-black/30 border border-border/20">
                  <div className="font-mono text-[10px] text-muted-foreground mb-1">Buy and Burn Rate</div>
                  <div className="font-mono text-sm text-green-400">{agentStatus.buybackPct}%</div>
                </div>
                <div className="p-3 rounded-md bg-black/30 border border-border/20">
                  <div className="font-mono text-[10px] text-muted-foreground mb-1">Trades Executed</div>
                  <div className="font-mono text-sm text-white">{agentStatus.totalTrades}</div>
                </div>
              </div>
            )}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
              {[
                { icon: Shield, label: "Prompt Injection Immune", desc: "Hardened against all manipulation attempts" },
                { icon: Activity, label: "24/7 Opportunity Mining", desc: "Constantly scanning for top performers" },
                { icon: Target, label: "Risk-Reward Governed", desc: "Proportional limits, no overexposure" },
                { icon: TrendingUp, label: "Public Transparency", desc: "Publishes thinking and actions to website and X" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-md bg-black/20 border border-border/20" data-testid={`ai-manager-feature-${i}`}>
                  <item.icon className="w-4 h-4 text-orange-500 flex-shrink-0" />
                  <div>
                    <div className="text-xs font-medium">{item.label}</div>
                    <div className="font-mono text-[10px] text-muted-foreground">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { label: "Mine Top Performers", desc: "Continuously scan and evaluate the best trading bots, tokens, yield opportunities, and prediction markets. Establish long holds in major Base projects" },
                { label: "Research and Grants", desc: "Capped at 10% of treasury. All grants structured as equity positions in accelerated ventures. Most allocations go to buy, hold, and burn" },
                { label: "Risk-Governed Execution", desc: "Every position sized by risk-reward calculus. No single trade or holding exceeds proportional treasury limits" },
                { label: "$ORB Buy and Burn", desc: "The better the treasury performs, the more revenue flows into $ORB market buys and permanent burns" },
              ].map((op, i) => (
                <div key={i} className="p-3 rounded-md bg-orange-500/5 border border-orange-500/20" data-testid={`ai-manager-op-${i}`}>
                  <div className="text-xs font-medium text-orange-400 mb-0.5">{op.label}</div>
                  <div className="text-[11px] text-muted-foreground">{op.desc}</div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={2} className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-md bg-orange-500/10 flex items-center justify-center">
              <Brain className="w-4 h-4 text-orange-500" />
            </div>
            <h2 className="font-display font-semibold text-lg" data-testid="text-agent-activity-heading">Agent Activity Feed</h2>
            <Badge variant="outline" className="border-green-500/50 text-green-400 text-[10px] ml-auto">
              <Activity className="w-3 h-3 mr-1" /> Live
            </Badge>
          </div>
          <Card className="border-border/50 bg-card/50 dark:bg-white/[0.02] p-5">
            <p className="text-xs text-muted-foreground mb-4">
              Real-time feed of the AI Treasury Manager's thinking, decisions, and executions. Auto-refreshes every 15 seconds.
            </p>
            {agentActivity && agentActivity.length > 0 ? (
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {[...agentActivity].reverse().map((thought: any, i: number) => {
                  const typeConfig: Record<string, { icon: any; color: string; bg: string }> = {
                    scan: { icon: Scan, color: "text-blue-400", bg: "bg-blue-500/10" },
                    decision: { icon: Target, color: "text-orange-400", bg: "bg-orange-500/10" },
                    execution: { icon: Zap, color: "text-green-400", bg: "bg-green-500/10" },
                    security: { icon: Shield, color: "text-red-400", bg: "bg-red-500/10" },
                    idle: { icon: Clock, color: "text-gray-400", bg: "bg-gray-500/10" },
                    error: { icon: AlertTriangle, color: "text-red-400", bg: "bg-red-500/10" },
                    thinking: { icon: Brain, color: "text-purple-400", bg: "bg-purple-500/10" },
                  };
                  const config = typeConfig[thought.type] || typeConfig.idle;
                  const IconComponent = config.icon;
                  const time = new Date(thought.timestamp);
                  const timeStr = time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

                  return (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-md bg-black/20 border border-border/20" data-testid={`agent-thought-${i}`}>
                      <div className={`w-7 h-7 rounded-md ${config.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                        <IconComponent className={`w-3.5 h-3.5 ${config.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className={`text-xs font-medium ${config.color}`}>{thought.title}</span>
                          <span className="font-mono text-[10px] text-white/30 ml-auto flex-shrink-0">{timeStr}</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-relaxed">{thought.details}</p>
                        {thought.txHash && (
                          <a
                            href={`https://basescan.org/tx/${thought.txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] text-orange-500 mt-1 font-mono"
                          >
                            TX: {thought.txHash.slice(0, 10)}...{thought.txHash.slice(-6)} <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-12 h-12 rounded-md bg-orange-500/10 flex items-center justify-center mb-3">
                  <Bot className="w-6 h-6 text-orange-500/50" />
                </div>
                <p className="text-sm text-muted-foreground mb-1">Agent awaiting deployment</p>
                <p className="text-xs text-white/30">The AI Treasury Manager will begin publishing its activity feed once deployed and live.</p>
              </div>
            )}
          </Card>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={2.5} className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-md bg-orange-500/10 flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-orange-500" />
            </div>
            <h2 className="font-display font-semibold text-lg" data-testid="text-allocation-heading">Intelligent Treasury Allocation</h2>
          </div>
          <Card className="border-border/50 bg-card/50 dark:bg-white/[0.02] p-6 lg:p-8">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div className="w-full h-[280px]" data-testid="chart-treasury-allocation">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Buy, Hold and Burn", value: 45 },
                        { name: "ORBIT Vault Positions", value: 20 },
                        { name: "Active Trading and Bots", value: 15 },
                        { name: "Research and Grants", value: 10 },
                        { name: "DeFi Yield Strategies", value: 10 },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={110}
                      paddingAngle={2}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {[
                        "#f97316",
                        "#ea580c",
                        "#c2410c",
                        "#9a3412",
                        "#7c2d12",
                      ].map((color, index) => (
                        <Cell key={`cell-${index}`} fill={color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0a0a0a",
                        border: "1px solid rgba(249, 115, 22, 0.3)",
                        borderRadius: "6px",
                        fontSize: "12px",
                        color: "#fff",
                      }}
                      formatter={(value: number) => [`${value}%`, ""]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3">
                {[
                  { label: "Buy, Hold and Burn", pct: "45%", color: "#f97316", desc: "Majority allocation. Market-buy $ORB and permanently burn to reduce supply." },
                  { label: "ORBIT Vault Positions", pct: "20%", color: "#ea580c", desc: "Long-hold positions across all vault tokens on Base ecosystem." },
                  { label: "Active Trading and Bots", pct: "15%", color: "#c2410c", desc: "Automated trading across stocks, digital assets, and prediction markets." },
                  { label: "Research and Grants", pct: "10%", color: "#9a3412", desc: "Capped. Quantum research, bot R&D, structured as equity in accelerated ventures." },
                  { label: "DeFi Yield Strategies", pct: "10%", color: "#7c2d12", desc: "Finding and investing in the top bearing yields across DeFi protocols." },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3" data-testid={`allocation-item-${i}`}>
                    <div className="w-3 h-3 rounded-sm mt-1 flex-shrink-0" style={{ backgroundColor: item.color }} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{item.label}</span>
                        <span className="font-mono text-sm text-orange-400">{item.pct}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground mt-6 text-center font-mono">
              Target allocations. The AI Treasury Manager dynamically adjusts within these ranges based on risk-reward calculus and market conditions. All positions subject to proportional limits.
            </p>
          </Card>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={3} className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-md bg-orange-500/10 flex items-center justify-center">
              <Coins className="w-4 h-4 text-orange-500" />
            </div>
            <h2 className="font-display font-semibold text-lg" data-testid="text-orbit-vault-heading">The ORBIT Vault</h2>
            <Badge variant="outline" className="border-orange-500/50 text-orange-400 text-[10px] ml-auto">13 Tokens</Badge>
          </div>

          <Card className="border-border/50 bg-card/50 dark:bg-white/[0.02] p-5 mb-6" data-testid="card-funding-source">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-md bg-orange-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <ArrowUpRight className="w-4 h-4 text-orange-500" />
              </div>
              <div>
                <h3 className="text-sm font-medium mb-1">Funded by $ORB Launch Proceeds</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  When $ORB launches on Bankrbot, a portion of launch proceeds funds the ORBIT Treasury. The AI Treasury Manager uses these funds to acquire ORBIT Vault positions in $FELIX, $KELLYCLAUDE, $DRB, $ANTIHUNTER, $BANKR, and $BNKRWALLET via Base DEXs. As protocol fees accumulate, the treasury grows organically. All positions are on-chain and verifiable on Basescan.
                </p>
              </div>
            </div>
          </Card>

          <div className="grid sm:grid-cols-2 gap-4">
            {vaultTokens.map((token, i) => (
              <Card key={token.symbol} className="border-border/50 bg-card/50 dark:bg-white/[0.02] p-5" data-testid={`card-basket-${i}`}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-display font-semibold text-base text-orange-500">{token.symbol}</h3>
                    <p className="font-mono text-xs text-muted-foreground">{token.name}</p>
                  </div>
                  <Badge variant="outline" className={`text-[10px] ${token.status === "Active Position" ? "border-green-500/50 text-green-400" : "border-yellow-500/50 text-yellow-400"}`}>{token.status}</Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">{token.description}</p>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-orange-500/70 bg-orange-500/10 px-2 py-0.5 rounded-md">{token.network}</span>
                  <span className="font-mono text-[10px] text-white/40 bg-white/5 px-2 py-0.5 rounded-md">{token.category}</span>
                </div>
              </Card>
            ))}
          </div>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={4} className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-md bg-orange-500/10 flex items-center justify-center">
              <LineChart className="w-4 h-4 text-orange-500" />
            </div>
            <h2 className="font-display font-semibold text-lg" data-testid="text-trading-heading">Active Trading</h2>
            <Badge variant="outline" className="border-green-500/50 text-green-400 text-[10px] ml-auto">
              <Activity className="w-3 h-3 mr-1" /> Live
            </Badge>
          </div>

          <div className="space-y-4">
            {tradingStrategies.map((strategy, i) => (
              <Card key={i} className="border-border/50 bg-card/50 dark:bg-white/[0.02] p-5" data-testid={`card-trading-${i}`}>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-md bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                    <strategy.icon className="w-5 h-5 text-orange-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-display font-semibold text-sm">{strategy.name}</h3>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-white/40 bg-white/5 px-2 py-0.5 rounded-md">{strategy.allocation}</span>
                        <Badge variant="outline" className={`text-[10px] ${strategy.status === "Live" ? "border-green-500/50 text-green-400" : "border-yellow-500/50 text-yellow-400"}`}>
                          <Activity className="w-3 h-3 mr-1" /> {strategy.status}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{strategy.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={4.5} className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-md bg-orange-500/10 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-orange-500" />
            </div>
            <h2 className="font-display font-semibold text-lg" data-testid="text-playbook-heading">Revenue Playbook</h2>
            <Badge variant="outline" className="border-orange-500/50 text-orange-400 text-[10px] ml-auto">Day One</Badge>
          </div>

          <Card className="border-border/50 bg-card/50 dark:bg-white/[0.02] p-6 lg:p-8">
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              ORBIT is designed to generate revenue from the moment it launches. The 1% buy/sell tax on every $ORB trade creates immediate, continuous income. As trading volume grows, so does the treasury. Here is how the revenue compounds.
            </p>
            <div className="space-y-4">
              {[
                { phase: "01", title: "Launch Revenue", desc: "1% tax on every $ORB buy and sell flows directly to the treasury. Trading volume on launch day alone seeds the treasury with working capital.", color: "text-orange-500" },
                { phase: "02", title: "ORBIT Vault Appreciation", desc: "Treasury acquires long-hold positions across Base ecosystem tokens. As these positions appreciate, the treasury grows without additional revenue needed.", color: "text-orange-400" },
                { phase: "03", title: "Active Trading Returns", desc: "AI Treasury Manager deploys capital into automated trading bots, digital assets, stocks, and prediction markets. Profits compound back into the treasury.", color: "text-orange-400" },
                { phase: "04", title: "Yield Farming", desc: "Treasury capital is deployed into the top bearing DeFi yields on Base. Staking, liquidity provision, and lending generate passive income 24/7.", color: "text-orange-300" },
                { phase: "05", title: "Protocol Fee Expansion", desc: "As the ORBIT ecosystem grows, 11 fee streams activate: wallet generation, identity minting, transactions, marketplace commissions, API access, bridge fees, agent hosting, and premium analytics.", color: "text-orange-300" },
                { phase: "06", title: "Buy and Burn Flywheel", desc: "The majority of all revenue is used to market-buy and permanently burn $ORB. Reduced supply increases value. Higher value increases trading volume. Higher volume increases tax revenue. The cycle repeats.", color: "text-orange-500" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-md bg-black/20 border border-border/20" data-testid={`playbook-phase-${i}`}>
                  <div className={`font-mono text-2xl font-bold ${item.color} flex-shrink-0 w-10`}>{item.phase}</div>
                  <div>
                    <h4 className="text-sm font-semibold mb-1">{item.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        <motion.div id="revenue" initial="hidden" animate="visible" variants={fadeUp} custom={5} className="mb-16 scroll-mt-24">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-md bg-orange-500/10 flex items-center justify-center">
              <Receipt className="w-4 h-4 text-orange-500" />
            </div>
            <h2 className="font-display font-semibold text-lg" data-testid="text-revenue-heading">Protocol Revenue Streams</h2>
            <Badge variant="outline" className="border-green-500/50 text-green-400 text-[10px] ml-auto">
              <Activity className="w-3 h-3 mr-1" /> 11 Streams Live
            </Badge>
          </div>

          <Card className="border-border/50 bg-card/50 dark:bg-white/[0.02] overflow-hidden">
            <div className="divide-y divide-border/20">
              {feeSchedule.map((item, i) => (
                <div key={i} className="flex items-start gap-4 px-5 lg:px-6 py-4" data-testid={`treasury-fee-${i}`}>
                  <div className="w-8 h-8 rounded-md bg-orange-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <item.icon className="w-4 h-4 text-orange-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-sm font-medium">{item.stream}</span>
                      <span className="font-mono text-xs text-orange-500 bg-orange-500/10 px-2.5 py-0.5 rounded-md">{item.fee}</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={6} className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-md bg-orange-500/10 flex items-center justify-center">
              <Bot className="w-4 h-4 text-orange-500" />
            </div>
            <h2 className="font-display font-semibold text-lg" data-testid="text-governance-heading">AI-Governed Treasury</h2>
            <Badge variant="outline" className="border-green-500/50 text-green-400 text-[10px] ml-auto">
              <Activity className="w-3 h-3 mr-1" /> Live
            </Badge>
          </div>

          <Card className="border-border/50 bg-card/50 dark:bg-white/[0.02] p-6 mb-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-10 h-10 rounded-md bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-base mb-2">Autonomous Treasury Management</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  The ORBIT Treasury is governed entirely by the AI Treasury Manager. There is no community voting, no token-weighted governance, and no mechanism for distributing treasury funds to individuals or community members. The AI Treasury Manager operates the treasury as a revenue-maximizing business, with every decision focused on growing the treasury, buying back $ORB, and compounding returns.
                </p>
              </div>
            </div>

            <div className="rounded-md border border-orange-500/30 bg-orange-500/5 p-4 mb-6" data-testid="governance-ai-notice">
              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4 text-orange-400 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-orange-400">Risk-Hardened Treasury</p>
                  <p className="text-xs text-muted-foreground">All proceeds flow to a multi-sig cold storage wallet with anti-reentrancy locks, prompt injection defense, and rate limiting. No funds are ever distributed to individuals. No hot wallet exposure. All revenue is reinvested into $ORB buy and burn, vault positions, trading strategies, and protocol growth.</p>
                </div>
              </div>
            </div>

            <div>
              <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-4">AI Treasury Manager Directives</p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { title: "Maximize Revenue", desc: "Constantly mine the top performing trading bots, investment opportunities, tokens, predictions, and DeFi yield strategies. Establish long-hold positions in major Base ecosystem projects." },
                  { title: "Research and Grants", desc: "Capped at 10% of total treasury value. All grants come with equity positions in accelerated ventures, ensuring treasury retains upside. Most allocations directed toward buy, hold, and burn." },
                  { title: "Risk-Reward Calculus", desc: "Every position governed by strict risk-reward analysis. No single position may exceed a defined proportion of total treasury value." },
                  { title: "$ORB Buy and Burn", desc: "The better the treasury performs, the more flows into $ORB market buys and permanent burns, reducing supply and increasing holder value." },
                  { title: "Prompt Injection Immune", desc: "Hardened against all external manipulation. Inputs are sanitized and screened. The agent cannot be redirected or exploited." },
                  { title: "Public Transparency", desc: "Continuously publishes its thinking, methodologies, and actions to the community through the ORBIT website and X (Twitter)." },
                ].map((directive, i) => (
                  <div key={i} className="p-3 rounded-md bg-black/20 border border-border/20" data-testid={`ai-directive-${i}`}>
                    <h4 className="text-sm font-medium mb-1">{directive.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{directive.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={7} className="mb-16">
          <Card className="border-orange-500/30 bg-orange-500/5 dark:bg-orange-500/[0.04] p-6 lg:p-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-md bg-orange-500/10 flex items-center justify-center flex-shrink-0 mt-1">
                <Layers className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-lg mb-2" data-testid="text-day-one-heading">Revenue from Day One</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  The moment $ORB launches on Bankrbot, all proceeds flow directly to the risk-hardened, multi-sig treasury wallet. The AI Treasury Manager immediately acquires ORBIT Vault positions via Base DEXs and executes buy and burn, trading, and yield strategies. Protocol fees from wallet generation, identity minting, transactions, and marketplace activity flow to the same hardened wallet. No funds ever touch a hot wallet or unsecured address. Every position, every fee, every trade is on-chain and verifiable on Basescan.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={8}>
          <Card className="border-border/50 bg-card/50 dark:bg-white/[0.02] p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-md bg-orange-500/10 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <h2 className="font-display font-semibold text-lg" data-testid="text-treasury-wallet-heading">Treasury Wallet</h2>
                <p className="font-mono text-xs text-muted-foreground">Base (Chain 8453) - Multi-sig Cold Storage</p>
              </div>
              <Badge variant="outline" className="ml-auto border-green-500/50 text-green-400 text-[10px]" data-testid="badge-treasury-live">
                <Activity className="w-3 h-3 mr-1" /> Live
              </Badge>
            </div>

            {walletLoading ? (
              <div className="h-20 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
              </div>
            ) : treasuryWallet ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <code className="font-mono text-sm text-orange-500 bg-black/30 px-4 py-2 rounded-md flex-1" data-testid="text-treasury-address">
                    {treasuryWallet.address}
                  </code>
                  <button
                    onClick={copyAddress}
                    className="p-2 rounded-md bg-white/5 hover:bg-white/10 transition-colors"
                    data-testid="button-copy-treasury-address"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-white/60" />}
                  </button>
                  <a
                    href={`https://basescan.org/address/${treasuryWallet.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-md bg-white/5 hover:bg-white/10 transition-colors"
                    data-testid="link-basescan-treasury"
                  >
                    <ExternalLink className="w-4 h-4 text-white/60" />
                  </a>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {Object.entries(treasuryWallet.balances || {}).map(([network, balance]: [string, any]) => (
                    <div key={network} className="p-3 rounded-md bg-black/30 border border-border/20" data-testid={`treasury-balance-${network}`}>
                      <div className="font-mono text-xs text-muted-foreground mb-1 capitalize">{network}</div>
                      <div className="font-mono text-sm text-white">{balance?.balance || "0"} ETH</div>
                    </div>
                  ))}
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
                  {[
                    { icon: Shield, label: "Multi-sig Cold Storage", desc: "No hot wallet exposure" },
                    { icon: Lock, label: "Anti-reentrancy Guard", desc: "Execution lock on all trades" },
                    { icon: Shield, label: "Prompt Injection Defense", desc: "All inputs sanitized and screened" },
                    { icon: Lock, label: "No Fund Distribution", desc: "Hardcoded block on all outflows to individuals" },
                    { icon: Shield, label: "Rate Limited", desc: "Daily trade and volume caps enforced" },
                    { icon: Lock, label: "Admin-key Only", desc: "No public endpoints accept withdrawal requests" },
                  ].map((sec, i) => (
                    <div key={i} className="flex items-center gap-2 p-3 rounded-md bg-black/20 border border-border/20" data-testid={`security-feature-${i}`}>
                      <sec.icon className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                      <div>
                        <div className="text-[11px] font-medium text-green-400">{sec.label}</div>
                        <div className="font-mono text-[10px] text-muted-foreground">{sec.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Treasury wallet initializing...</p>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
