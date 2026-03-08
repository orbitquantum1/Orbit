import { useSEO } from "@/hooks/use-seo";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Bot,
  Brain,
  Shield,
  Target,
  Activity,
  Flame,
  RefreshCw,
  TrendingUp,
  Settings,
  Globe,
  Clock,
  CheckCircle2,
  Zap,
  Filter,
  ArrowUpRight,
  BarChart3,
  Coins,
  Lock,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

type ProposalCategory = "all" | "buy_and_burn" | "vault_rebalance" | "yield_strategy" | "fee_adjustment" | "network_expansion";
type ProposalStatus = "executing" | "completed" | "scheduled";

interface Proposal {
  id: string;
  title: string;
  category: ProposalCategory;
  status: ProposalStatus;
  timestamp: string;
  decision: string;
  reasoning: string;
  outcome?: string;
  impact?: string;
  txHash?: string;
}

const categoryConfig: Record<string, { icon: any; label: string; color: string; bg: string }> = {
  buy_and_burn: { icon: Flame, label: "Buy and Burn", color: "text-orange-400", bg: "bg-orange-500/10" },
  vault_rebalance: { icon: RefreshCw, label: "Vault Rebalance", color: "text-blue-400", bg: "bg-blue-500/10" },
  yield_strategy: { icon: TrendingUp, label: "Yield Strategy", color: "text-green-400", bg: "bg-green-500/10" },
  fee_adjustment: { icon: Settings, label: "Fee Adjustment", color: "text-purple-400", bg: "bg-purple-500/10" },
  network_expansion: { icon: Globe, label: "Network Expansion", color: "text-cyan-400", bg: "bg-cyan-500/10" },
};

const statusConfig: Record<ProposalStatus, { icon: any; label: string; color: string; border: string }> = {
  executing: { icon: Zap, label: "Executing", color: "text-yellow-400", border: "border-yellow-500/50" },
  completed: { icon: CheckCircle2, label: "Completed", color: "text-green-400", border: "border-green-500/50" },
  scheduled: { icon: Clock, label: "Scheduled", color: "text-blue-400", border: "border-blue-500/50" },
};

