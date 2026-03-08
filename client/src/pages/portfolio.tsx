import { useState } from "react";
import { useSEO } from "@/hooks/use-seo";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Coins,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  Layers,
  BarChart3,
  Lock,
  Percent,
  ArrowRightLeft,
  Shield,
  Activity,
  ExternalLink,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const portfolioChartData = [
  { date: "Jan", value: 8200 },
  { date: "Feb", value: 9400 },
  { date: "Mar", value: 8700 },
  { date: "Apr", value: 11200 },
  { date: "May", value: 13500 },
  { date: "Jun", value: 12800 },
  { date: "Jul", value: 15600 },
  { date: "Aug", value: 14200 },
  { date: "Sep", value: 16800 },
  { date: "Oct", value: 19400 },
  { date: "Nov", value: 21200 },
  { date: "Dec", value: 24680 },
];

const holdings = [
  { token: "$ORB", name: "ORBIT Protocol", amount: "48,275.00", value: "$12,068.75", change: 5.4, category: "Protocol Native" },
  { token: "$ETH", name: "Ethereum", amount: "2.847", value: "$7,402.20", change: 2.1, category: "Core Reserve" },
  { token: "$FELIX", name: "Felix AI Agent", amount: "125,000", value: "$2,187.50", change: -3.2, category: "AI Agent" },
  { token: "$KELLYCLAUDE", name: "KellyClaude AI", amount: "85,000", value: "$1,445.00", change: 8.7, category: "AI Agent" },
  { token: "$BANKR", name: "Bankr", amount: "50,000", value: "$875.00", change: -1.4, category: "Infrastructure" },
  { token: "ORB-USD", name: "ORB Stablecoin", amount: "1,200.00", value: "$1,200.00", change: 0.0, category: "Stablecoin" },
];

const vaultPositions = [
  { token: "$ORB", pool: "ORB/ETH LP", deposited: "10,000 ORB", value: "$2,500.00", apy: "24.5%", protocol: "Aerodrome" },
  { token: "$ETH", pool: "ETH/USDC LP", deposited: "0.5 ETH", value: "$1,300.00", apy: "12.8%", protocol: "Uniswap v3" },
  { token: "$ORB", pool: "ORB Single Stake", deposited: "25,000 ORB", value: "$6,250.00", apy: "18.2%", protocol: "ORBIT Vault" },
];

const stakingData = {
  totalStaked: "25,000 ORB",
  stakedValue: "$6,250.00",
  rewardsEarned: "1,247.50 ORB",
  rewardsValue: "$311.88",
  currentApy: "18.2%",
  lockPeriod: "90 days",
  nextReward: "2h 14m",
  totalDistributed: "2,450,000 ORB",
};

const transactions = [
  { type: "send", token: "$ORB", amount: "500.00", to: "0x7a3b...f291", time: "2 hours ago", status: "confirmed", hash: "0xabc123...def456" },
  { type: "receive", token: "$ETH", amount: "0.25", from: "0x9c4d...a182", time: "5 hours ago", status: "confirmed", hash: "0x789abc...123def" },
  { type: "stake", token: "$ORB", amount: "5,000.00", to: "ORBIT Vault", time: "1 day ago", status: "confirmed", hash: "0xdef789...abc123" },
  { type: "bridge", token: "$ETH", amount: "0.1", to: "Polygon", time: "2 days ago", status: "confirmed", hash: "0x456789...abcdef" },
  { type: "send", token: "$ORB", amount: "1,200.00", to: "0x3f8e...c547", time: "3 days ago", status: "confirmed", hash: "0xfed321...cba654" },
  { type: "receive", token: "$FELIX", amount: "25,000", from: "0x1a2b...3c4d", time: "5 days ago", status: "confirmed", hash: "0x111222...333444" },
  { type: "bridge", token: "$ORB", amount: "2,000.00", to: "Ethereum", time: "1 week ago", status: "confirmed", hash: "0x555666...777888" },
];

const bridgeHistory = [
  { from: "Base", to: "Ethereum", token: "$ORB", amount: "2,000.00", time: "1 week ago", status: "completed", fee: "0.15%" },
  { from: "Base", to: "Polygon", token: "$ETH", amount: "0.1", time: "2 days ago", status: "completed", fee: "0.15%" },
  { from: "Ethereum", to: "Base", token: "$ETH", amount: "1.0", time: "2 weeks ago", status: "completed", fee: "0.15%" },
  { from: "Polygon", to: "Base", token: "$ORB", amount: "5,000.00", time: "3 weeks ago", status: "completed", fee: "0.15%" },
];

type TabKey = "holdings" | "transactions" | "staking" | "bridge";

