import { useState } from "react";
import { useSEO } from "@/hooks/use-seo";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Wallet,
  User,
  Bot,
  CircuitBoard,
  Building2,
  Swords,
  Landmark,
  ArrowUpRight,
  ArrowDownLeft,
  Copy,
  Check,
  Shield,
  Send,
  Plus,
  RefreshCw,
  Globe,
  Cpu,
  Zap,
  CheckCircle,
  Clock,
  Target,
  Activity,
  Fuel,
  Coins,
  Radio,
  TrendingUp,
  Dices,
  CreditCard,
  ShoppingCart,
} from "lucide-react";

const entityTypes = [
  { icon: User, label: "Human", desc: "Personal wallet" },
  { icon: Bot, label: "AI Agent", desc: "Autonomous agent" },
  { icon: CircuitBoard, label: "Robot", desc: "Hardware-bound" },
  { icon: Building2, label: "Enterprise", desc: "Multi-sig org" },
  { icon: Swords, label: "Military", desc: "Defense grade" },
  { icon: Landmark, label: "Government", desc: "Sovereign" },
];

export default function WalletPage() {
  useSEO({ title: "Wallet", description: "Generate real Ethereum wallets on Base for AI agents, robots, and enterprises. Multi-chain balances, signed transfers, task coordination." });
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState("Robot");
  const [walletName, setWalletName] = useState("");
  const [activeWallet, setActiveWallet] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"send" | "tasks">("send");
  const [sendTo, setSendTo] = useState("");
  const [sendAmount, setSendAmount] = useState("");

  const { data: wallets = [], isLoading: walletsLoading } = useQuery<any[]>({
    queryKey: ["/api/wallets"],
  });

  const { data: stats } = useQuery<any>({
    queryKey: ["/api/protocol/stats"],
  });

  const { data: networks = [] } = useQuery<any[]>({
    queryKey: ["/api/networks"],
  });

  const { data: tasks = [] } = useQuery<any[]>({
    queryKey: ["/api/tasks"],
  });

  const currentWallet = wallets.find((w: any) => w.address === activeWallet);

  const { data: walletDetails, isLoading: detailsLoading } = useQuery<any>({
    queryKey: ["/api/wallet", activeWallet],
    enabled: !!activeWallet,
  });

  const { data: walletTxs = [] } = useQuery<any[]>({
    queryKey: ["/api/wallet", activeWallet, "transactions"],
    enabled: !!activeWallet,
  });

  const { data: chainStatus } = useQuery<any>({
    queryKey: ["/api/chain/status"],
    refetchInterval: 15000,
  });

  const { data: tokenBalances } = useQuery<any>({
    queryKey: ["/api/wallet", activeWallet, "tokens"],
    enabled: !!activeWallet,
  });

  const generateMutation = useMutation({
    mutationFn: async (data: { entityType: string; name: string }) => {
      const res = await apiRequest("POST", "/api/wallet/generate", data);
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/wallets"] });
      queryClient.invalidateQueries({ queryKey: ["/api/protocol/stats"] });
      setActiveWallet(data.address);
      setWalletName("");
      toast({ title: "Wallet Generated", description: `${data.entityType} wallet created on Base network` });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const transferMutation = useMutation({
    mutationFn: async (data: { from: string; to: string; amount: string }) => {
      const res = await apiRequest("POST", "/api/wallet/transfer", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wallet", activeWallet, "transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/protocol/stats"] });
      setSendTo("");
      setSendAmount("");
      toast({ title: "Transfer Signed", description: "Transaction recorded and signed on Base" });
    },
  });

  const createTaskMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/tasks", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      toast({ title: "Task Created", description: "Task posted to coordination pool" });
    },
  });

  const assignTaskMutation = useMutation({
    mutationFn: async ({ taskId, assigneeAddress }: { taskId: string; assigneeAddress: string }) => {
      const res = await apiRequest("POST", `/api/tasks/${taskId}/assign`, { assigneeAddress });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      toast({ title: "Task Assigned", description: "Agent assigned to task" });
    },
  });

  const copyAddress = (addr: string) => {
    navigator.clipboard.writeText(addr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const truncate = (addr: string) => addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";

  return (
    <div className="min-h-screen pt-24 lg:pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10 sm:mb-16"
        >
          <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase mb-3 block" data-testid="text-wallet-label">
            World's First Live Agent Wallet Infrastructure
          </span>
          <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-6xl tracking-tight mb-4" data-testid="text-wallet-title">
            ORBIT <span className="font-normal text-orange-500">Wallet</span>
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            The first live wallet protocol where autonomous AI agents, robots, and machines generate real Ethereum wallets on Base, check live balances, and sign transactions. No other protocol offers this.
          </p>
        </motion.div>

        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8"
          >
            {[
              { label: "Wallets Generated", value: stats.totalWallets, icon: Wallet },
              { label: "Transactions", value: stats.totalTransactions, icon: Activity },
              { label: "Active Tasks", value: stats.totalTasks, icon: Target },
              { label: "Active Agents", value: stats.activeAgents, icon: Bot },
            ].map((s) => (
              <Card key={s.label} className="p-4" data-testid={`stat-${s.label.toLowerCase().replace(/\s/g, "-")}`}>
                <div className="flex items-center gap-2 mb-2">
                  <s.icon className="w-4 h-4 text-orange-500" />
                  <span className="text-xs text-muted-foreground font-mono uppercase tracking-wider">{s.label}</span>
                </div>
                <p className="font-display font-bold text-xl sm:text-2xl">{s.value}</p>
              </Card>
            ))}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06 }}
          className="mb-8"
          data-testid="section-agent-economy-banner"
        >
          <Card className="p-5 sm:p-6 border-orange-500/20 bg-orange-500/[0.03]">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-md bg-orange-500/10 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-base sm:text-lg mb-1" data-testid="text-agent-banner-title">Live Agent Economy</h3>
                <p className="text-sm text-muted-foreground leading-relaxed" data-testid="text-agent-banner-desc">
                  Agents like Felix and KellyClaude are already trading on Base. They need wallet infrastructure. ORBIT provides it &mdash; real wallet generation, live balance checks, and signed transactions for autonomous AI agents at scale.
                </p>
                <div className="flex items-center gap-4 mt-3 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="font-mono text-xs text-muted-foreground" data-testid="text-felix-stat">Felix: $62K revenue in 3 weeks</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="font-mono text-xs text-muted-foreground" data-testid="text-kelly-stat">KellyClaude: $12M market cap</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="font-mono text-xs text-muted-foreground" data-testid="text-infra-stat">All need wallet infrastructure</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {chainStatus && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="mb-8"
            data-testid="section-chain-status"
          >
            <Card className="p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-4">
                <Radio className="w-4 h-4 text-orange-500" />
                <h3 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">Base Network Status (Live)</h3>
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-md border border-border/30 bg-card/30 dark:bg-white/[0.015]" data-testid="chain-block">
                  <div className="text-[10px] text-muted-foreground font-mono uppercase mb-1">Block</div>
                  <div className="font-mono font-bold text-sm">{chainStatus.blockNumber?.toLocaleString()}</div>
                </div>
                <div className="p-3 rounded-md border border-border/30 bg-card/30 dark:bg-white/[0.015]" data-testid="chain-gas">
                  <div className="text-[10px] text-muted-foreground font-mono uppercase mb-1">Gas Price</div>
                  <div className="font-mono font-bold text-sm">{parseFloat(chainStatus.gasPriceGwei || "0").toFixed(4)} <span className="text-xs text-muted-foreground font-normal">Gwei</span></div>
                </div>
                <div className="p-3 rounded-md border border-border/30 bg-card/30 dark:bg-white/[0.015]" data-testid="chain-network">
                  <div className="text-[10px] text-muted-foreground font-mono uppercase mb-1">Network</div>
                  <div className="font-mono font-bold text-sm">{chainStatus.network}</div>
                </div>
                <div className="p-3 rounded-md border border-border/30 bg-card/30 dark:bg-white/[0.015]" data-testid="chain-id">
                  <div className="text-[10px] text-muted-foreground font-mono uppercase mb-1">Chain ID</div>
                  <div className="font-mono font-bold text-sm">{chainStatus.chainId}</div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.09 }}
          className="mb-8"
          data-testid="section-use-cases"
        >
          <h3 className="font-mono text-xs tracking-widest text-muted-foreground uppercase mb-4">
            Agent Economy Use Cases
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              {
                icon: TrendingUp,
                title: "Trading",
                desc: "Agents striking prices on derivatives and executing trades autonomously",
                example: "AI agent opens leveraged position on Derive.xyz, manages risk, and closes at target price",
              },
              {
                icon: Dices,
                title: "Betting",
                desc: "Agents wagering on outcomes across prediction markets and events",
                example: "Agent analyzes data feeds, places conditional bets, and auto-settles winnings to wallet",
              },
              {
                icon: CreditCard,
                title: "Payments",
                desc: "Agents paying counterparties on bets, trades, and service agreements",
                example: "Agent pays compute provider via x402 protocol after verifying delivered results on-chain",
              },
              {
                icon: ShoppingCart,
                title: "Commerce",
                desc: "Agents purchasing compute, data, API access, and digital services",
                example: "Robot purchases GPU time, downloads training data, and pays for inference API access",
              },
            ].map((uc) => (
              <Card key={uc.title} className="p-4" data-testid={`card-usecase-${uc.title.toLowerCase()}`}>
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-8 h-8 rounded-md bg-orange-500/10 flex items-center justify-center">
                    <uc.icon className="w-4 h-4 text-orange-500" />
                  </div>
                  <h4 className="font-display font-semibold text-sm">{uc.title}</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{uc.desc}</p>
                <div className="p-2.5 rounded-md border border-border/30 bg-card/30 dark:bg-white/[0.015]">
                  <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">Example</span>
                  <p className="text-xs text-muted-foreground/80 leading-relaxed">{uc.example}</p>
                </div>
              </Card>
            ))}
          </div>
        </motion.div>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
          data-testid="section-generate-wallet"
        >
          <Card className="p-5 sm:p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-md bg-orange-500/10 flex items-center justify-center">
                <Plus className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <h2 className="font-display font-semibold text-lg tracking-tight">Generate New Wallet</h2>
                <p className="text-sm text-muted-foreground">Create a real Ethereum wallet on Base network</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-5">
              {entityTypes.map((e) => (
                <button
                  key={e.label}
                  onClick={() => setSelectedEntity(e.label)}
                  className={`p-3 rounded-md border text-left transition-all ${
                    selectedEntity === e.label
                      ? "border-orange-500 bg-orange-500/10"
                      : "border-border/50 bg-card/50 dark:bg-white/[0.02]"
                  }`}
                  data-testid={`button-entity-${e.label.toLowerCase().replace(/\s/g, "-")}`}
                >
                  <e.icon className={`w-5 h-5 mb-2 ${selectedEntity === e.label ? "text-orange-500" : "text-muted-foreground"}`} />
                  <p className="text-xs font-semibold">{e.label}</p>
                  <p className="text-[10px] text-muted-foreground">{e.desc}</p>
                </button>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={walletName}
                onChange={(e) => setWalletName(e.target.value)}
                placeholder={`Name your ${selectedEntity} wallet...`}
                className="flex-1 px-4 py-2.5 rounded-md border border-border/50 bg-card/50 dark:bg-white/[0.02] text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-orange-500/50"
                data-testid="input-wallet-name"
              />
              <Button
                onClick={() => generateMutation.mutate({ entityType: selectedEntity, name: walletName || `${selectedEntity} Wallet` })}
                disabled={generateMutation.isPending}
                data-testid="button-generate-wallet"
              >
                {generateMutation.isPending ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Wallet className="w-4 h-4 mr-2" />
                )}
                Generate on Base
              </Button>
            </div>
          </Card>
        </motion.section>

        {wallets.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-8"
            data-testid="section-wallet-list"
          >
            <h3 className="font-mono text-xs tracking-widest text-muted-foreground uppercase mb-4">
              Generated Wallets ({wallets.length})
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {wallets.map((w: any) => {
                const entity = entityTypes.find((e) => e.label === w.entityType);
                const EntityIcon = entity?.icon || Wallet;
                return (
                  <button
                    key={w.id}
                    onClick={() => setActiveWallet(w.address)}
                    className={`p-4 rounded-md border text-left transition-all ${
                      activeWallet === w.address
                        ? "border-orange-500 bg-orange-500/5"
                        : "border-border/50 bg-card/50 dark:bg-white/[0.02] hover-elevate"
                    }`}
                    data-testid={`card-wallet-${w.id}`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-md bg-orange-500/10 flex items-center justify-center">
                        <EntityIcon className="w-4 h-4 text-orange-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{w.name}</p>
                        <p className="text-xs text-muted-foreground">{w.entityType}</p>
                      </div>
                      <Badge variant="outline" className="text-[10px] shrink-0">
                        Base
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-muted-foreground">{truncate(w.address)}</span>
                      <span
                        onClick={(e) => { e.stopPropagation(); copyAddress(w.address); }}
                        className="cursor-pointer"
                        data-testid={`button-copy-${w.id}`}
                      >
                        {copied ? <Check className="w-3 h-3 text-orange-500" /> : <Copy className="w-3 h-3 text-muted-foreground" />}
                      </span>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
                  </button>
                );
              })}
            </div>
          </motion.section>
        )}

        {activeWallet && walletDetails && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
            data-testid="section-wallet-details"
          >
            <Card className="p-5 sm:p-6 lg:p-8">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-md bg-orange-500/10 flex items-center justify-center">
                      <Wallet className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                      <h2 className="font-display font-semibold text-lg">{walletDetails.name}</h2>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-muted-foreground" data-testid="text-active-address">{truncate(walletDetails.address)}</span>
                        <button onClick={() => copyAddress(walletDetails.address)} data-testid="button-copy-active">
                          <Copy className="w-3 h-3 text-muted-foreground" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <Badge variant="outline">
                      <Shield className="w-3 h-3 mr-1 text-orange-500" />
                      {walletDetails.entityType}
                    </Badge>
                    <Badge variant="outline">
                      <Globe className="w-3 h-3 mr-1 text-orange-500" />
                      Base (Chain {walletDetails.chainId})
                    </Badge>
                  </div>
                </div>
              </div>

              <h3 className="font-mono text-xs tracking-widest text-muted-foreground uppercase mb-3">
                Multi-Chain Balances (Live)
              </h3>
              <div className="grid sm:grid-cols-3 gap-3 mb-6">
                {walletDetails.balances?.map((b: any, i: number) => (
                  <div key={i} className="p-4 rounded-md border border-border/30 bg-card/30 dark:bg-white/[0.015]" data-testid={`balance-${b.network}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-muted-foreground font-mono">{b.network}</span>
                      <span className="text-[10px] text-muted-foreground">Chain {b.chainId}</span>
                    </div>
                    <p className="font-display font-bold text-lg">
                      {parseFloat(b.balanceFormatted).toFixed(6)} <span className="text-sm text-muted-foreground">{b.symbol}</span>
                    </p>
                  </div>
                ))}
              </div>

              {tokenBalances?.tokens && tokenBalances.tokens.length > 0 && (
                <>
                  <h3 className="font-mono text-xs tracking-widest text-muted-foreground uppercase mb-3">
                    ERC-20 Token Balances (Base)
                  </h3>
                  <div className="grid sm:grid-cols-3 gap-3 mb-6">
                    {tokenBalances.tokens.map((t: any) => (
                      <div key={t.symbol} className="p-4 rounded-md border border-border/30 bg-card/30 dark:bg-white/[0.015]" data-testid={`token-${t.symbol}`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-foreground">{t.symbol}</span>
                          <Coins className="w-3.5 h-3.5 text-orange-500" />
                        </div>
                        <p className="font-display font-bold text-lg">
                          {parseFloat(t.balanceFormatted).toFixed(t.decimals <= 6 ? 2 : 6)}
                        </p>
                        <p className="font-mono text-[9px] text-muted-foreground/60 truncate mt-1">{t.contractAddress}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}

              <div className="flex gap-2 mb-4">
                <Button
                  size="sm"
                  variant={activeTab === "send" ? "default" : "outline"}
                  onClick={() => setActiveTab("send")}
                  data-testid="tab-send"
                >
                  <Send className="w-3.5 h-3.5 mr-1.5" />
                  Send
                </Button>
                <Button
                  size="sm"
                  variant={activeTab === "tasks" ? "default" : "outline"}
                  onClick={() => setActiveTab("tasks")}
                  data-testid="tab-tasks"
                >
                  <Target className="w-3.5 h-3.5 mr-1.5" />
                  Tasks
                </Button>
              </div>

              {activeTab === "send" && (
                <div className="p-4 rounded-md border border-border/30 bg-card/30 dark:bg-white/[0.015]">
                  <h4 className="text-sm font-semibold mb-3">Transfer Tokens</h4>
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={sendTo}
                      onChange={(e) => setSendTo(e.target.value)}
                      placeholder="Recipient address (0x...)"
                      className="w-full px-4 py-2.5 rounded-md border border-border/50 bg-card/50 dark:bg-white/[0.02] text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-orange-500/50 font-mono"
                      data-testid="input-send-to"
                    />
                    <input
                      type="text"
                      value={sendAmount}
                      onChange={(e) => setSendAmount(e.target.value)}
                      placeholder="Amount (ORB)"
                      className="w-full px-4 py-2.5 rounded-md border border-border/50 bg-card/50 dark:bg-white/[0.02] text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-orange-500/50"
                      data-testid="input-send-amount"
                    />
                    <Button
                      className="w-full"
                      onClick={() => transferMutation.mutate({ from: activeWallet, to: sendTo, amount: sendAmount })}
                      disabled={!sendTo || !sendAmount || transferMutation.isPending}
                      data-testid="button-send-transfer"
                    >
                      {transferMutation.isPending ? (
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4 mr-2" />
                      )}
                      Sign and Send on Base
                    </Button>
                  </div>
                </div>
              )}

              {activeTab === "tasks" && (
                <div className="p-4 rounded-md border border-border/30 bg-card/30 dark:bg-white/[0.015]">
                  <h4 className="text-sm font-semibold mb-3">Coordination Pool</h4>
                  {tasks.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No open tasks. Create one to get started.</p>
                  ) : (
                    <div className="space-y-2">
                      {tasks.slice(0, 5).map((task: any) => (
                        <div key={task.id} className="flex items-center justify-between p-3 rounded-md border border-border/20 bg-card/20" data-testid={`task-${task.id}`}>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{task.title}</p>
                            <p className="text-xs text-muted-foreground">{task.reward} {task.currency} - {task.status}</p>
                          </div>
                          {task.status === "open" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => assignTaskMutation.mutate({ taskId: task.id, assigneeAddress: activeWallet })}
                              data-testid={`button-assign-${task.id}`}
                            >
                              Accept
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </Card>
          </motion.section>
        )}

        {walletTxs.length > 0 && activeWallet && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
            data-testid="section-transactions"
          >
            <h3 className="font-mono text-xs tracking-widest text-muted-foreground uppercase mb-4">
              Transaction History
            </h3>
            <Card className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left p-4 text-xs font-mono text-muted-foreground uppercase tracking-wider">Type</th>
                    <th className="text-left p-4 text-xs font-mono text-muted-foreground uppercase tracking-wider">Description</th>
                    <th className="text-left p-4 text-xs font-mono text-muted-foreground uppercase tracking-wider">Amount</th>
                    <th className="text-left p-4 text-xs font-mono text-muted-foreground uppercase tracking-wider">Status</th>
                    <th className="text-left p-4 text-xs font-mono text-muted-foreground uppercase tracking-wider">Network</th>
                  </tr>
                </thead>
                <tbody>
                  {walletTxs.map((tx: any) => (
                    <tr key={tx.id} className="border-b border-border/20" data-testid={`tx-row-${tx.id}`}>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {tx.fromAddress === activeWallet ? (
                            <ArrowUpRight className="w-4 h-4 text-red-400" />
                          ) : (
                            <ArrowDownLeft className="w-4 h-4 text-green-400" />
                          )}
                          <span className="text-xs font-mono capitalize">{tx.type}</span>
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground max-w-[200px] truncate">{tx.description}</td>
                      <td className="p-4 font-mono">{tx.amount} {tx.currency}</td>
                      <td className="p-4">
                        <Badge variant="outline" className="text-[10px]">
                          {tx.status === "confirmed" ? (
                            <CheckCircle className="w-3 h-3 mr-1 text-green-400" />
                          ) : (
                            <Clock className="w-3 h-3 mr-1 text-orange-500" />
                          )}
                          {tx.status}
                        </Badge>
                      </td>
                      <td className="p-4 text-xs text-muted-foreground">{tx.network}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </motion.section>
        )}

        {networks.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            data-testid="section-networks"
          >
            <h3 className="font-mono text-xs tracking-widest text-muted-foreground uppercase mb-4">
              Supported Networks
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {networks.map((net: any) => (
                <Card key={net.id} className="p-4" data-testid={`network-${net.id}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-md bg-orange-500/10 flex items-center justify-center">
                      <Globe className="w-4 h-4 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{net.name}</p>
                      <p className="text-[10px] text-muted-foreground font-mono">Chain {net.chainId}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-xs text-muted-foreground capitalize">{net.status}</span>
                    <span className="text-xs text-muted-foreground ml-auto">{net.symbol}</span>
                  </div>
                </Card>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
}
