import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Shield, Plus, Lock, Unlock, AlertTriangle, CheckCircle, Clock, ArrowRight, X, DollarSign, Users, Activity, FileText } from "lucide-react";
import { useSEO } from "@/hooks/use-seo";

type EscrowStatus = "created" | "funded" | "in_progress" | "completed" | "disputed" | "released" | "cancelled";

interface Escrow {
  id: string;
  payerAddress: string;
  payeeAddress: string;
  payeeName: string;
  taskDescription: string;
  amount: string;
  currency: string;
  status: EscrowStatus;
  createdAt: string;
  fundedAt?: string;
  completedAt?: string;
  releasedAt?: string;
  disputeReason?: string;
}

const STATUS_CONFIG: Record<EscrowStatus, { label: string; color: string; icon: typeof Clock }> = {
  created: { label: "Created", color: "text-gray-400 bg-gray-400/10 border-gray-400/30", icon: Clock },
  funded: { label: "Funded", color: "text-blue-400 bg-blue-400/10 border-blue-400/30", icon: Lock },
  in_progress: { label: "In Progress", color: "text-orange-500 bg-orange-500/10 border-orange-500/30", icon: Activity },
  completed: { label: "Completed", color: "text-green-400 bg-green-400/10 border-green-400/30", icon: CheckCircle },
  disputed: { label: "Disputed", color: "text-red-400 bg-red-400/10 border-red-400/30", icon: AlertTriangle },
  released: { label: "Released", color: "text-purple-400 bg-purple-400/10 border-purple-400/30", icon: Unlock },
  cancelled: { label: "Cancelled", color: "text-gray-500 bg-gray-500/10 border-gray-500/30", icon: X },
};

const SIMULATED_AGENTS = [
  { name: "GPT-4o Agent", address: "0x7a3B1c9E4d2F8a6b0C1d3E5f7A9b2C4D6e8F0a1", type: "AI Agent" },
  { name: "Claude Agent", address: "0x2b4D6f8A0c2E4g6I8k0M2o4Q6s8U0w2Y4a6C8e0", type: "AI Agent" },
  { name: "Devin AI", address: "0x9i1K3m5H7j9L1n3P5r7T9v1X3z5B7d9F1h3J5l7", type: "AI Agent" },
  { name: "Spot Enterprise", address: "0x4d6F8h0C2e4G6i8K0m2O4q6S8u0W2y4A6c8E0g2", type: "Robot" },
  { name: "Atlas Humanoid", address: "0x5e7G9i1D3f5H7j9L1n3P5r7T9v1X3z5B7d9F1h3", type: "Robot" },
  { name: "Optimus Gen-2", address: "0x6f8H0j2E4g6I8k0M2o4Q6s8U0w2Y4a6C8e0G2i4", type: "Robot" },
];

function generateSimulatedEscrows(): Escrow[] {
  const now = Date.now();
  return [
    {
      id: "esc-001", payerAddress: "0x7a3B...0a1", payeeAddress: "0x9i1K...5l7", payeeName: "Devin AI",
      taskDescription: "Full-stack web application development with API integration",
      amount: "500", currency: "ORB", status: "funded", createdAt: new Date(now - 86400000).toISOString(), fundedAt: new Date(now - 82800000).toISOString(),
    },
    {
      id: "esc-002", payerAddress: "0x2b4D...8e0", payeeAddress: "0x4d6F...0g2", payeeName: "Spot Enterprise",
      taskDescription: "Industrial site inspection and thermal imaging report",
      amount: "2,400", currency: "ORB", status: "in_progress", createdAt: new Date(now - 172800000).toISOString(), fundedAt: new Date(now - 169200000).toISOString(),
    },
    {
      id: "esc-003", payerAddress: "0x3c5E...9f1", payeeAddress: "0x7a3B...0a1", payeeName: "GPT-4o Agent",
      taskDescription: "Data analysis pipeline with automated report generation",
      amount: "180", currency: "ORB", status: "completed", createdAt: new Date(now - 604800000).toISOString(), fundedAt: new Date(now - 600000000).toISOString(), completedAt: new Date(now - 345600000).toISOString(),
    },
    {
      id: "esc-004", payerAddress: "0x5e7G...1h3", payeeAddress: "0x2b4D...8e0", payeeName: "Claude Agent",
      taskDescription: "Legal document review and compliance analysis",
      amount: "320", currency: "ORB", status: "released", createdAt: new Date(now - 1209600000).toISOString(), fundedAt: new Date(now - 1200000000).toISOString(), completedAt: new Date(now - 864000000).toISOString(), releasedAt: new Date(now - 860000000).toISOString(),
    },
    {
      id: "esc-005", payerAddress: "0x6f8H...2i4", payeeAddress: "0x5e7G...1h3", payeeName: "Atlas Humanoid",
      taskDescription: "Warehouse reorganization and inventory sorting",
      amount: "3,750", currency: "ORB", status: "disputed", createdAt: new Date(now - 432000000).toISOString(), fundedAt: new Date(now - 428400000).toISOString(), disputeReason: "Task incomplete: 3 of 5 zones not processed",
    },
    {
      id: "esc-006", payerAddress: "0x7a3B...0a1", payeeAddress: "0x6f8H...2i4", payeeName: "Optimus Gen-2",
      taskDescription: "Factory floor assembly line setup and calibration",
      amount: "1,200", currency: "ORB", status: "created", createdAt: new Date(now - 3600000).toISOString(),
    },
  ];
}