export default function PortfolioPage() {
  useSEO({
    title: "Portfolio",
    description: "Track your ORBIT Protocol portfolio. View $ORB balance, vault positions, staking rewards, bridge history, and transaction activity.",
  });

  const [connected, setConnected] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>("holdings");

  const connectWallet = async () => {
    if (typeof window !== "undefined" && (window as any).ethereum) {
      try {
        const accounts = await (window as any).ethereum.request({ method: "eth_requestAccounts" });
        if (accounts && accounts.length > 0) {
          setConnected(true);
        }
      } catch {
        setConnected(true);
      }
    } else {
      setConnected(true);
    }
  };

  const totalValue = "$24,679.45";
  const change24h = "+$1,247.32";
  const changePct = "+5.3%";

  const tabs: { key: TabKey; label: string; icon: any }[] = [
    { key: "holdings", label: "Holdings", icon: Coins },
    { key: "transactions", label: "Transactions", icon: Activity },
    { key: "staking", label: "Staking", icon: Lock },
    { key: "bridge", label: "Bridge History", icon: ArrowRightLeft },
  ];

  if (!connected) {
    return (
      <div className="min-h-screen pt-24 lg:pt-32 pb-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0}
            className="text-center mb-12"
          >
            <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase mb-3 block" data-testid="text-portfolio-label">
              Personal Portfolio Tracker
            </span>
            <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight mb-4" data-testid="text-portfolio-title">
              ORBIT <span className="font-normal text-orange-500">Portfolio</span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Connect your wallet to view your $ORB balance, vault positions, staking rewards, and complete transaction history.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
          >
            <Card className="p-8 sm:p-12 text-center">
              <div className="w-16 h-16 rounded-md bg-orange-500/10 flex items-center justify-center mx-auto mb-6">
                <Wallet className="w-8 h-8 text-orange-500" />
              </div>
              <h2 className="font-display font-semibold text-xl mb-2" data-testid="text-connect-heading">
                Connect Your Wallet
              </h2>
              <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto leading-relaxed">
                Connect your Ethereum wallet to access your ORBIT portfolio dashboard. View balances, track positions, and monitor staking rewards across all supported networks.
              </p>
              <Button onClick={connectWallet} data-testid="button-connect-portfolio">
                <Wallet className="w-4 h-4 mr-2" />
                Connect Wallet
              </Button>
              <div className="flex items-center justify-center gap-4 mt-6 flex-wrap">
                {["Base", "Ethereum", "Polygon"].map((network) => (
                  <div key={network} className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span className="font-mono text-xs text-muted-foreground">{network}</span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 lg:pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={0}
          className="text-center mb-10 sm:mb-16"
        >
          <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase mb-3 block" data-testid="text-portfolio-label">
            Personal Portfolio Tracker
          </span>
          <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-6xl tracking-tight mb-4" data-testid="text-portfolio-title">
            ORBIT <span className="font-normal text-orange-500">Portfolio</span>
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Track your complete ORBIT Protocol portfolio across all supported networks.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={1}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8"
        >
          {[
            { label: "Total Value", value: totalValue, icon: Wallet },
            { label: "24h Change", value: change24h, icon: TrendingUp, sub: changePct },
            { label: "Staked ORB", value: stakingData.totalStaked, icon: Lock },
            { label: "Rewards Earned", value: stakingData.rewardsEarned, icon: Percent },
          ].map((s) => (
            <Card key={s.label} className="p-4" data-testid={`stat-${s.label.toLowerCase().replace(/\s/g, "-")}`}>
              <div className="flex items-center gap-2 mb-2">
                <s.icon className="w-4 h-4 text-orange-500" />
                <span className="text-xs text-muted-foreground font-mono uppercase tracking-wider">{s.label}</span>
              </div>
              <p className="font-display font-bold text-xl sm:text-2xl">{s.value}</p>
              {s.sub && (
                <span className="font-mono text-xs text-green-400">{s.sub}</span>
              )}
            </Card>
          ))}
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={2}
          className="mb-8"
        >
          <Card className="p-5 sm:p-6" data-testid="section-portfolio-chart">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-md bg-orange-500/10 flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-orange-500" />
              </div>
              <div>
                <h2 className="font-display font-semibold text-lg" data-testid="text-chart-heading">Portfolio Value</h2>
                <p className="font-mono text-xs text-muted-foreground">12-month performance</p>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <span className="font-display font-bold text-xl sm:text-2xl">{totalValue}</span>
                <Badge variant="outline" className="text-green-400 border-green-500/30 text-[10px]">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {changePct}
                </Badge>
              </div>
            </div>
            <div className="w-full h-[280px]" data-testid="chart-portfolio-value">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={portfolioChartData}>
                  <defs>
                    <linearGradient id="portfolioGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#71717a", fontSize: 11, fontFamily: "monospace" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#71717a", fontSize: 11, fontFamily: "monospace" }}
                    tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0a0a0a",
                      border: "1px solid rgba(249, 115, 22, 0.3)",
                      borderRadius: "6px",
                      fontSize: "12px",
                      color: "#fff",
                    }}
                    formatter={(value: number) => [`$${value.toLocaleString()}`, "Value"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#f97316"
                    strokeWidth={2}
                    fill="url(#portfolioGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={2.5}
          className="mb-8"
        >
          <Card className="p-5 sm:p-6" data-testid="section-vault-positions">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-md bg-orange-500/10 flex items-center justify-center">
                <Layers className="w-4 h-4 text-orange-500" />
              </div>
              <h2 className="font-display font-semibold text-lg" data-testid="text-vault-heading">Vault Positions</h2>
            </div>
            <div className="space-y-3">
              {vaultPositions.map((pos, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-md border border-border/30 bg-card/30 dark:bg-white/[0.015]" data-testid={`vault-position-${i}`}>
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-8 h-8 rounded-md bg-orange-500/10 flex items-center justify-center shrink-0">
                      <Coins className="w-4 h-4 text-orange-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">{pos.pool}</p>
                      <p className="text-xs text-muted-foreground">{pos.protocol}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
                    <div>
                      <p className="text-[10px] text-muted-foreground font-mono uppercase">Deposited</p>
                      <p className="text-sm font-mono">{pos.deposited}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground font-mono uppercase">Value</p>
                      <p className="text-sm font-mono">{pos.value}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground font-mono uppercase">APY</p>
                      <p className="text-sm font-mono text-green-400">{pos.apy}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={3}
        >
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === tab.key
                    ? "bg-orange-500/10 text-orange-500 border border-orange-500/30"
                    : "text-muted-foreground border border-border/30 bg-card/30 dark:bg-white/[0.015]"
                }`}
                data-testid={`tab-${tab.key}`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "holdings" && (
            <Card className="p-5 sm:p-6" data-testid="section-holdings">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-md bg-orange-500/10 flex items-center justify-center">
                  <Coins className="w-4 h-4 text-orange-500" />
                </div>
                <h2 className="font-display font-semibold text-lg" data-testid="text-holdings-heading">Token Holdings</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full" data-testid="table-holdings">
                  <thead>
                    <tr className="border-b border-border/30">
                      <th className="text-left py-3 px-2 text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Token</th>
                      <th className="text-left py-3 px-2 text-[10px] font-mono text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Category</th>
                      <th className="text-right py-3 px-2 text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Amount</th>
                      <th className="text-right py-3 px-2 text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Value</th>
                      <th className="text-right py-3 px-2 text-[10px] font-mono text-muted-foreground uppercase tracking-wider">24h</th>
                    </tr>
                  </thead>
                  <tbody>
                    {holdings.map((h, i) => (
                      <tr key={i} className="border-b border-border/10" data-testid={`row-holding-${i}`}>
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-md bg-orange-500/10 flex items-center justify-center shrink-0">
                              <Coins className="w-3.5 h-3.5 text-orange-500" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold">{h.token}</p>
                              <p className="text-xs text-muted-foreground">{h.name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-2 hidden sm:table-cell">
                          <Badge variant="outline" className="text-[10px]">{h.category}</Badge>
                        </td>
                        <td className="py-3 px-2 text-right">
                          <span className="font-mono text-sm">{h.amount}</span>
                        </td>
                        <td className="py-3 px-2 text-right">
                          <span className="font-mono text-sm">{h.value}</span>
                        </td>
                        <td className="py-3 px-2 text-right">
                          <span className={`font-mono text-sm inline-flex items-center gap-1 ${
                            h.change > 0 ? "text-green-400" : h.change < 0 ? "text-red-400" : "text-muted-foreground"
                          }`}>
                            {h.change > 0 ? (
                              <TrendingUp className="w-3 h-3" />
                            ) : h.change < 0 ? (
                              <TrendingDown className="w-3 h-3" />
                            ) : null}
                            {h.change > 0 ? "+" : ""}{h.change}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {activeTab === "transactions" && (
            <Card className="p-5 sm:p-6" data-testid="section-transactions">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-md bg-orange-500/10 flex items-center justify-center">
                  <Activity className="w-4 h-4 text-orange-500" />
                </div>
                <h2 className="font-display font-semibold text-lg" data-testid="text-transactions-heading">Transaction History</h2>
              </div>
              <div className="space-y-2">
                {transactions.map((tx, i) => {
                  const typeConfig: Record<string, { icon: any; color: string; bg: string; label: string }> = {
                    send: { icon: ArrowUpRight, color: "text-red-400", bg: "bg-red-500/10", label: "Sent" },
                    receive: { icon: ArrowDownLeft, color: "text-green-400", bg: "bg-green-500/10", label: "Received" },
                    stake: { icon: Lock, color: "text-orange-400", bg: "bg-orange-500/10", label: "Staked" },
                    bridge: { icon: ArrowRightLeft, color: "text-blue-400", bg: "bg-blue-500/10", label: "Bridged" },
                  };
                  const config = typeConfig[tx.type] || typeConfig.send;
                  const TxIcon = config.icon;
                  return (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-md border border-border/30 bg-card/30 dark:bg-white/[0.015]" data-testid={`tx-row-${i}`}>
                      <div className={`w-8 h-8 rounded-md ${config.bg} flex items-center justify-center shrink-0`}>
                        <TxIcon className={`w-4 h-4 ${config.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-sm font-semibold">{config.label}</span>
                          <span className="font-mono text-sm">{tx.amount} {tx.token}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-muted-foreground">
                            {tx.to ? `To: ${tx.to}` : `From: ${tx.from}`}
                          </span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <Badge variant="outline" className="text-[10px] border-green-500/30 text-green-400">
                            {tx.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{tx.time}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {activeTab === "staking" && (
            <Card className="p-5 sm:p-6" data-testid="section-staking">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-md bg-orange-500/10 flex items-center justify-center">
                  <Lock className="w-4 h-4 text-orange-500" />
                </div>
                <h2 className="font-display font-semibold text-lg" data-testid="text-staking-heading">Staking Rewards</h2>
                <Badge variant="outline" className="ml-auto text-[10px] border-green-500/30 text-green-400">
                  <Activity className="w-3 h-3 mr-1" /> Active
                </Badge>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {[
                  { label: "Total Staked", value: stakingData.totalStaked, sub: stakingData.stakedValue },
                  { label: "Current APY", value: stakingData.currentApy, color: "text-green-400" },
                  { label: "Rewards Earned", value: stakingData.rewardsEarned, sub: stakingData.rewardsValue },
                  { label: "Next Reward", value: stakingData.nextReward },
                ].map((item) => (
                  <div key={item.label} className="p-4 rounded-md border border-border/30 bg-card/30 dark:bg-white/[0.015]" data-testid={`staking-${item.label.toLowerCase().replace(/\s/g, "-")}`}>
                    <p className="text-[10px] text-muted-foreground font-mono uppercase mb-1">{item.label}</p>
                    <p className={`font-display font-bold text-lg ${item.color || ""}`}>{item.value}</p>
                    {item.sub && <p className="font-mono text-xs text-muted-foreground">{item.sub}</p>}
                  </div>
                ))}
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-md border border-border/30 bg-card/30 dark:bg-white/[0.015]">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-orange-500" />
                    <span className="text-sm font-semibold">Staking Details</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Lock Period</span>
                      <span className="font-mono text-xs">{stakingData.lockPeriod}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Current APY</span>
                      <span className="font-mono text-xs text-green-400">{stakingData.currentApy}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Total Distributed</span>
                      <span className="font-mono text-xs">{stakingData.totalDistributed}</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 rounded-md border border-orange-500/20 bg-orange-500/[0.03]">
                  <div className="flex items-center gap-2 mb-2">
                    <Percent className="w-4 h-4 text-orange-500" />
                    <span className="text-sm font-semibold">Revenue Sources</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Staking rewards are funded by protocol revenue: wallet generation fees, transaction fees, marketplace commissions, registry fees, and API access charges. The more the protocol earns, the higher the staking APY.
                  </p>
                </div>
              </div>
            </Card>
          )}

          {activeTab === "bridge" && (
            <Card className="p-5 sm:p-6" data-testid="section-bridge-history">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-md bg-orange-500/10 flex items-center justify-center">
                  <ArrowRightLeft className="w-4 h-4 text-orange-500" />
                </div>
                <h2 className="font-display font-semibold text-lg" data-testid="text-bridge-heading">Bridge History</h2>
              </div>
              <div className="space-y-2">
                {bridgeHistory.map((b, i) => (
                  <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-md border border-border/30 bg-card/30 dark:bg-white/[0.015]" data-testid={`bridge-row-${i}`}>
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-8 h-8 rounded-md bg-blue-500/10 flex items-center justify-center shrink-0">
                        <ArrowRightLeft className="w-4 h-4 text-blue-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold">{b.amount} {b.token}</p>
                        <p className="text-xs text-muted-foreground">{b.from} &rarr; {b.to}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 flex-wrap">
                      <div>
                        <p className="text-[10px] text-muted-foreground font-mono uppercase">Fee</p>
                        <p className="text-sm font-mono">{b.fee}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground font-mono uppercase">Time</p>
                        <p className="text-sm font-mono">{b.time}</p>
                      </div>
                      <Badge variant="outline" className="text-[10px] border-green-500/30 text-green-400">
                        {b.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}