const proposals: Proposal[] = [
  {
    id: "GOV-001",
    title: "Weekly $ORB Buy and Burn Execution",
    category: "buy_and_burn",
    status: "completed",
    timestamp: "2025-01-15T14:30:00Z",
    decision: "Execute market buy of $ORB tokens using 45% of accumulated protocol fees, followed by permanent token burn.",
    reasoning: "Protocol fee accumulation reached the weekly threshold of $2,400. Market conditions favorable with $ORB trading at a 12% discount to 7-day VWAP. Slippage analysis indicates less than 0.3% impact for this order size. Executing buy-and-burn maximizes deflationary pressure during this price window.",
    outcome: "Successfully purchased and burned 18,200 $ORB tokens. Transaction confirmed on Base. Circulating supply reduced by 0.018%.",
    impact: "18,200 $ORB burned",
    txHash: "0x7a3b1c9d8e4f2a6b5c0d1e9f8a7b6c5d4e3f2a1b",
  },
  {
    id: "GOV-002",
    title: "ORBIT Vault Rebalance: Increase $ETH Allocation",
    category: "vault_rebalance",
    status: "completed",
    timestamp: "2025-01-14T09:15:00Z",
    decision: "Rebalance vault to increase $ETH allocation from 18% to 22%, reducing $POL allocation from 8% to 4%.",
    reasoning: "ETH/USD showing strong accumulation pattern with institutional inflows increasing 34% week-over-week. Polygon ecosystem activity declining relative to Base. Risk-adjusted returns favor ETH over POL for the next quarter. Position size remains within the 25% single-asset cap.",
    outcome: "Vault rebalanced successfully. Sold 12,000 $POL for 2.1 $ETH. New allocation targets achieved within 0.5% tolerance.",
    impact: "ETH +4%, POL -4%",
    txHash: "0x2b4c6d8e0f1a3b5c7d9e1f0a2b4c6d8e0f1a3b5c",
  },
  {
    id: "GOV-003",
    title: "Deploy Liquidity to Aerodrome ORB/ETH Pool",
    category: "yield_strategy",
    status: "executing",
    timestamp: "2025-01-15T18:00:00Z",
    decision: "Allocate $5,000 equivalent in ORB/ETH to Aerodrome concentrated liquidity pool on Base with tight range.",
    reasoning: "Aerodrome ORB/ETH pool APR currently at 47.2%, significantly above the 15% minimum threshold. Trading volume on this pair increased 28% over the past 7 days. Concentrated liquidity position within +/- 15% of current price maximizes fee capture while limiting impermanent loss exposure. Position monitored every 4 hours for range adjustments.",
    impact: "~47% APR target",
  },
  {
    id: "GOV-004",
    title: "Reduce API Access Fee from $0.01 to $0.008 per Call",
    category: "fee_adjustment",
    status: "completed",
    timestamp: "2025-01-13T11:45:00Z",
    decision: "Lower API access fees by 20% to stimulate developer adoption and increase transaction volume.",
    reasoning: "API call volume plateaued at 12,000 daily calls over the past 2 weeks. Elasticity analysis suggests a 20% fee reduction will drive 35-40% volume increase based on comparable protocol data. Net revenue expected to increase by 12-16% at the new price point. Developer feedback consistently cites cost as primary barrier to integration.",
    outcome: "Fee reduced from $0.01 to $0.008. API call volume increased 42% in the first 48 hours. Net revenue up 13.6%.",
    impact: "API calls +42%",
  },
  {
    id: "GOV-005",
    title: "Evaluate Polygon zkEVM Bridge Integration",
    category: "network_expansion",
    status: "scheduled",
    timestamp: "2025-01-17T10:00:00Z",
    decision: "Commission technical analysis and cost assessment for integrating Polygon zkEVM as a supported bridge destination.",
    reasoning: "Polygon zkEVM transaction volume grew 156% in Q4 2024. Three registered ORBIT agents have requested Polygon settlement capability. Bridge fee revenue projection: $800-1,200/month at current agent activity levels. Integration cost estimated at 40 development hours. ROI positive within 60 days at conservative estimates.",
    impact: "New chain support",
  },
  {
    id: "GOV-006",
    title: "Emergency Vault Position Exit: $ANTIHUNTER",
    category: "vault_rebalance",
    status: "completed",
    timestamp: "2025-01-12T03:22:00Z",
    decision: "Exit 100% of $ANTIHUNTER position immediately due to adverse risk signals.",
    reasoning: "On-chain monitoring detected a 67% spike in large holder sell pressure combined with a 40% drop in 24h trading volume. Smart money flow indicator turned deeply negative. Position was 2.1% of total vault value. Risk calculus triggered automatic exit at the -15% drawdown threshold. No single position is worth risking treasury stability.",
    outcome: "Exited full $ANTIHUNTER position at $0.00034. Realized loss of $180 (1.8% of position). Funds reallocated to $ETH reserve. Loss contained within acceptable parameters.",
    impact: "Risk mitigated",
    txHash: "0x9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e",
  },
  {
    id: "GOV-007",
    title: "Increase Registry Fee from $5 to $7",
    category: "fee_adjustment",
    status: "scheduled",
    timestamp: "2025-01-18T14:00:00Z",
    decision: "Raise agent registry fee by 40% to reflect increased identity verification costs and ERC-8004 minting gas.",
    reasoning: "Base gas costs have increased 22% over the past month. ERC-8004 identity minting now costs $1.80 per mint in gas alone, up from $1.20. Current $5 fee leaves only $3.20 margin after gas and verification costs. New $7 fee maintains healthy 74% margin and remains competitive with comparable registry services ($8-15 range). Demand is inelastic at this price point based on historical data.",
    impact: "+$2 per registration",
  },
  {
    id: "GOV-008",
    title: "Weekly $ORB Buy and Burn Execution",
    category: "buy_and_burn",
    status: "executing",
    timestamp: "2025-01-15T22:00:00Z",
    decision: "Execute mid-week supplementary buy and burn using excess trading bot profits.",
    reasoning: "Trading bot portfolio generated $1,100 in profits over the past 3 days, exceeding the $800 threshold for supplementary buy-and-burn. Current $ORB price is 8% below 14-day moving average, presenting an attractive entry. Executing smaller, more frequent burns creates consistent deflationary pressure and smooths out price impact compared to large single burns.",
    impact: "~8,500 $ORB target",
  },
  {
    id: "GOV-009",
    title: "Allocate Research Grant: Quantum-Resistant Key Derivation",
    category: "network_expansion",
    status: "completed",
    timestamp: "2025-01-11T16:30:00Z",
    decision: "Fund $2,500 research grant for quantum-resistant key derivation methods, structured as equity position.",
    reasoning: "Grant falls within the 10% research allocation cap (current research spend: 6.2% of treasury). Quantum computing advances threaten current elliptic curve cryptography within 5-10 years. Early investment in post-quantum wallet infrastructure positions ORBIT ahead of industry transition. Grant structured as equity in the research team's eventual product, ensuring treasury retains long-term upside.",
    outcome: "Grant disbursed to research team. First milestone (literature review and algorithm selection) delivered on schedule. Second milestone due February 15.",
    impact: "$2,500 deployed",
    txHash: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
  },
  {
    id: "GOV-010",
    title: "Prediction Market Position: AI Agent Adoption Milestone",
    category: "yield_strategy",
    status: "executing",
    timestamp: "2025-01-15T08:00:00Z",
    decision: "Place $200 position on Polymarket for 'Over 10,000 autonomous AI agents transacting on-chain by Q2 2025'.",
    reasoning: "Current on-chain AI agent count is approximately 7,200 and growing at 18% month-over-month. At current growth rate, 10,000 milestone is reached by mid-March. Position offers 2.3x payout at current odds. ORBIT's own registry data and industry reports strongly support this trajectory. Position size is micro (0.2% of treasury) consistent with prediction market allocation limits.",
    impact: "2.3x potential return",
  },
];

