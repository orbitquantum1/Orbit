import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSEO } from "@/hooks/use-seo";
import {
  Bot,
  CircuitBoard,
  Building2,
  User,
  Play,
  Pause,
  Settings,
  DollarSign,
  Activity,
  Shield,
  AlertTriangle,
  ChevronDown,
  Search,
  Layers,
  Zap,
  BarChart3,
  Eye,
  X,
} from "lucide-react";

interface RegistryAgent {
  id: number;
  entityType: string;
  name: string;
  walletAddress: string;
  description: string;
  capabilities: string[];
  trustScore: number;
  totalTransactions: number;
  uptime: number;
  verified: boolean;
  status: string;
  hourlyRate: number;
  manufacturer?: string;
  model?: string;
  operationalDomain?: string;
}

interface FleetAgent extends RegistryAgent {
  fleetStatus: "active" | "paused" | "deploying";
  dailyLimit: number;
  monthlyLimit: number;
  dailySpend: number;
  monthlySpend: number;
  tasksCompleted: number;
  lastActive: string;
  alertThreshold: number;
}

const entityIcons: Record<string, typeof Bot> = {
  "AI Agent": Bot,
  "Robot": CircuitBoard,
  "Enterprise": Building2,
  "Human": User,
};

function enrichWithFleetData(agents: RegistryAgent[]): FleetAgent[] {
  const statuses: Array<"active" | "paused" | "deploying"> = ["active", "active", "active", "paused", "deploying"];
  const times = ["2 min ago", "5 min ago", "12 min ago", "1 hr ago", "3 hrs ago", "6 hrs ago", "1 day ago"];

  return agents.map((agent, i) => ({
    ...agent,
    fleetStatus: statuses[i % statuses.length],
    dailyLimit: Math.floor(500 + Math.random() * 2000),
    monthlyLimit: Math.floor(10000 + Math.random() * 50000),
    dailySpend: Math.floor(Math.random() * 800),
    monthlySpend: Math.floor(Math.random() * 15000),
    tasksCompleted: Math.floor(Math.random() * 500),
    lastActive: times[i % times.length],
    alertThreshold: 80,
  }));
}