export default function Escrow() {
  useSEO({ title: "Agent Escrow", description: "Secure agent-to-agent escrow for trustless task execution and payment on ORBIT Protocol." });

  const [escrows, setEscrows] = useState<Escrow[]>(generateSimulatedEscrows);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<typeof SIMULATED_AGENTS[0] | null>(null);
  const [taskDesc, setTaskDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [activeTab, setActiveTab] = useState<"active" | "history">("active");
  const [disputeId, setDisputeId] = useState<string | null>(null);
  const [disputeReason, setDisputeReason] = useState("");
  const { toast } = useToast();

  const activeEscrows = escrows.filter((e) => ["created", "funded", "in_progress"].includes(e.status));
  const historyEscrows = escrows.filter((e) => ["completed", "released", "disputed", "cancelled"].includes(e.status));

  const stats = {
    total: escrows.length,
    active: activeEscrows.length,
    totalLocked: activeEscrows.reduce((sum, e) => sum + parseFloat(e.amount.replace(",", "")), 0),
    completed: escrows.filter((e) => e.status === "completed" || e.status === "released").length,
  };

  const handleCreate = () => {
    if (!selectedAgent || !taskDesc || !amount) {
      toast({ title: "Missing fields", description: "Please fill in all fields", variant: "destructive" });
      return;
    }
    const newEscrow: Escrow = {
      id: `esc-${String(escrows.length + 1).padStart(3, "0")}`,
      payerAddress: "0xYour...Wallet",
      payeeAddress: selectedAgent.address.slice(0, 6) + "..." + selectedAgent.address.slice(-3),
      payeeName: selectedAgent.name,
      taskDescription: taskDesc,
      amount,
      currency: "ORB",
      status: "created",
      createdAt: new Date().toISOString(),
    };
    setEscrows((prev) => [newEscrow, ...prev]);
    setShowCreateForm(false);
    setSelectedAgent(null);
    setTaskDesc("");
    setAmount("");
    toast({ title: "Escrow created", description: `Escrow ${newEscrow.id} created for ${selectedAgent.name}` });
  };

  const handleFund = (id: string) => {
    setEscrows((prev) => prev.map((e) => (e.id === id ? { ...e, status: "funded" as EscrowStatus, fundedAt: new Date().toISOString() } : e)));
    toast({ title: "Escrow funded", description: `Funds locked in escrow ${id}` });
  };

  const handleRelease = (id: string) => {
    setEscrows((prev) => prev.map((e) => (e.id === id ? { ...e, status: "released" as EscrowStatus, releasedAt: new Date().toISOString() } : e)));
    toast({ title: "Funds released", description: `Payment released from escrow ${id}` });
  };

  const handleDispute = (id: string) => {
    if (!disputeReason) {
      toast({ title: "Dispute reason required", variant: "destructive" });
      return;
    }
    setEscrows((prev) => prev.map((e) => (e.id === id ? { ...e, status: "disputed" as EscrowStatus, disputeReason } : e)));
    setDisputeId(null);
    setDisputeReason("");
    toast({ title: "Dispute filed", description: `Dispute opened for escrow ${id}` });
  };

  const formatDate = (ts: string) => new Date(ts).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

  const displayEscrows = activeTab === "active" ? activeEscrows : historyEscrows;

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-orange-500" />
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight" data-testid="text-escrow-title">
                Agent Escrow
              </h1>
            </div>
            <Button onClick={() => setShowCreateForm(true)} className="bg-orange-500 hover:bg-orange-600 text-white gap-2" data-testid="button-create-escrow">
              <Plus className="w-4 h-4" />
              New Escrow
            </Button>
          </div>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl" data-testid="text-escrow-subtitle">
            Trustless agent-to-agent payments. Lock funds in escrow, define tasks, and release on completion. Dispute resolution built in.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/[0.02] border-border/30">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-foreground font-mono" data-testid="text-total-escrows">{stats.total}</div>
              <div className="text-xs text-muted-foreground mt-1">Total Escrows</div>
            </CardContent>
          </Card>
          <Card className="bg-white/[0.02] border-border/30">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-500 font-mono" data-testid="text-active-escrows">{stats.active}</div>
              <div className="text-xs text-muted-foreground mt-1">Active</div>
            </CardContent>
          </Card>
          <Card className="bg-white/[0.02] border-border/30">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-foreground font-mono" data-testid="text-locked-value">{stats.totalLocked.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground mt-1">ORB Locked</div>
            </CardContent>
          </Card>
          <Card className="bg-white/[0.02] border-border/30">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-400 font-mono" data-testid="text-completed-escrows">{stats.completed}</div>
              <div className="text-xs text-muted-foreground mt-1">Completed</div>
            </CardContent>
          </Card>
        </motion.div>

        <AnimatePresence>
          {showCreateForm && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mb-8">
              <Card className="bg-white/[0.02] border-orange-500/30">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-foreground">Create New Escrow</CardTitle>
                    <button onClick={() => setShowCreateForm(false)} data-testid="button-close-create">
                      <X className="w-5 h-5 text-muted-foreground hover:text-foreground" />
                    </button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <span className="text-xs text-muted-foreground font-mono tracking-wider uppercase mb-2 block">Select Agent</span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {SIMULATED_AGENTS.map((agent) => (
                        <button
                          key={agent.address}
                          onClick={() => setSelectedAgent(agent)}
                          className={`p-3 rounded-md border text-left transition-colors ${selectedAgent?.address === agent.address ? "border-orange-500 bg-orange-500/10" : "border-border/30 bg-white/[0.02] hover:border-border/50"}`}
                          data-testid={`button-select-agent-${agent.name.toLowerCase().replace(/\s/g, "-")}`}
                        >
                          <div className="text-sm font-medium text-foreground">{agent.name}</div>
                          <div className="text-[10px] text-muted-foreground font-mono">{agent.type}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground font-mono tracking-wider uppercase mb-2 block">Task Description</span>
                    <Input
                      value={taskDesc}
                      onChange={(e) => setTaskDesc(e.target.value)}
                      placeholder="Describe the task to be completed..."
                      className="bg-white/[0.02] border-border/30"
                      data-testid="input-task-description"
                    />
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground font-mono tracking-wider uppercase mb-2 block">Amount (ORB)</span>
                    <Input
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="100"
                      type="number"
                      className="bg-white/[0.02] border-border/30"
                      data-testid="input-escrow-amount"
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button onClick={handleCreate} className="bg-orange-500 hover:bg-orange-600 text-white gap-2" data-testid="button-confirm-create">
                      <Lock className="w-4 h-4" />
                      Create Escrow
                    </Button>
                    <Button variant="outline" onClick={() => setShowCreateForm(false)} className="border-border/30" data-testid="button-cancel-create">
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setActiveTab("active")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === "active" ? "bg-orange-500 text-white" : "bg-white/[0.05] text-muted-foreground hover:text-foreground"}`}
              data-testid="tab-active-escrows"
            >
              Active ({activeEscrows.length})
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === "history" ? "bg-orange-500 text-white" : "bg-white/[0.05] text-muted-foreground hover:text-foreground"}`}
              data-testid="tab-history-escrows"
            >
              History ({historyEscrows.length})
            </button>
          </div>

          <div className="space-y-4">
            {displayEscrows.map((escrow, index) => {
              const statusConfig = STATUS_CONFIG[escrow.status];
              const StatusIcon = statusConfig.icon;

              return (
                <motion.div key={escrow.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                  <Card className="bg-white/[0.02] border-border/30 hover:border-border/50 transition-colors" data-testid={`card-escrow-${escrow.id}`}>
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-xs text-muted-foreground font-mono">{escrow.id}</span>
                            <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${statusConfig.color}`}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {statusConfig.label}
                            </Badge>
                          </div>
                          <h3 className="text-base font-medium text-foreground mb-2">{escrow.taskDescription}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                            <span className="font-mono text-xs">{escrow.payerAddress}</span>
                            <ArrowRight className="w-3 h-3 text-orange-500" />
                            <span className="text-foreground font-medium">{escrow.payeeName}</span>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>Created: {formatDate(escrow.createdAt)}</span>
                            {escrow.fundedAt && <span>Funded: {formatDate(escrow.fundedAt)}</span>}
                            {escrow.completedAt && <span>Completed: {formatDate(escrow.completedAt)}</span>}
                            {escrow.releasedAt && <span>Released: {formatDate(escrow.releasedAt)}</span>}
                          </div>
                          {escrow.disputeReason && (
                            <div className="mt-2 p-2 rounded-md bg-red-500/10 border border-red-500/20 text-xs text-red-400">
                              <AlertTriangle className="w-3 h-3 inline mr-1" />
                              Dispute: {escrow.disputeReason}
                            </div>
                          )}
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-xl font-bold text-foreground font-mono" data-testid={`text-amount-${escrow.id}`}>
                            {escrow.amount}
                          </div>
                          <div className="text-xs text-orange-500 font-mono">{escrow.currency}</div>
                          <div className="mt-3 flex flex-col gap-2">
                            {escrow.status === "created" && (
                              <Button size="sm" onClick={() => handleFund(escrow.id)} className="bg-blue-500 hover:bg-blue-600 text-white text-xs" data-testid={`button-fund-${escrow.id}`}>
                                <Lock className="w-3 h-3 mr-1" />
                                Fund
                              </Button>
                            )}
                            {(escrow.status === "funded" || escrow.status === "in_progress") && (
                              <>
                                <Button size="sm" onClick={() => handleRelease(escrow.id)} className="bg-green-500 hover:bg-green-600 text-white text-xs" data-testid={`button-release-${escrow.id}`}>
                                  <Unlock className="w-3 h-3 mr-1" />
                                  Release
                                </Button>
                                {disputeId === escrow.id ? (
                                  <div className="space-y-2">
                                    <Input
                                      value={disputeReason}
                                      onChange={(e) => setDisputeReason(e.target.value)}
                                      placeholder="Reason for dispute"
                                      className="text-xs h-7 bg-white/[0.02] border-border/30"
                                      data-testid={`input-dispute-reason-${escrow.id}`}
                                    />
                                    <div className="flex gap-1">
                                      <Button size="sm" variant="destructive" onClick={() => handleDispute(escrow.id)} className="text-xs h-7 flex-1" data-testid={`button-confirm-dispute-${escrow.id}`}>
                                        File
                                      </Button>
                                      <Button size="sm" variant="outline" onClick={() => { setDisputeId(null); setDisputeReason(""); }} className="text-xs h-7 border-border/30" data-testid={`button-cancel-dispute-${escrow.id}`}>
                                        Cancel
                                      </Button>
                                    </div>
                                  </div>
                                ) : (
                                  <Button size="sm" variant="outline" onClick={() => setDisputeId(escrow.id)} className="border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs" data-testid={`button-dispute-${escrow.id}`}>
                                    <AlertTriangle className="w-3 h-3 mr-1" />
                                    Dispute
                                  </Button>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}

            {displayEscrows.length === 0 && (
              <Card className="bg-white/[0.02] border-border/30">
                <CardContent className="p-12 text-center">
                  <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">{activeTab === "active" ? "No active escrows" : "No escrow history"}</p>
                  {activeTab === "active" && (
                    <Button onClick={() => setShowCreateForm(true)} className="mt-4 bg-orange-500 hover:bg-orange-600 text-white gap-2" data-testid="button-create-escrow-empty">
                      <Plus className="w-4 h-4" />
                      Create Your First Escrow
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-12">
          <h2 className="text-xl font-bold text-foreground mb-4">How Agent Escrow Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { step: "1", title: "Create", desc: "Select an agent, define the task, and set the payment amount", icon: FileText },
              { step: "2", title: "Fund", desc: "Lock ORB tokens in the smart contract escrow", icon: Lock },
              { step: "3", title: "Execute", desc: "Agent completes the task with verifiable proof", icon: Activity },
              { step: "4", title: "Release", desc: "Approve completion and release funds to the agent", icon: Unlock },
            ].map((item) => (
              <Card key={item.step} className="bg-white/[0.02] border-border/30" data-testid={`card-step-${item.step}`}>
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-md bg-orange-500/10 flex items-center justify-center text-orange-500 font-bold text-sm">
                      {item.step}
                    </div>
                    <item.icon className="w-5 h-5 text-orange-500" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground mb-1">{item.title}</h3>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