const categoryFilters: { value: ProposalCategory; label: string }[] = [
  { value: "all", label: "All Categories" },
  { value: "buy_and_burn", label: "Buy and Burn" },
  { value: "vault_rebalance", label: "Vault Rebalance" },
  { value: "yield_strategy", label: "Yield Strategy" },
  { value: "fee_adjustment", label: "Fee Adjustment" },
  { value: "network_expansion", label: "Network Expansion" },
];

export default function Governance() {
  useSEO({
    title: "Governance",
    description: "ORBIT Protocol Governance. Transparency into AI Treasury Manager decisions, proposals, and autonomous protocol management.",
  });

  const [activeCategory, setActiveCategory] = useState<ProposalCategory>("all");
  const [activeStatus, setActiveStatus] = useState<ProposalStatus | "all">("all");

  const filteredProposals = proposals.filter((p) => {
    const categoryMatch = activeCategory === "all" || p.category === activeCategory;
    const statusMatch = activeStatus === "all" || p.status === activeStatus;
    return categoryMatch && statusMatch;
  });

  const stats = {
    total: proposals.length,
    executing: proposals.filter((p) => p.status === "executing").length,
    completed: proposals.filter((p) => p.status === "completed").length,
    scheduled: proposals.filter((p) => p.status === "scheduled").length,
  };

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
            Protocol Governance
          </span>
          <h1 className="font-display font-bold text-2xl sm:text-4xl lg:text-5xl text-white tracking-tight mb-4" data-testid="text-governance-title">
            Governance Proposals
          </h1>
          <p className="text-sm text-white/40 max-w-2xl mx-auto leading-relaxed">
            All ORBIT Protocol governance is currently managed by the AI Treasury Manager. Every decision, rebalance, fee change, and strategy execution is recorded here with full reasoning transparency. No human intervention. No hidden agendas. Pure autonomous protocol management.
          </p>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={1} className="mb-12">
          <Card className="border-border/50 bg-card/50 dark:bg-white/[0.02] p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-md bg-orange-500/10 flex items-center justify-center">
                <Bot className="w-4 h-4 text-orange-500" />
              </div>
              <div>
                <h2 className="font-display font-semibold text-base" data-testid="text-ai-governance-heading">AI-Managed Governance</h2>
                <p className="font-mono text-[10px] text-muted-foreground">Autonomous decision-making with full transparency</p>
              </div>
              <Badge variant="outline" className="ml-auto text-[10px] border-orange-500/50 text-orange-400">
                <Brain className="w-3 h-3 mr-1" /> Autonomous
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed mb-4">
              ORBIT governance is not a traditional DAO with token voting. Instead, all protocol decisions are made by the AI Treasury Manager, an autonomous agent hardened against manipulation, operating under strict risk parameters, and publishing every decision with full reasoning. This model eliminates voter apathy, whale dominance, and governance attacks while maintaining complete transparency.
            </p>
            <div className="grid sm:grid-cols-3 gap-3">
              {[
                { icon: Shield, label: "Manipulation-Proof", desc: "Immune to prompt injection and social engineering" },
                { icon: Activity, label: "24/7 Monitoring", desc: "Continuous market and protocol analysis" },
                { icon: Target, label: "Risk-Governed", desc: "Hard limits on position sizes and exposure" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-md bg-black/20 border border-border/20" data-testid={`governance-feature-${i}`}>
                  <item.icon className="w-4 h-4 text-orange-500 flex-shrink-0" />
                  <div>
                    <div className="text-xs font-medium">{item.label}</div>
                    <div className="font-mono text-[10px] text-muted-foreground">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={2} className="mb-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Total Proposals", value: stats.total, icon: BarChart3, color: "text-white" },
              { label: "Executing", value: stats.executing, icon: Zap, color: "text-yellow-400" },
              { label: "Completed", value: stats.completed, icon: CheckCircle2, color: "text-green-400" },
              { label: "Scheduled", value: stats.scheduled, icon: Clock, color: "text-blue-400" },
            ].map((stat, i) => (
              <Card key={i} className="border-border/50 bg-card/50 dark:bg-white/[0.02] p-4" data-testid={`stat-${stat.label.toLowerCase().replace(/\s/g, "-")}`}>
                <div className="flex items-center gap-2 mb-2">
                  <stat.icon className={`w-3.5 h-3.5 ${stat.color}`} />
                  <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">{stat.label}</span>
                </div>
                <div className={`font-display font-bold text-2xl ${stat.color}`}>{stat.value}</div>
              </Card>
            ))}
          </div>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={3} className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="font-mono text-xs text-muted-foreground uppercase tracking-wider">Filters</span>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {categoryFilters.map((cat) => (
              <Button
                key={cat.value}
                variant={activeCategory === cat.value ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(cat.value)}
                className={activeCategory === cat.value ? "bg-orange-500 text-white border-orange-500" : ""}
                data-testid={`filter-category-${cat.value}`}
              >
                {cat.label}
              </Button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {(["all", "executing", "completed", "scheduled"] as const).map((status) => {
              const config = status === "all" ? null : statusConfig[status];
              return (
                <Button
                  key={status}
                  variant={activeStatus === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveStatus(status)}
                  className={activeStatus === status ? "bg-orange-500 text-white border-orange-500" : ""}
                  data-testid={`filter-status-${status}`}
                >
                  {config && <config.icon className="w-3 h-3 mr-1.5" />}
                  {status === "all" ? "All Statuses" : config?.label}
                </Button>
              );
            })}
          </div>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={4}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-md bg-orange-500/10 flex items-center justify-center">
              <Coins className="w-4 h-4 text-orange-500" />
            </div>
            <h2 className="font-display font-semibold text-lg" data-testid="text-proposals-heading">Proposals</h2>
            <Badge variant="outline" className="ml-auto text-[10px] border-border/50 text-muted-foreground">
              {filteredProposals.length} result{filteredProposals.length !== 1 ? "s" : ""}
            </Badge>
          </div>

          {filteredProposals.length === 0 ? (
            <Card className="border-border/50 bg-card/50 dark:bg-white/[0.02] p-8 text-center">
              <p className="text-sm text-muted-foreground">No proposals match the selected filters.</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredProposals.map((proposal) => {
                const catConfig = categoryConfig[proposal.category];
                const statConfig = statusConfig[proposal.status];
                const CatIcon = catConfig.icon;
                const StatIcon = statConfig.icon;
                const date = new Date(proposal.timestamp);
                const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
                const timeStr = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

                return (
                  <Card
                    key={proposal.id}
                    className="border-border/50 bg-card/50 dark:bg-white/[0.02] p-5"
                    data-testid={`proposal-card-${proposal.id}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-9 h-9 rounded-md ${catConfig.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                        <CatIcon className={`w-4 h-4 ${catConfig.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center flex-wrap gap-2 mb-2">
                          <span className="font-mono text-[10px] text-muted-foreground">{proposal.id}</span>
                          <Badge variant="outline" className={`text-[10px] ${statConfig.border} ${statConfig.color}`}>
                            <StatIcon className="w-3 h-3 mr-1" />
                            {statConfig.label}
                          </Badge>
                          <Badge variant="outline" className={`text-[10px] ${catConfig.color} border-current/30`}>
                            {catConfig.label}
                          </Badge>
                          <span className="font-mono text-[10px] text-white/30 ml-auto flex-shrink-0">
                            {dateStr} {timeStr}
                          </span>
                        </div>

                        <h3 className="text-sm font-semibold mb-3" data-testid={`proposal-title-${proposal.id}`}>
                          {proposal.title}
                        </h3>

                        <div className="space-y-3">
                          <div className="p-3 rounded-md bg-black/30 border border-border/20">
                            <div className="flex items-center gap-2 mb-1.5">
                              <Target className="w-3 h-3 text-orange-500" />
                              <span className="font-mono text-[10px] text-orange-400 uppercase tracking-wider">Decision</span>
                            </div>
                            <p className="text-xs text-white/70 leading-relaxed">{proposal.decision}</p>
                          </div>

                          <div className="p-3 rounded-md bg-black/30 border border-border/20">
                            <div className="flex items-center gap-2 mb-1.5">
                              <Brain className="w-3 h-3 text-purple-400" />
                              <span className="font-mono text-[10px] text-purple-400 uppercase tracking-wider">Reasoning</span>
                            </div>
                            <p className="text-xs text-white/70 leading-relaxed">{proposal.reasoning}</p>
                          </div>

                          {proposal.outcome && (
                            <div className="p-3 rounded-md bg-green-500/5 border border-green-500/20">
                              <div className="flex items-center gap-2 mb-1.5">
                                <CheckCircle2 className="w-3 h-3 text-green-400" />
                                <span className="font-mono text-[10px] text-green-400 uppercase tracking-wider">Outcome</span>
                              </div>
                              <p className="text-xs text-white/70 leading-relaxed">{proposal.outcome}</p>
                            </div>
                          )}

                          <div className="flex items-center flex-wrap gap-3">
                            {proposal.impact && (
                              <div className="flex items-center gap-1.5">
                                <ArrowUpRight className="w-3 h-3 text-orange-500" />
                                <span className="font-mono text-[10px] text-orange-400">{proposal.impact}</span>
                              </div>
                            )}
                            {proposal.txHash && (
                              <a
                                href={`https://basescan.org/tx/${proposal.txHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[10px] text-orange-500 font-mono"
                                data-testid={`link-tx-${proposal.id}`}
                              >
                                <Lock className="w-2.5 h-2.5" />
                                TX: {proposal.txHash.slice(0, 10)}...{proposal.txHash.slice(-6)}
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={5} className="mt-16">
          <Card className="border-border/50 bg-card/50 dark:bg-white/[0.02] p-6 text-center">
            <div className="w-10 h-10 rounded-md bg-orange-500/10 flex items-center justify-center mx-auto mb-3">
              <Shield className="w-5 h-5 text-orange-500" />
            </div>
            <h3 className="font-display font-semibold text-base mb-2" data-testid="text-governance-note">Governance by AI Treasury Manager</h3>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-xl mx-auto">
              All governance decisions are made autonomously by the AI Treasury Manager. This agent operates under strict risk parameters, publishes full reasoning for every action, and cannot be influenced by external parties. Every transaction is recorded on-chain and verifiable on Basescan. As the protocol matures, governance may evolve to include community input mechanisms while maintaining the AI agent as the primary executor.
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}