import { motion } from "framer-motion";
import { useSEO } from "@/hooks/use-seo";
import { Activity, Server, Wallet, CreditCard, Database, ShoppingBag, Landmark, CheckCircle2, Clock, AlertTriangle } from "lucide-react";

const systemComponents = [
  {
    name: "API Gateway",
    icon: Server,
    status: "operational" as const,
    uptime: 99.98,
    responseTime: 42,
  },
  {
    name: "Wallet Service",
    icon: Wallet,
    status: "operational" as const,
    uptime: 99.95,
    responseTime: 68,
  },
  {
    name: "X402 Payment Engine",
    icon: CreditCard,
    status: "operational" as const,
    uptime: 99.99,
    responseTime: 31,
  },
  {
    name: "Registry",
    icon: Database,
    status: "operational" as const,
    uptime: 99.97,
    responseTime: 55,
  },
  {
    name: "Marketplace",
    icon: ShoppingBag,
    status: "operational" as const,
    uptime: 99.94,
    responseTime: 73,
  },
  {
    name: "Settlement Engine",
    icon: Landmark,
    status: "operational" as const,
    uptime: 99.96,
    responseTime: 48,
  },
];

const incidents = [
  {
    date: "2025-01-12",
    title: "Elevated API Gateway Latency",
    status: "resolved" as const,
    description: "Increased response times on the API Gateway due to a surge in agent registration requests. Root cause identified and mitigated within 22 minutes. No data loss occurred.",
    timeline: [
      { time: "14:03 UTC", label: "Issue detected" },
      { time: "14:08 UTC", label: "Engineering team alerted" },
      { time: "14:15 UTC", label: "Root cause identified — connection pool saturation" },
      { time: "14:25 UTC", label: "Fix deployed, monitoring recovery" },
      { time: "14:32 UTC", label: "All systems nominal" },
    ],
  },
];

const uptimeDays = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  status: "operational" as const,
}));

export default function Status() {
  useSEO({
    title: "Status",
    description: "Real-time system status for the ORBIT protocol. Monitor uptime, response times, and incident history for all core services.",
  });

  const allOperational = systemComponents.every((c) => c.status === "operational");

  return (
    <div className="min-h-screen pt-20 lg:pt-32 pb-16 lg:pb-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 lg:mb-20"
        >
          <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase mb-3 block" data-testid="text-status-label">
            System Status
          </span>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6" data-testid="text-status-heading">
            {allOperational ? "All Systems Operational" : "Service Disruption Detected"}
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl leading-relaxed" data-testid="text-status-description">
            Real-time monitoring across every core component of the ORBIT protocol infrastructure.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-md border border-border/50 bg-card/50 dark:bg-white/[0.02] p-5 mb-8"
          data-testid="card-overall-status"
        >
          <div className="flex items-center gap-3">
            {allOperational ? (
              <div className="w-3 h-3 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.4)]" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-orange-500" />
            )}
            <span className="font-display font-semibold text-lg" data-testid="text-overall-status">
              {allOperational ? "All Systems Operational" : "Partial Outage"}
            </span>
          </div>
        </motion.div>

        <div className="space-y-3 mb-12">
          {systemComponents.map((component, i) => (
            <motion.div
              key={component.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="rounded-md border border-border/50 bg-card/50 dark:bg-white/[0.02] p-5"
              data-testid={`card-status-${i}`}
            >
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-md bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                    <component.icon className="w-4 h-4 text-orange-500" />
                  </div>
                  <div>
                    <span className="font-display font-medium text-sm" data-testid={`text-component-name-${i}`}>
                      {component.name}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-6 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-muted-foreground/60" />
                    <span className="font-mono text-xs text-muted-foreground" data-testid={`text-response-time-${i}`}>
                      {component.responseTime}ms
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5 text-muted-foreground/60" />
                    <span className="font-mono text-xs text-muted-foreground" data-testid={`text-uptime-${i}`}>
                      {component.uptime}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {component.status === "operational" ? (
                      <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                    ) : (
                      <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/40" />
                    )}
                    <span className={`font-mono text-xs capitalize ${component.status === "operational" ? "text-orange-500" : "text-muted-foreground"}`} data-testid={`text-status-value-${i}`}>
                      {component.status}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="font-display text-xl font-semibold tracking-tight mb-4" data-testid="text-uptime-chart-heading">
            30-Day Uptime
          </h2>
          <div className="rounded-md border border-border/50 bg-card/50 dark:bg-white/[0.02] p-5">
            <div className="flex items-end gap-1" data-testid="chart-uptime-30d">
              {uptimeDays.map((day) => (
                <div
                  key={day.day}
                  className="flex-1 h-8 rounded-sm bg-orange-500/70 hover:bg-orange-500 transition-colors"
                  title={`Day ${day.day}: ${day.status}`}
                  data-testid={`bar-uptime-day-${day.day}`}
                />
              ))}
            </div>
            <div className="flex items-center justify-between gap-4 mt-3 text-xs text-muted-foreground font-mono">
              <span>30 days ago</span>
              <span>Today</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display text-xl font-semibold tracking-tight mb-4" data-testid="text-incidents-heading">
            Incident History
          </h2>
          <div className="space-y-4">
            {incidents.map((incident, i) => (
              <div
                key={i}
                className="rounded-md border border-border/50 bg-card/50 dark:bg-white/[0.02] p-5"
                data-testid={`card-incident-${i}`}
              >
                <div className="flex items-start justify-between gap-4 mb-3 flex-wrap">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-orange-500 flex-shrink-0" />
                    <h3 className="font-display font-medium text-sm" data-testid={`text-incident-title-${i}`}>
                      {incident.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-orange-500 capitalize" data-testid={`text-incident-status-${i}`}>
                      {incident.status}
                    </span>
                    <span className="font-mono text-xs text-muted-foreground" data-testid={`text-incident-date-${i}`}>
                      {incident.date}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4" data-testid={`text-incident-desc-${i}`}>
                  {incident.description}
                </p>
                <div className="space-y-2 border-l-2 border-border/30 pl-4 ml-2">
                  {incident.timeline.map((entry, j) => (
                    <div key={j} className="flex items-start gap-3" data-testid={`text-incident-timeline-${i}-${j}`}>
                      <span className="font-mono text-xs text-muted-foreground/60 flex-shrink-0 w-20">
                        {entry.time}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {entry.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
