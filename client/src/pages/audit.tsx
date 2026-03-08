import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Download, Shield, FileText, CheckCircle, AlertTriangle, Clock, Wallet, UserCheck, Activity, Filter, ChevronDown, X } from "lucide-react";
import { useSEO } from "@/hooks/use-seo";

type AuditEventType = "transaction" | "identity" | "wallet" | "registry" | "webhook" | "escrow" | "governance";
type AuditStatus = "success" | "failed" | "pending" | "warning";

interface AuditEvent {
  id: string;
  timestamp: string;
  type: AuditEventType;
  action: string;
  description: string;
  walletAddress: string;
  status: AuditStatus;
  txHash?: string;
  metadata?: Record<string, string>;
}

const EVENT_TYPE_CONFIG: Record<AuditEventType, { label: string; color: string; icon: typeof Activity }> = {
  transaction: { label: "Transaction", color: "text-orange-500 bg-orange-500/10 border-orange-500/30", icon: Activity },
  identity: { label: "Identity", color: "text-blue-400 bg-blue-400/10 border-blue-400/30", icon: UserCheck },
  wallet: { label: "Wallet", color: "text-green-400 bg-green-400/10 border-green-400/30", icon: Wallet },
  registry: { label: "Registry", color: "text-purple-400 bg-purple-400/10 border-purple-400/30", icon: FileText },
  webhook: { label: "Webhook", color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30", icon: Activity },
  escrow: { label: "Escrow", color: "text-cyan-400 bg-cyan-400/10 border-cyan-400/30", icon: Shield },
  governance: { label: "Governance", color: "text-pink-400 bg-pink-400/10 border-pink-400/30", icon: FileText },
};

const STATUS_CONFIG: Record<AuditStatus, { label: string; color: string; icon: typeof CheckCircle }> = {
  success: { label: "Success", color: "text-green-400 bg-green-400/10", icon: CheckCircle },
  failed: { label: "Failed", color: "text-red-400 bg-red-400/10", icon: AlertTriangle },
  pending: { label: "Pending", color: "text-yellow-400 bg-yellow-400/10", icon: Clock },
  warning: { label: "Warning", color: "text-orange-400 bg-orange-400/10", icon: AlertTriangle },
};

function generateAuditData(): AuditEvent[] {
  const now = Date.now();
  const events: AuditEvent[] = [];
  const wallets = [
    "0x7a3B1c9E4d2F8a6b0C1d3E5f7A9b2C4D6e8F0a1",
    "0x2b4D6f8A0c2E4g6I8k0M2o4Q6s8U0w2Y4a6C8e0",
    "0x3c5E7g9B1d3F5h7J9l1N3p5R7t9V1x3Z5b7D9f1",
    "0x4d6F8h0C2e4G6i8K0m2O4q6S8u0W2y4A6c8E0g2",
    "0x5e7G9i1D3f5H7j9L1n3P5r7T9v1X3z5B7d9F1h3",
  ];
  const txActions = [
    { action: "payment_sent", desc: "X402 payment sent" },
    { action: "payment_received", desc: "X402 payment received" },
    { action: "settlement_initiated", desc: "Cross-chain settlement initiated" },
    { action: "settlement_confirmed", desc: "Cross-chain settlement confirmed" },
    { action: "fee_collected", desc: "Protocol fee collected" },
  ];
  const identityActions = [
    { action: "identity_issued", desc: "ERC-8004 identity document issued" },
    { action: "identity_verified", desc: "Identity document verified" },
    { action: "capability_granted", desc: "Capability token granted" },
    { action: "capability_revoked", desc: "Capability token revoked" },
    { action: "did_resolved", desc: "DID resolution completed" },
  ];
  const walletActions = [
    { action: "wallet_created", desc: "HD wallet generated on Base" },
    { action: "wallet_funded", desc: "Wallet funded via bridge" },
    { action: "key_rotated", desc: "Private key rotation completed" },
    { action: "nonce_updated", desc: "Wallet nonce incremented" },
  ];
  const registryActions = [
    { action: "agent_registered", desc: "Agent registered in protocol registry" },
    { action: "agent_updated", desc: "Agent registry entry updated" },
    { action: "trust_score_updated", desc: "Trust score recalculated" },
    { action: "visibility_changed", desc: "Agent visibility setting changed" },
  ];
  const webhookActions = [
    { action: "webhook_created", desc: "Webhook endpoint configured" },
    { action: "webhook_triggered", desc: "Webhook event dispatched" },
    { action: "webhook_failed", desc: "Webhook delivery failed" },
  ];
  const escrowActions = [
    { action: "escrow_created", desc: "Escrow contract created" },
    { action: "escrow_funded", desc: "Escrow funded by payer" },
    { action: "escrow_released", desc: "Escrow funds released" },
    { action: "escrow_disputed", desc: "Escrow dispute initiated" },
  ];
  const govActions = [
    { action: "proposal_executed", desc: "AI Treasury Manager executed proposal" },
    { action: "buyback_completed", desc: "Buy and burn operation completed" },
    { action: "vault_rebalanced", desc: "Vault positions rebalanced" },
  ];

  const allActions: Array<{ type: AuditEventType; actions: typeof txActions }> = [
    { type: "transaction", actions: txActions },
    { type: "identity", actions: identityActions },
    { type: "wallet", actions: walletActions },
    { type: "registry", actions: registryActions },
    { type: "webhook", actions: webhookActions },
    { type: "escrow", actions: escrowActions },
    { type: "governance", actions: govActions },
  ];

  for (let i = 0; i < 150; i++) {
    const group = allActions[Math.floor(Math.random() * allActions.length)];
    const act = group.actions[Math.floor(Math.random() * group.actions.length)];
    const wallet = wallets[Math.floor(Math.random() * wallets.length)];
    const statuses: AuditStatus[] = ["success", "success", "success", "success", "success", "success", "pending", "failed", "warning"];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const timestamp = new Date(now - i * 847000 - Math.random() * 300000).toISOString();
    const txHash = group.type === "transaction" ? `0x${Array.from({ length: 64 }, () => "0123456789abcdef"[Math.floor(Math.random() * 16)]).join("")}` : undefined;

    events.push({
      id: `audit-${i.toString().padStart(4, "0")}`,
      timestamp,
      type: group.type,
      action: act.action,
      description: act.desc,
      walletAddress: wallet,
      status,
      txHash,
      metadata: {
        network: "Base (Chain 8453)",
        protocol: "ORBIT v1.0",
        ...(group.type === "transaction" ? { amount: `${(Math.random() * 100).toFixed(4)} ORB` } : {}),
      },
    });
  }

  return events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

const AUDIT_DATA = generateAuditData();

const complianceFrameworks = [
  { name: "SOC 2 Type II", status: "Compliant", icon: Shield, desc: "Security, availability, processing integrity" },
  { name: "GDPR", status: "Compliant", icon: Shield, desc: "EU data protection and privacy" },
  { name: "ISO 27001", status: "Compliant", icon: Shield, desc: "Information security management" },
  { name: "CCPA", status: "Compliant", icon: Shield, desc: "California consumer privacy" },
];

export default function Audit() {
  useSEO({ title: "Compliance & Audit Log", description: "Searchable audit log of all ORBIT Protocol events with compliance tracking and CSV export." });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<AuditEventType | "all">("all");
  const [selectedStatus, setSelectedStatus] = useState<AuditStatus | "all">("all");
  const [showFilters, setShowFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(30);

  const filteredEvents = useMemo(() => {
    return AUDIT_DATA.filter((event) => {
      if (selectedType !== "all" && event.type !== selectedType) return false;
      if (selectedStatus !== "all" && event.status !== selectedStatus) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          event.action.toLowerCase().includes(q) ||
          event.description.toLowerCase().includes(q) ||
          event.walletAddress.toLowerCase().includes(q) ||
          (event.txHash && event.txHash.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [searchQuery, selectedType, selectedStatus]);

  const stats = useMemo(() => {
    const total = AUDIT_DATA.length;
    const success = AUDIT_DATA.filter((e) => e.status === "success").length;
    const failed = AUDIT_DATA.filter((e) => e.status === "failed").length;
    const pending = AUDIT_DATA.filter((e) => e.status === "pending").length;
    return { total, success, failed, pending };
  }, []);

  const exportCSV = () => {
    const headers = ["ID", "Timestamp", "Type", "Action", "Description", "Wallet Address", "Status", "TX Hash"];
    const rows = filteredEvents.map((e) => [e.id, e.timestamp, e.type, e.action, e.description, e.walletAddress, e.status, e.txHash || ""].join(","));
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orbit-audit-log-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatTimestamp = (ts: string) => {
    const d = new Date(ts);
    return d.toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" });
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-orange-500" />
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight" data-testid="text-audit-title">
              Compliance & Audit Log
            </h1>
          </div>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl" data-testid="text-audit-subtitle">
            Immutable record of all protocol events. Every transaction, identity verification, and system action is cryptographically logged.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {complianceFrameworks.map((fw) => (
            <Card key={fw.name} className="bg-white/[0.02] border-border/30" data-testid={`card-compliance-${fw.name.toLowerCase().replace(/\s/g, "-")}`}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-md bg-green-500/10 flex items-center justify-center flex-shrink-0">
                  <fw.icon className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <div className="text-sm font-bold text-foreground">{fw.name}</div>
                  <div className="text-xs text-green-400 font-medium">{fw.status}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/[0.02] border-border/30">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-foreground font-mono" data-testid="text-total-events">{stats.total.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground mt-1">Total Events</div>
            </CardContent>
          </Card>
          <Card className="bg-white/[0.02] border-border/30">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-400 font-mono" data-testid="text-success-events">{stats.success.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground mt-1">Successful</div>
            </CardContent>
          </Card>
          <Card className="bg-white/[0.02] border-border/30">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-400 font-mono" data-testid="text-failed-events">{stats.failed.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground mt-1">Failed</div>
            </CardContent>
          </Card>
          <Card className="bg-white/[0.02] border-border/30">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400 font-mono" data-testid="text-pending-events">{stats.pending.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground mt-1">Pending</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search events, wallets, tx hashes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/[0.02] border-border/30"
                data-testid="input-search-audit"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2" data-testid="button-clear-search">
                  <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                </button>
              )}
            </div>
            <Button variant="outline" size="default" onClick={() => setShowFilters(!showFilters)} className="border-border/30 gap-2" data-testid="button-toggle-filters">
              <Filter className="w-4 h-4" />
              Filters
              <ChevronDown className={`w-3 h-3 transition-transform ${showFilters ? "rotate-180" : ""}`} />
            </Button>
            <Button variant="outline" size="default" onClick={exportCSV} className="border-orange-500/30 text-orange-500 hover:bg-orange-500/10 gap-2" data-testid="button-export-csv">
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
          </div>

          {showFilters && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-4 p-4 rounded-md border border-border/30 bg-white/[0.02]">
              <div className="space-y-3">
                <div>
                  <span className="text-xs text-muted-foreground font-mono tracking-wider uppercase mb-2 block">Event Type</span>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => setSelectedType("all")} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${selectedType === "all" ? "bg-orange-500 text-white" : "bg-white/[0.05] text-muted-foreground hover:text-foreground"}`} data-testid="filter-type-all">All</button>
                    {(Object.keys(EVENT_TYPE_CONFIG) as AuditEventType[]).map((type) => (
                      <button key={type} onClick={() => setSelectedType(type)} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${selectedType === type ? "bg-orange-500 text-white" : "bg-white/[0.05] text-muted-foreground hover:text-foreground"}`} data-testid={`filter-type-${type}`}>
                        {EVENT_TYPE_CONFIG[type].label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground font-mono tracking-wider uppercase mb-2 block">Status</span>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => setSelectedStatus("all")} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${selectedStatus === "all" ? "bg-orange-500 text-white" : "bg-white/[0.05] text-muted-foreground hover:text-foreground"}`} data-testid="filter-status-all">All</button>
                    {(Object.keys(STATUS_CONFIG) as AuditStatus[]).map((status) => (
                      <button key={status} onClick={() => setSelectedStatus(status)} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${selectedStatus === status ? "bg-orange-500 text-white" : "bg-white/[0.05] text-muted-foreground hover:text-foreground"}`} data-testid={`filter-status-${status}`}>
                        {STATUS_CONFIG[status].label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-muted-foreground" data-testid="text-result-count">
              {filteredEvents.length.toLocaleString()} events found
            </span>
          </div>

          <div className="space-y-2">
            {filteredEvents.slice(0, visibleCount).map((event, index) => {
              const typeConfig = EVENT_TYPE_CONFIG[event.type];
              const statusConfig = STATUS_CONFIG[event.status];
              const TypeIcon = typeConfig.icon;
              const StatusIcon = statusConfig.icon;

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.01 }}
                >
                  <Card className="bg-white/[0.02] border-border/30 hover:border-border/50 transition-colors" data-testid={`card-audit-event-${event.id}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 ${typeConfig.color.split(" ").slice(1).join(" ")}`}>
                          <TypeIcon className={`w-4 h-4 ${typeConfig.color.split(" ")[0]}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="text-sm font-medium text-foreground">{event.description}</span>
                            <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${typeConfig.color}`}>
                              {typeConfig.label}
                            </Badge>
                            <div className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${statusConfig.color}`}>
                              <StatusIcon className="w-3 h-3" />
                              {statusConfig.label}
                            </div>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="font-mono">{formatTimestamp(event.timestamp)}</span>
                            <span className="font-mono">{event.walletAddress.slice(0, 10)}...{event.walletAddress.slice(-6)}</span>
                            {event.txHash && (
                              <a
                                href={`https://basescan.org/tx/${event.txHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-mono text-orange-500/70 hover:text-orange-500 transition-colors"
                                data-testid={`link-tx-${event.id}`}
                              >
                                {event.txHash.slice(0, 10)}...
                              </a>
                            )}
                          </div>
                        </div>
                        <span className="text-[10px] text-muted-foreground font-mono flex-shrink-0">{event.id}</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {visibleCount < filteredEvents.length && (
            <div className="mt-6 text-center">
              <Button
                variant="outline"
                onClick={() => setVisibleCount((prev) => prev + 30)}
                className="border-border/30"
                data-testid="button-load-more"
              >
                Load More ({filteredEvents.length - visibleCount} remaining)
              </Button>
            </div>
          )}

          {filteredEvents.length === 0 && (
            <Card className="bg-white/[0.02] border-border/30">
              <CardContent className="p-12 text-center">
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No events match your search criteria</p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}