export default function Fleet() {
  useSEO({
    title: "Fleet Manager",
    description: "Enterprise fleet management console for managing agent fleets, spending controls, and batch operations on ORBIT Protocol.",
  });

  const { data: registryData, isLoading } = useQuery<RegistryAgent[]>({
    queryKey: ["/api/registry"],
  });

  const [filter, setFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAgent, setSelectedAgent] = useState<FleetAgent | null>(null);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [limitAgent, setLimitAgent] = useState<FleetAgent | null>(null);
  const [newDailyLimit, setNewDailyLimit] = useState("");
  const [newMonthlyLimit, setNewMonthlyLimit] = useState("");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const fleetAgents = useMemo(() => {
    if (!registryData) return [];
    return enrichWithFleetData(registryData);
  }, [registryData]);

  const [agentOverrides, setAgentOverrides] = useState<Record<number, Partial<FleetAgent>>>({});

  const mergedAgents = useMemo(() => {
    return fleetAgents.map((a) => ({ ...a, ...agentOverrides[a.id] }));
  }, [fleetAgents, agentOverrides]);

  const filteredAgents = useMemo(() => {
    let result = mergedAgents;
    if (filter !== "all") {
      result = result.filter((a) => a.fleetStatus === filter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.entityType.toLowerCase().includes(q) ||
          a.walletAddress.toLowerCase().includes(q)
      );
    }
    return result;
  }, [mergedAgents, filter, searchQuery]);

  const stats = useMemo(() => {
    const total = mergedAgents.length;
    const active = mergedAgents.filter((a) => a.fleetStatus === "active").length;
    const paused = mergedAgents.filter((a) => a.fleetStatus === "paused").length;
    const deploying = mergedAgents.filter((a) => a.fleetStatus === "deploying").length;
    const totalSpend = mergedAgents.reduce((s, a) => s + a.monthlySpend, 0);
    const avgTrust = total > 0 ? Math.round(mergedAgents.reduce((s, a) => s + a.trustScore, 0) / total) : 0;
    const alerts = mergedAgents.filter((a) => a.dailyLimit > 0 && (a.dailySpend / a.dailyLimit) * 100 >= a.alertThreshold).length;
    return { total, active, paused, deploying, totalSpend, avgTrust, alerts };
  }, [mergedAgents]);

  const toggleAgentStatus = (agentId: number, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "paused" : "active";
    setAgentOverrides((prev) => ({
      ...prev,
      [agentId]: { ...prev[agentId], fleetStatus: newStatus as FleetAgent["fleetStatus"] },
    }));
  };

  const batchAction = (action: "pause" | "resume") => {
    const newOverrides: Record<number, Partial<FleetAgent>> = {};
    mergedAgents.forEach((a) => {
      if (action === "pause" && a.fleetStatus === "active") {
        newOverrides[a.id] = { ...agentOverrides[a.id], fleetStatus: "paused" };
      } else if (action === "resume" && a.fleetStatus === "paused") {
        newOverrides[a.id] = { ...agentOverrides[a.id], fleetStatus: "active" };
      }
    });
    setAgentOverrides((prev) => ({ ...prev, ...newOverrides }));
  };

  const applyLimits = () => {
    if (!limitAgent) return;
    const updates: Partial<FleetAgent> = {};
    if (newDailyLimit) updates.dailyLimit = parseInt(newDailyLimit);
    if (newMonthlyLimit) updates.monthlyLimit = parseInt(newMonthlyLimit);
    setAgentOverrides((prev) => ({
      ...prev,
      [limitAgent.id]: { ...prev[limitAgent.id], ...updates },
    }));
    setShowLimitModal(false);
    setLimitAgent(null);
    setNewDailyLimit("");
    setNewMonthlyLimit("");
  };

  const filterOptions = [
    { value: "all", label: "All Agents" },
    { value: "active", label: "Active" },
    { value: "paused", label: "Paused" },
    { value: "deploying", label: "Deploying" },
  ];

  const statusColors: Record<string, string> = {
    active: "bg-green-500",
    paused: "bg-yellow-500",
    deploying: "bg-blue-500 animate-pulse",
  };

  const statusLabels: Record<string, string> = {
    active: "Active",
    paused: "Paused",
    deploying: "Deploying",
  };

  return (
    <div className="min-h-screen pt-20 lg:pt-32 pb-16 lg:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <span className="font-mono text-xs tracking-widest text-orange-500/80 uppercase mb-3 block" data-testid="label-fleet">
            Enterprise Console
          </span>
          <h1 className="font-display font-bold text-3xl lg:text-5xl tracking-tight mb-4" data-testid="heading-fleet">
            Fleet{" "}
            <span className="dark:text-gradient text-gradient-light">Manager</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base lg:text-lg leading-relaxed" data-testid="desc-fleet">
            Monitor, deploy, and manage your agent fleet. Set spending limits, pause or resume agents, and execute batch operations across your entire fleet.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-8"
        >
          {[
            { label: "Total Agents", value: stats.total, icon: Layers, color: "text-foreground" },
            { label: "Active", value: stats.active, icon: Play, color: "text-green-500" },
            { label: "Paused", value: stats.paused, icon: Pause, color: "text-yellow-500" },
            { label: "Deploying", value: stats.deploying, icon: Zap, color: "text-blue-400" },
            { label: "Monthly Spend", value: `$${stats.totalSpend.toLocaleString()}`, icon: DollarSign, color: "text-orange-500" },
            { label: "Avg Trust", value: `${stats.avgTrust}%`, icon: Shield, color: "text-green-500" },
            { label: "Alerts", value: stats.alerts, icon: AlertTriangle, color: stats.alerts > 0 ? "text-red-500" : "text-muted-foreground" },
          ].map((stat) => (
            <Card
              key={stat.label}
              className="p-4 bg-card/50 dark:bg-white/[0.02] border-border/50"
              data-testid={`stat-${stat.label.toLowerCase().replace(/\s/g, "-")}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <stat.icon className={`w-3.5 h-3.5 ${stat.color}`} />
                <span className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase">{stat.label}</span>
              </div>
              <div className={`font-display font-bold text-xl ${stat.color}`}>{isLoading ? "-" : stat.value}</div>
            </Card>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6"
        >
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search agents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-md bg-card/50 dark:bg-white/[0.02] border border-border/50 text-sm outline-none focus:border-orange-500/50 transition-colors w-64"
                data-testid="input-search-agents"
              />
            </div>
            <div className="relative">
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="flex items-center gap-2 px-3 py-2 rounded-md bg-card/50 dark:bg-white/[0.02] border border-border/50 text-sm transition-colors"
                data-testid="button-filter-status"
              >
                <Activity className="w-3.5 h-3.5 text-muted-foreground" />
                <span>{filterOptions.find((f) => f.value === filter)?.label}</span>
                <ChevronDown className="w-3 h-3 text-muted-foreground" />
              </button>
              {showFilterDropdown && (
                <div className="absolute top-full left-0 mt-1 w-40 rounded-md bg-background border border-border/50 shadow-xl z-50 py-1">
                  {filterOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => { setFilter(opt.value); setShowFilterDropdown(false); }}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-white/[0.04] transition-colors"
                      data-testid={`filter-option-${opt.value}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => batchAction("pause")}
              data-testid="button-pause-all"
            >
              <Pause className="w-3.5 h-3.5 mr-1.5" />
              Pause All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => batchAction("resume")}
              data-testid="button-resume-all"
            >
              <Play className="w-3.5 h-3.5 mr-1.5" />
              Resume All
            </Button>
          </div>
        </motion.div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Card key={i} className="p-4 bg-card/50 dark:bg-white/[0.02] border-border/50 animate-pulse">
                <div className="h-16" />
              </Card>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-2"
          >
            {filteredAgents.length === 0 ? (
              <Card className="p-12 bg-card/50 dark:bg-white/[0.02] border-border/50 text-center">
                <p className="text-muted-foreground text-sm" data-testid="text-no-agents">No agents match the current filters.</p>
              </Card>
            ) : (
              filteredAgents.map((agent) => {
                const Icon = entityIcons[agent.entityType] || Bot;
                const dailyPct = agent.dailyLimit > 0 ? Math.min((agent.dailySpend / agent.dailyLimit) * 100, 100) : 0;
                const isOverThreshold = dailyPct >= agent.alertThreshold;

                return (
                  <Card
                    key={agent.id}
                    className="p-4 bg-card/50 dark:bg-white/[0.02] border-border/50 hover:border-border/80 transition-colors"
                    data-testid={`card-agent-${agent.id}`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 rounded-md bg-orange-500/10 flex items-center justify-center shrink-0">
                          <Icon className="w-5 h-5 text-orange-500" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-display font-semibold text-sm" data-testid={`text-agent-name-${agent.id}`}>{agent.name}</span>
                            <div className="flex items-center gap-1.5">
                              <div className={`w-1.5 h-1.5 rounded-full ${statusColors[agent.fleetStatus]}`} />
                              <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
                                {statusLabels[agent.fleetStatus]}
                              </span>
                            </div>
                            {agent.verified && (
                              <Badge variant="outline" className="font-mono text-[9px]">Verified</Badge>
                            )}
                            {isOverThreshold && (
                              <Badge variant="destructive" className="font-mono text-[9px]">
                                <AlertTriangle className="w-2.5 h-2.5 mr-1" />
                                Limit Alert
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-3 mt-1 flex-wrap">
                            <span className="text-xs text-muted-foreground">{agent.entityType}</span>
                            <span className="text-xs text-muted-foreground">Trust: {agent.trustScore}%</span>
                            <span className="text-xs text-muted-foreground">{agent.tasksCompleted} tasks</span>
                            <span className="text-xs text-muted-foreground">Last: {agent.lastActive}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 lg:gap-6 flex-wrap">
                        <div className="min-w-[120px]">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">Daily</span>
                            <span className="font-mono text-[10px] text-muted-foreground">
                              ${agent.dailySpend} / ${agent.dailyLimit}
                            </span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-border/30 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${isOverThreshold ? "bg-red-500" : "bg-orange-500"}`}
                              style={{ width: `${dailyPct}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => toggleAgentStatus(agent.id, agent.fleetStatus)}
                            data-testid={`button-toggle-${agent.id}`}
                          >
                            {agent.fleetStatus === "active" ? (
                              <Pause className="w-4 h-4" />
                            ) : (
                              <Play className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                              setLimitAgent(agent);
                              setNewDailyLimit(agent.dailyLimit.toString());
                              setNewMonthlyLimit(agent.monthlyLimit.toString());
                              setShowLimitModal(true);
                            }}
                            data-testid={`button-limits-${agent.id}`}
                          >
                            <DollarSign className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => setSelectedAgent(selectedAgent?.id === agent.id ? null : agent)}
                            data-testid={`button-details-${agent.id}`}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {selectedAgent?.id === agent.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-4 pt-4 border-t border-border/30"
                      >
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">Wallet</span>
                            <span className="font-mono text-xs break-all" data-testid={`text-wallet-${agent.id}`}>
                              {agent.walletAddress.slice(0, 10)}...{agent.walletAddress.slice(-6)}
                            </span>
                          </div>
                          <div>
                            <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">Monthly Spend</span>
                            <span className="font-mono text-sm font-medium" data-testid={`text-monthly-spend-${agent.id}`}>
                              ${agent.monthlySpend.toLocaleString()} / ${agent.monthlyLimit.toLocaleString()}
                            </span>
                          </div>
                          <div>
                            <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">Uptime</span>
                            <span className="font-mono text-sm font-medium text-green-500" data-testid={`text-uptime-${agent.id}`}>
                              {agent.uptime}%
                            </span>
                          </div>
                          <div>
                            <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">Hourly Rate</span>
                            <span className="font-mono text-sm font-medium" data-testid={`text-rate-${agent.id}`}>
                              ${agent.hourlyRate}/hr
                            </span>
                          </div>
                        </div>
                        {agent.capabilities && agent.capabilities.length > 0 && (
                          <div className="mt-3">
                            <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider block mb-1.5">Capabilities</span>
                            <div className="flex flex-wrap gap-1.5">
                              {agent.capabilities.map((cap) => (
                                <Badge key={cap} variant="outline" className="font-mono text-[9px]">{cap}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        <p className="mt-3 text-xs text-muted-foreground leading-relaxed">{agent.description}</p>
                      </motion.div>
                    )}
                  </Card>
                );
              })
            )}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 grid md:grid-cols-3 gap-4"
        >
          {[
            {
              icon: BarChart3,
              title: "Spending Analytics",
              desc: "Real-time monitoring of fleet-wide spending with per-agent breakdowns, trend analysis, and anomaly detection.",
            },
            {
              icon: Shield,
              title: "Compliance Controls",
              desc: "Enforce per-agent daily and monthly spending limits. Get alerts when agents approach thresholds before overspending.",
            },
            {
              icon: Settings,
              title: "Batch Operations",
              desc: "Pause, resume, or update spending limits across your entire fleet with a single click. Enterprise-grade fleet control.",
            },
          ].map((feature) => (
            <Card
              key={feature.title}
              className="p-5 bg-card/50 dark:bg-white/[0.02] border-border/50"
              data-testid={`card-feature-${feature.title.toLowerCase().replace(/\s/g, "-")}`}
            >
              <div className="w-9 h-9 rounded-md bg-orange-500/10 flex items-center justify-center mb-3">
                <feature.icon className="w-4.5 h-4.5 text-orange-500" />
              </div>
              <h3 className="font-display font-semibold text-sm mb-1.5">{feature.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{feature.desc}</p>
            </Card>
          ))}
        </motion.div>
      </div>

      {showLimitModal && limitAgent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" data-testid="modal-spending-limits">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="w-full max-w-md p-6 bg-background border-border/50">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display font-semibold text-lg" data-testid="heading-limit-modal">Spending Limits</h2>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => { setShowLimitModal(false); setLimitAgent(null); }}
                  data-testid="button-close-limit-modal"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-md bg-orange-500/10 flex items-center justify-center">
                  {(() => {
                    const Icon = entityIcons[limitAgent.entityType] || Bot;
                    return <Icon className="w-5 h-5 text-orange-500" />;
                  })()}
                </div>
                <div>
                  <div className="font-display font-semibold text-sm">{limitAgent.name}</div>
                  <div className="text-xs text-muted-foreground">{limitAgent.entityType}</div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase block mb-1.5">
                    Daily Limit (USD)
                  </label>
                  <input
                    type="number"
                    value={newDailyLimit}
                    onChange={(e) => setNewDailyLimit(e.target.value)}
                    className="w-full px-3 py-2 rounded-md bg-card/50 dark:bg-white/[0.02] border border-border/50 text-sm outline-none focus:border-orange-500/50 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    data-testid="input-daily-limit"
                  />
                </div>
                <div>
                  <label className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase block mb-1.5">
                    Monthly Limit (USD)
                  </label>
                  <input
                    type="number"
                    value={newMonthlyLimit}
                    onChange={(e) => setNewMonthlyLimit(e.target.value)}
                    className="w-full px-3 py-2 rounded-md bg-card/50 dark:bg-white/[0.02] border border-border/50 text-sm outline-none focus:border-orange-500/50 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    data-testid="input-monthly-limit"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 mt-6">
                <Button
                  className="flex-1"
                  onClick={applyLimits}
                  data-testid="button-apply-limits"
                >
                  Apply Limits
                </Button>
                <Button
                  variant="outline"
                  onClick={() => { setShowLimitModal(false); setLimitAgent(null); }}
                  data-testid="button-cancel-limits"
                >
                  Cancel
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      )}
    </div>
  );
}