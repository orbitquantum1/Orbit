import { useSEO } from "@/hooks/use-seo";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import type { RegistryEntry } from "@shared/schema";
import {
  BarChart3,
  Activity,
  Users,
  TrendingUp,
  Shield,
  Bot,
  User,
  CircuitBoard,
  Building2,
  ArrowUpRight,
  Clock,
  Zap,
  Filter,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const entityFilters = [
  { label: "All", value: "all", icon: Users },
  { label: "AI Agent", value: "AI Agent", icon: Bot },
  { label: "Robot", value: "Robot", icon: CircuitBoard },
  { label: "Human", value: "Human", icon: User },
  { label: "Enterprise", value: "Enterprise", icon: Building2 },
];

const activityData = [
  { day: "Mon", transactions: 142, registrations: 8, volume: 4200 },
  { day: "Tue", transactions: 189, registrations: 12, volume: 5800 },
  { day: "Wed", transactions: 231, registrations: 6, volume: 7100 },
  { day: "Thu", transactions: 178, registrations: 15, volume: 5400 },
  { day: "Fri", transactions: 267, registrations: 9, volume: 8300 },
  { day: "Sat", transactions: 312, registrations: 18, volume: 9600 },
  { day: "Sun", transactions: 284, registrations: 11, volume: 8800 },
];

const hourlyActivity = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i.toString().padStart(2, "0")}:00`,
  requests: Math.floor(Math.random() * 80 + 20 + Math.sin(i / 3) * 40),
}));

function getEntityIcon(type: string) {
  switch (type) {
    case "AI Agent": return Bot;
    case "Robot": return CircuitBoard;
    case "Human": return User;
    case "Enterprise": return Building2;
    default: return Bot;
  }
}

function getStatusColor(status: string | null) {
  switch (status) {
    case "available": return "border-green-500/50 text-green-400";
    case "busy": return "border-yellow-500/50 text-yellow-400";
    case "offline": return "border-red-500/50 text-red-400";
    default: return "border-white/20 text-white/50";
  }
}

export default function Analytics() {
  useSEO({
    title: "Agent Analytics",
    description: "ORBIT Protocol Agent Analytics Dashboard. Monitor registered agent activity, trust scores, transactions, and network performance.",
  });

  const [activeFilter, setActiveFilter] = useState("all");

  const { data: agents, isLoading } = useQuery<RegistryEntry[]>({
    queryKey: ["/api/registry"],
  });

  const filteredAgents = useMemo(() => {
    if (!agents) return [];
    if (activeFilter === "all") return agents;
    return agents.filter((a) => a.entityType === activeFilter);
  }, [agents, activeFilter]);

  const stats = useMemo(() => {
    if (!agents || agents.length === 0)
      return { total: 0, totalTx: 0, totalVolume: 0, avgTrust: 0, typeCounts: {} as Record<string, number> };

    const totalTx = agents.reduce((s, a) => s + (a.totalTransactions ?? 0), 0);
    const totalVolume = agents.reduce((s, a) => s + (a.hourlyRate ?? 0) * (a.completedTasks ?? 0), 0);
    const avgTrust = Math.round(agents.reduce((s, a) => s + (a.trustScore ?? 0), 0) / agents.length);
    const typeCounts: Record<string, number> = {};
    agents.forEach((a) => {
      typeCounts[a.entityType] = (typeCounts[a.entityType] || 0) + 1;
    });

    return { total: agents.length, totalTx, totalVolume, avgTrust, typeCounts };
  }, [agents]);

  const typeChartData = useMemo(() => {
    return Object.entries(stats.typeCounts).map(([name, value]) => ({ name, value }));
  }, [stats.typeCounts]);

  const typeColors = ["#f97316", "#ea580c", "#c2410c", "#9a3412", "#7c2d12"];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={0}
          className="text-center mb-16"
        >
          <span className="font-mono text-[10px] tracking-widest text-orange-500/70 uppercase mb-3 block">
            Network Intelligence
          </span>
          <h1
            className="font-display font-bold text-2xl sm:text-4xl lg:text-5xl text-white tracking-tight mb-4"
            data-testid="text-analytics-title"
          >
            Agent Analytics
          </h1>
          <p className="text-sm text-white/40 max-w-2xl mx-auto leading-relaxed">
            Real-time analytics for all registered agents, robots, and entities on the ORBIT Protocol network.
            Monitor activity, trust scores, transaction volume, and network health.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={1}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10"
        >
          {[
            {
              label: "Total Agents",
              value: isLoading ? "..." : stats.total.toLocaleString(),
              icon: Users,
              sub: "Registered entities",
            },
            {
              label: "Total Transactions",
              value: isLoading ? "..." : stats.totalTx.toLocaleString(),
              icon: Activity,
              sub: "All-time network tx",
            },
            {
              label: "Total Volume",
              value: isLoading ? "..." : `$${stats.totalVolume.toLocaleString()}`,
              icon: TrendingUp,
              sub: "Estimated throughput",
            },
            {
              label: "Avg Trust Score",
              value: isLoading ? "..." : `${stats.avgTrust}/100`,
              icon: Shield,
              sub: "Network reputation",
            },
          ].map((stat, i) => (
            <Card
              key={stat.label}
              className="border-border/50 bg-card/50 dark:bg-white/[0.02] p-4"
              data-testid={`stat-card-${i}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-md bg-orange-500/10 flex items-center justify-center">
                  <stat.icon className="w-3.5 h-3.5 text-orange-500" />
                </div>
                <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
                  {stat.label}
                </span>
              </div>
              <div className="font-display font-bold text-xl text-white" data-testid={`stat-value-${i}`}>
                {stat.value}
              </div>
              <div className="font-mono text-[10px] text-white/30 mt-1">{stat.sub}</div>
            </Card>
          ))}
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={2} className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-md bg-orange-500/10 flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-orange-500" />
            </div>
            <h2 className="font-display font-semibold text-lg" data-testid="text-activity-chart-heading">
              Network Activity
            </h2>
          </div>
          <div className="grid lg:grid-cols-2 gap-4">
            <Card className="border-border/50 bg-card/50 dark:bg-white/[0.02] p-5">
              <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mb-4">
                Weekly Transactions & Registrations
              </div>
              <div className="w-full h-[240px]" data-testid="chart-weekly-activity">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={activityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="day" tick={{ fontSize: 10, fill: "rgba(255,255,255,0.4)" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "rgba(255,255,255,0.4)" }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0a0a0a",
                        border: "1px solid rgba(249, 115, 22, 0.3)",
                        borderRadius: "6px",
                        fontSize: "12px",
                        color: "#fff",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="transactions"
                      stroke="#f97316"
                      fill="rgba(249, 115, 22, 0.15)"
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="registrations"
                      stroke="#ea580c"
                      fill="rgba(234, 88, 12, 0.1)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="border-border/50 bg-card/50 dark:bg-white/[0.02] p-5">
              <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mb-4">
                Hourly API Requests (24h)
              </div>
              <div className="w-full h-[240px]" data-testid="chart-hourly-requests">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={hourlyActivity}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis
                      dataKey="hour"
                      tick={{ fontSize: 9, fill: "rgba(255,255,255,0.4)" }}
                      axisLine={false}
                      tickLine={false}
                      interval={3}
                    />
                    <YAxis tick={{ fontSize: 10, fill: "rgba(255,255,255,0.4)" }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0a0a0a",
                        border: "1px solid rgba(249, 115, 22, 0.3)",
                        borderRadius: "6px",
                        fontSize: "12px",
                        color: "#fff",
                      }}
                    />
                    <Bar dataKey="requests" radius={[2, 2, 0, 0]}>
                      {hourlyActivity.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={`rgba(249, 115, 22, ${0.3 + (index / 24) * 0.5})`} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={2.5} className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-md bg-orange-500/10 flex items-center justify-center">
              <Zap className="w-4 h-4 text-orange-500" />
            </div>
            <h2 className="font-display font-semibold text-lg" data-testid="text-distribution-heading">
              Entity Distribution
            </h2>
          </div>
          <Card className="border-border/50 bg-card/50 dark:bg-white/[0.02] p-5">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {typeChartData.map((item, i) => {
                const Icon = getEntityIcon(item.name);
                return (
                  <div
                    key={item.name}
                    className="flex items-center gap-3 p-3 rounded-md bg-black/20 border border-border/20"
                    data-testid={`entity-dist-${item.name.toLowerCase().replace(/\s/g, "-")}`}
                  >
                    <div
                      className="w-9 h-9 rounded-md flex items-center justify-center"
                      style={{ backgroundColor: `${typeColors[i % typeColors.length]}20` }}
                    >
                      <Icon className="w-4 h-4" style={{ color: typeColors[i % typeColors.length] }} />
                    </div>
                    <div>
                      <div className="text-xs font-medium">{item.name}</div>
                      <div className="font-mono text-lg font-bold" style={{ color: typeColors[i % typeColors.length] }}>
                        {item.value}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={3}>
          <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-orange-500/10 flex items-center justify-center">
                <Filter className="w-4 h-4 text-orange-500" />
              </div>
              <h2 className="font-display font-semibold text-lg" data-testid="text-agents-heading">
                Registered Agents
              </h2>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap" data-testid="filter-entity-type">
              {entityFilters.map((f) => (
                <Button
                  key={f.value}
                  variant={activeFilter === f.value ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveFilter(f.value)}
                  className={activeFilter === f.value ? "bg-orange-500 text-white" : ""}
                  data-testid={`button-filter-${f.value.toLowerCase().replace(/\s/g, "-")}`}
                >
                  <f.icon className="w-3 h-3 mr-1" />
                  {f.label}
                </Button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="border-border/50 bg-card/50 dark:bg-white/[0.02] p-5 animate-pulse">
                  <div className="h-4 bg-white/10 rounded-md w-2/3 mb-3" />
                  <div className="h-3 bg-white/5 rounded-md w-full mb-2" />
                  <div className="h-3 bg-white/5 rounded-md w-1/2" />
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredAgents.map((agent) => {
                const Icon = getEntityIcon(agent.entityType);
                const simulatedVolume = (agent.hourlyRate ?? 0) * ((agent.completedTasks ?? 0) + Math.floor(Math.random() * 50 + 10));
                const simulatedReputation = Math.min(100, (agent.trustScore ?? 0) + Math.floor(Math.random() * 5));
                return (
                  <Card
                    key={agent.id}
                    className="border-border/50 bg-card/50 dark:bg-white/[0.02] p-4"
                    data-testid={`agent-card-${agent.id}`}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-9 h-9 rounded-md bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-orange-500" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-medium truncate" data-testid={`agent-name-${agent.id}`}>
                            {agent.name}
                          </span>
                          {agent.verified && (
                            <Badge variant="outline" className="text-[9px] border-green-500/50 text-green-400 px-1.5 py-0">
                              Verified
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                          <Badge variant="outline" className="text-[9px] border-orange-500/30 text-orange-400 px-1.5 py-0">
                            {agent.entityType}
                          </Badge>
                          <Badge variant="outline" className={`text-[9px] px-1.5 py-0 ${getStatusColor(agent.status)}`}>
                            {agent.status ?? "unknown"}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="p-2 rounded-md bg-black/20 border border-border/20">
                        <div className="font-mono text-[9px] text-muted-foreground">Trust Score</div>
                        <div className="font-mono text-sm text-orange-400" data-testid={`agent-trust-${agent.id}`}>
                          {agent.trustScore ?? 0}/100
                        </div>
                      </div>
                      <div className="p-2 rounded-md bg-black/20 border border-border/20">
                        <div className="font-mono text-[9px] text-muted-foreground">Transactions</div>
                        <div className="font-mono text-sm text-white" data-testid={`agent-tx-${agent.id}`}>
                          {(agent.totalTransactions ?? 0).toLocaleString()}
                        </div>
                      </div>
                      <div className="p-2 rounded-md bg-black/20 border border-border/20">
                        <div className="font-mono text-[9px] text-muted-foreground">Volume</div>
                        <div className="font-mono text-sm text-white">
                          ${simulatedVolume.toLocaleString()}
                        </div>
                      </div>
                      <div className="p-2 rounded-md bg-black/20 border border-border/20">
                        <div className="font-mono text-[9px] text-muted-foreground">Uptime</div>
                        <div className="font-mono text-sm text-green-400" data-testid={`agent-uptime-${agent.id}`}>
                          {agent.uptime ?? 0}%
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <span className="font-mono text-[10px] text-muted-foreground">
                          {agent.responseTime ?? "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Shield className="w-3 h-3 text-muted-foreground" />
                        <span className="font-mono text-[10px] text-muted-foreground">
                          Rep: {simulatedReputation}
                        </span>
                      </div>
                      {agent.hourlyRate && (
                        <div className="flex items-center gap-1">
                          <ArrowUpRight className="w-3 h-3 text-orange-500" />
                          <span className="font-mono text-[10px] text-orange-400">
                            ${agent.hourlyRate}/hr
                          </span>
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}

          {!isLoading && filteredAgents.length === 0 && (
            <Card className="border-border/50 bg-card/50 dark:bg-white/[0.02] p-8 text-center">
              <div className="w-12 h-12 rounded-md bg-orange-500/10 flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-orange-500/50" />
              </div>
              <p className="text-sm text-muted-foreground" data-testid="text-no-agents">
                No agents found for the selected filter.
              </p>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}