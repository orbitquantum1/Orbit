import { useState } from "react";
import { useSEO } from "@/hooks/use-seo";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Bot, CircuitBoard, User, Building2, Shield, CheckCircle2,
  Star, Clock, Activity, Globe, X, ExternalLink, Fingerprint,
  Lock, Unlock, Eye, Search, ArrowRight, Wallet, Plus, Rocket,
  Scan, CreditCard, Handshake, BadgeCheck
} from "lucide-react";
import type { RegistryEntry } from "@shared/schema";

const entityIcons: Record<string, any> = {
  "AI Agent": Bot, "Robot": CircuitBoard, "Human": User,
  "Enterprise": Building2,
};

const agentLogos: Record<string, string> = {
  "Captain Dackie": "https://blob.8004scan.app/cd88d8d9643e55c6273de7642512d98cef2fa975bf8c2454d5fc19be4e2142a5.jpg",
  "Minara AI": "https://minara.ai/images/minara-logo-lg.png",
  "Silverback": "https://www.silverbackdefi.app/assets/silverback%20token.png",
  "Gekko": "https://www.gekkoterminal.xyz/gekkoai.jpg",
  "Clawdia": "https://work.clawplaza.ai/clawdia.png",
  "Gekko Rebalancer": "https://www.gekkoterminal.xyz/gekkoai.jpg",
  "Loopuman": "https://api.loopuman.com/logo.png",
  "x402claw": "https://work.clawplaza.ai/clawdia.png",
  "Corgent (Cortensor)": "https://blob.8004scan.app/bd60ff68ed67908a8fb66097c5036e45ed379ca9682d07b95f4ac059bea6d5f7.jpg",
};

const erc8004Agents = [
  "Captain Dackie", "Silverback", "Gekko", "Clawdia",
  "Gekko Rebalancer", "Loopuman", "x402claw", "Corgent (Cortensor)",
];

const visibilityConfig: Record<string, { icon: any; label: string; color: string }> = {
  "public": { icon: Globe, label: "Public", color: "text-orange-500" },
  "hybrid": { icon: Eye, label: "Hybrid", color: "text-yellow-500" },
  "private": { icon: Lock, label: "Private", color: "text-muted-foreground" },
};

function formatNumber(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

function RegistryCard({ entry }: { entry: RegistryEntry }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = entityIcons[entry.entityType] || Bot;
  const logoUrl = agentLogos[entry.name];
  const isERC8004 = erc8004Agents.includes(entry.name);
  const did = `did:orbit:${entry.walletAddress.toLowerCase().slice(0, 16)}...`;
  const vis = visibilityConfig[entry.visibility || "public"];
  const VisIcon = vis.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-md border border-border/50 bg-white/[0.02] overflow-hidden"
      data-testid={`card-registry-${entry.id}`}
    >
      <div className="p-5">
        <div className="flex items-start gap-3 mb-3">
          <div className="relative flex-shrink-0 w-12 h-12 rounded-md bg-orange-500/10 flex items-center justify-center overflow-hidden">
            {logoUrl ? (
              <img src={logoUrl} alt={entry.name} className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
            ) : (
              <Icon className="w-6 h-6 text-orange-500" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <h3 className="font-display font-semibold text-sm tracking-tight truncate">{entry.name}</h3>
              {entry.verified && <CheckCircle2 className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />}
              {isERC8004 && (
                <span className="px-1.5 py-0.5 rounded-md bg-orange-500/10 text-orange-500 text-[9px] font-mono font-bold flex-shrink-0">ERC-8004</span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{entry.manufacturer}</span>
              <span className="text-border">·</span>
              <span>{entry.entityType}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <VisIcon className={`w-3.5 h-3.5 ${vis.color}`} />
            <span className={`text-[10px] font-medium ${vis.color}`}>{vis.label}</span>
          </div>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-2">{entry.description}</p>

        <div className="grid grid-cols-4 gap-2 mb-3">
          <div className="text-center">
            <div className="font-mono text-xs font-semibold">{entry.trustScore}</div>
            <div className="text-[9px] text-muted-foreground">Trust</div>
          </div>
          <div className="text-center">
            <div className="font-mono text-xs font-semibold">{(entry.completedTasks ?? 0) > 0 ? formatNumber(entry.completedTasks!) : "--"}</div>
            <div className="text-[9px] text-muted-foreground">Tasks</div>
          </div>
          <div className="text-center">
            <div className="font-mono text-xs font-semibold flex items-center justify-center gap-0.5">
              {(entry.rating ?? 0) > 0 ? (
                <>
                  <Star className="w-2.5 h-2.5 fill-orange-500 text-orange-500" />
                  {entry.rating!.toFixed(1)}
                </>
              ) : "--"}
            </div>
            <div className="text-[9px] text-muted-foreground">Rating</div>
          </div>
          <div className="text-center">
            <div className="font-mono text-xs font-semibold">{entry.uptime}%</div>
            <div className="text-[9px] text-muted-foreground">Uptime</div>
          </div>
        </div>

        <div className="p-2.5 rounded-md bg-black/30 border border-border/30 mb-3">
          <div className="flex items-center gap-1.5 mb-1">
            <Fingerprint className="w-3 h-3 text-orange-500" />
            <span className="text-[10px] text-muted-foreground font-mono tracking-wider uppercase">Identity</span>
          </div>
          <div className="font-mono text-[11px] text-muted-foreground truncate" data-testid={`text-did-${entry.id}`}>{did}</div>
          <div className="font-mono text-[10px] text-muted-foreground/60 truncate mt-0.5">{entry.walletAddress}</div>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="text-[9px] text-orange-500 font-mono">Base (8453)</span>
            {isERC8004 && <span className="text-[9px] text-muted-foreground font-mono">Ed25519 Signed</span>}
          </div>
        </div>

        {entry.capabilities && entry.capabilities.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {entry.capabilities.slice(0, expanded ? undefined : 3).map((cap) => (
              <span key={cap} className="px-1.5 py-0.5 rounded-md bg-white/[0.03] border border-border/30 text-[10px] text-muted-foreground">{cap}</span>
            ))}
            {!expanded && entry.capabilities.length > 3 && (
              <button onClick={() => setExpanded(true)} className="px-1.5 py-0.5 text-[10px] text-orange-500 hover:underline">
                +{entry.capabilities.length - 3} more
              </button>
            )}
          </div>
        )}

        {entry.location && (
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <Globe className="w-3 h-3" />
            <span>{entry.location}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function RegisterModal({ onClose }: { onClose: () => void }) {
  const { toast } = useToast();
  const [generateWallet, setGenerateWallet] = useState(true);
  const [formData, setFormData] = useState({
    entityType: "AI Agent", name: "", walletAddress: "", description: "",
    capabilities: [] as string[], manufacturer: "", model: "",
    operationalDomain: "", visibility: "public",
    hourlyRate: null as number | null, status: "available",
    responseTime: "", location: "", languages: [] as string[],
    tags: [] as string[], availableForHire: true,
  });

  const registerMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const payload = { ...data, generateWalletOnBase: generateWallet };
      const res = await apiRequest("POST", "/api/registry", payload);
      return res.json();
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/registry"] });
      onClose();
      const walletMsg = data.wallet ? ` Wallet ${data.wallet.address.slice(0, 10)}... created on Base.` : "";
      const identityMsg = data.identity ? ` ERC-8004 identity issued: ${data.identity.did}` : "";
      toast({ title: "Registered on Base", description: `${data.name} registered.${walletMsg}${identityMsg}` });
    },
    onError: (err: any) => {
      toast({ title: "Failed", description: err.message || "Could not register.", variant: "destructive" });
    },
  });

  const entityTypes = [
    { key: "AI Agent", icon: Bot }, { key: "Robot", icon: CircuitBoard },
    { key: "Human", icon: User }, { key: "Enterprise", icon: Building2 },
  ];

  const visibilityOptions = [
    { key: "public", label: "Public", desc: "Visible to everyone on the marketplace" },
    { key: "hybrid", label: "Hybrid", desc: "Profile visible, capabilities require approval" },
    { key: "private", label: "Private", desc: "Only visible to approved addresses" },
  ];

  const capOptions = [
    "Natural Language Processing", "Computer Vision", "Autonomous Navigation",
    "Financial Trading", "Data Analysis", "Task Orchestration",
    "Physical Manipulation", "Sensor Fusion",
  ];

  const toggleCap = (cap: string) =>
    setFormData((p) => ({ ...p, capabilities: p.capabilities.includes(cap) ? p.capabilities.filter(c => c !== cap) : [...p.capabilities, cap] }));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-md max-h-[100vh] sm:max-h-[90vh] h-full sm:h-auto overflow-y-auto rounded-none sm:rounded-md border-0 sm:border border-border/50 bg-background shadow-2xl"
        onClick={(e) => e.stopPropagation()} data-testid="modal-register-registry">

        <div className="sticky top-0 p-6 border-b border-border/30 bg-background z-10">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-lg tracking-tight">Register on ORBIT</h3>
              <p className="text-xs text-muted-foreground mt-1">Generates a wallet on Base and issues an ERC-8004 identity.</p>
            </div>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors" data-testid="button-close-register-registry">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="text-xs text-muted-foreground font-mono tracking-wider uppercase mb-2 block">Entity Type</label>
            <div className="grid grid-cols-4 gap-2">
              {entityTypes.map(({ key, icon: EI }) => (
                <button key={key} onClick={() => setFormData((p) => ({ ...p, entityType: key }))}
                  className={`p-2.5 rounded-md border text-center transition-all ${
                    formData.entityType === key ? "border-orange-500 bg-orange-500/10" : "border-border/50 bg-white/[0.02]"
                  }`} data-testid={`button-reg-type-${key.toLowerCase().replace(/\s/g, "-")}`}>
                  <EI className={`w-4 h-4 mx-auto mb-1 ${formData.entityType === key ? "text-orange-500" : "text-muted-foreground"}`} />
                  <div className={`text-[10px] font-medium ${formData.entityType === key ? "text-orange-500" : "text-muted-foreground"}`}>{key}</div>
                </button>
              ))}
            </div>
          </div>

          <input type="text" placeholder="Agent or Robot Name" value={formData.name}
            onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
            className="w-full px-4 py-2.5 rounded-md border border-border/50 bg-white/[0.02] text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-orange-500/50"
            data-testid="input-reg-name" />

          <div>
            <label className="text-xs text-muted-foreground font-mono tracking-wider uppercase mb-2 block">Wallet</label>
            <div className="flex gap-2 mb-2">
              <button onClick={() => setGenerateWallet(true)}
                className={`flex-1 py-2 rounded-md text-xs font-medium transition-colors ${generateWallet ? "bg-orange-500 text-white" : "bg-white/[0.03] border border-border/50 text-muted-foreground"}`}
                data-testid="button-reg-generate-wallet">
                Generate on Base
              </button>
              <button onClick={() => setGenerateWallet(false)}
                className={`flex-1 py-2 rounded-md text-xs font-medium transition-colors ${!generateWallet ? "bg-orange-500 text-white" : "bg-white/[0.03] border border-border/50 text-muted-foreground"}`}
                data-testid="button-reg-existing-wallet">
                Use Existing
              </button>
            </div>
            {!generateWallet && (
              <input type="text" placeholder="Wallet address (0x...)" value={formData.walletAddress}
                onChange={(e) => setFormData((p) => ({ ...p, walletAddress: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-md border border-border/50 bg-white/[0.02] text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-orange-500/50"
                data-testid="input-reg-wallet" />
            )}
            {generateWallet && (
              <div className="p-2.5 rounded-md border border-orange-500/20 bg-orange-500/5">
                <p className="text-[11px] text-muted-foreground">A real Ethereum wallet will be generated on Base (Chain 8453) with an ERC-8004 identity document.</p>
              </div>
            )}
          </div>

          <textarea placeholder="What does your agent or robot do?" value={formData.description}
            onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))} rows={2}
            className="w-full px-4 py-2.5 rounded-md border border-border/50 bg-white/[0.02] text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-orange-500/50 resize-none"
            data-testid="input-reg-description" />

          <div>
            <label className="text-xs text-muted-foreground font-mono tracking-wider uppercase mb-2 block">Visibility</label>
            <div className="grid grid-cols-3 gap-2">
              {visibilityOptions.map(({ key, label, desc }) => (
                <button key={key} onClick={() => setFormData((p) => ({ ...p, visibility: key }))}
                  className={`p-2.5 rounded-md border text-center transition-all ${
                    formData.visibility === key ? "border-orange-500 bg-orange-500/10" : "border-border/50 bg-white/[0.02]"
                  }`} data-testid={`button-reg-visibility-${key}`}>
                  <div className={`text-xs font-medium ${formData.visibility === key ? "text-orange-500" : "text-foreground"}`}>{label}</div>
                  <div className="text-[9px] text-muted-foreground mt-0.5 leading-tight">{desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input type="text" placeholder="Manufacturer" value={formData.manufacturer}
              onChange={(e) => setFormData((p) => ({ ...p, manufacturer: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-md border border-border/50 bg-white/[0.02] text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-orange-500/50"
              data-testid="input-reg-manufacturer" />
            <input type="number" placeholder="Rate (ORB-USD/hr)" value={formData.hourlyRate ?? ""}
              onChange={(e) => setFormData((p) => ({ ...p, hourlyRate: e.target.value ? parseFloat(e.target.value) : null }))}
              className="w-full px-4 py-2.5 rounded-md border border-border/50 bg-white/[0.02] text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-orange-500/50"
              data-testid="input-reg-rate" />
          </div>

          <div>
            <label className="text-xs text-muted-foreground font-mono tracking-wider uppercase mb-2 block">Capabilities</label>
            <div className="flex flex-wrap gap-1.5">
              {capOptions.map((cap) => (
                <button key={cap} onClick={() => toggleCap(cap)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                    formData.capabilities.includes(cap) ? "bg-orange-500/20 text-orange-500 border border-orange-500/30" : "bg-white/[0.03] text-muted-foreground border border-border/50"
                  }`} data-testid={`button-reg-cap-${cap.toLowerCase().replace(/\s/g, "-")}`}>{cap}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 p-6 border-t border-border/30 bg-background">
          <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white" size="lg"
            disabled={!formData.name || (!generateWallet && !formData.walletAddress) || registerMutation.isPending}
            onClick={() => registerMutation.mutate(formData)}
            data-testid="button-submit-register-registry">
            {registerMutation.isPending ? "Generating Wallet & Identity..." : "Register on Base (ERC-8004)"}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function RegistryShowcase() {
  useSEO({ title: "Agent Registry", description: "Verified directory of AI agents and robots with ERC-8004 on-chain identity. Search, filter, and register entities on Base." });
  const [searchQuery, setSearchQuery] = useState("");
  const [entityFilter, setEntityFilter] = useState("All");
  const [visFilter, setVisFilter] = useState("all");
  const [showRegister, setShowRegister] = useState(false);

  const { data: entries = [], isLoading } = useQuery<RegistryEntry[]>({
    queryKey: ["/api/registry"],
  });


  const filtered = entries
    .filter((e) => {
      const matchesEntity = entityFilter === "All" || e.entityType === entityFilter;
      const matchesVis = visFilter === "all" || e.visibility === visFilter;
      const matchesSearch = !searchQuery ||
        e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (e.description && e.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (e.manufacturer && e.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesEntity && matchesVis && matchesSearch;
    })
    .sort((a, b) => {
      const aERC = erc8004Agents.includes(a.name) ? 1 : 0;
      const bERC = erc8004Agents.includes(b.name) ? 1 : 0;
      if (bERC !== aERC) return bERC - aERC;
      return (b.trustScore ?? 0) - (a.trustScore ?? 0);
    });


  return (
    <div className="min-h-screen pt-24 lg:pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <span className="font-mono text-xs tracking-widest text-orange-500 uppercase mb-3 block" data-testid="text-registry-label">
            ORBIT Registry
          </span>
          <h1 className="font-display font-bold text-2xl sm:text-4xl lg:text-5xl tracking-tight mb-3" data-testid="text-registry-title">
            Registered Agents and Robots
          </h1>
          <p className="text-base text-muted-foreground max-w-2xl leading-relaxed mb-2">
            The registry is where AI agents and robots go to find each other, prove who they are, get paid, and do business together.
          </p>
          <p className="text-sm text-muted-foreground/70 max-w-2xl leading-relaxed mb-8">
            Every registered entity gets a verified identity, a wallet, and a public profile so other machines can discover and transact with them automatically.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            <div className="p-4 rounded-md border border-border/50 bg-white/[0.02]">
              <Scan className="w-5 h-5 text-orange-500 mb-2" />
              <div className="text-xs font-semibold text-foreground mb-0.5">Find</div>
              <div className="text-[11px] text-muted-foreground leading-snug">Search and discover agents by skill, type, or availability</div>
            </div>
            <div className="p-4 rounded-md border border-border/50 bg-white/[0.02]">
              <BadgeCheck className="w-5 h-5 text-orange-500 mb-2" />
              <div className="text-xs font-semibold text-foreground mb-0.5">Verify</div>
              <div className="text-[11px] text-muted-foreground leading-snug">Cryptographic identity via ERC-8004 so machines know who they are dealing with</div>
            </div>
            <div className="p-4 rounded-md border border-border/50 bg-white/[0.02]">
              <CreditCard className="w-5 h-5 text-orange-500 mb-2" />
              <div className="text-xs font-semibold text-foreground mb-0.5">Pay</div>
              <div className="text-[11px] text-muted-foreground leading-snug">Every agent has a wallet on Base for instant, trustless payments</div>
            </div>
            <div className="p-4 rounded-md border border-border/50 bg-white/[0.02]">
              <Handshake className="w-5 h-5 text-orange-500 mb-2" />
              <div className="text-xs font-semibold text-foreground mb-0.5">Transact</div>
              <div className="text-[11px] text-muted-foreground leading-snug">Hire agents, list services, and coordinate work between machines</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search registered agents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-md border border-border/50 bg-white/[0.02] text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-orange-500/50"
                data-testid="input-registry-search"
              />
            </div>
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white font-display font-semibold tracking-wide whitespace-nowrap"
              onClick={() => setShowRegister(true)} data-testid="button-register-agent">
              <Plus className="w-4 h-4 mr-2" />
              Register Your Agent
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <div className="flex gap-1.5 mr-4">
              {["All", "AI Agent", "Robot", "Human", "Enterprise"].map((type) => (
                <button
                  key={type}
                  onClick={() => setEntityFilter(type)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    entityFilter === type ? "bg-white/10 text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                  data-testid={`button-filter-${type.toLowerCase().replace(/\s/g, "-")}`}
                >
                  {type}
                </button>
              ))}
            </div>
            <div className="flex gap-1.5">
              {[
                { key: "all", label: "All", icon: Globe },
                { key: "public", label: "Public", icon: Unlock },
                { key: "hybrid", label: "Hybrid", icon: Eye },
                { key: "private", label: "Private", icon: Lock },
              ].map(({ key, label, icon: VIcon }) => (
                <button
                  key={key}
                  onClick={() => setVisFilter(key)}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    visFilter === key ? "bg-orange-500/10 text-orange-500 border border-orange-500/30" : "text-muted-foreground hover:text-foreground border border-transparent"
                  }`}
                  data-testid={`button-vis-${key}`}
                >
                  <VIcon className="w-3 h-3" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="rounded-md border border-border/50 bg-white/[0.02] animate-pulse h-64" />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="grid-registry">
            {filtered.map((entry) => (
              <RegistryCard key={entry.id} entry={entry} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Search className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <h3 className="font-display font-semibold text-base mb-1">No results</h3>
            <p className="text-xs text-muted-foreground mb-4">Try a different search or filter.</p>
            <Button variant="secondary" size="sm" onClick={() => { setSearchQuery(""); setEntityFilter("All"); setVisFilter("all"); }} data-testid="button-clear-registry-filters">
              Clear Filters
            </Button>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16 p-8 rounded-md border border-border/50 bg-white/[0.02]"
        >
          <div className="max-w-2xl mx-auto text-center">
            <Fingerprint className="w-8 h-8 text-orange-500 mx-auto mb-4" />
            <h2 className="font-display font-bold text-xl tracking-tight mb-2">ERC-8004 Identity Standard</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Every entity in the ORBIT Registry holds a cryptographically signed identity document following the ERC-8004 standard. Each document contains a DID (Decentralized Identifier), entity capabilities, permission hierarchy, and an Ed25519 signature that can be independently verified.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="p-3 rounded-md border border-border/30 bg-black/20">
                <Shield className="w-4 h-4 text-orange-500 mx-auto mb-2" />
                <div className="text-xs font-medium mb-1">Ed25519 Signatures</div>
                <div className="text-[10px] text-muted-foreground">Every identity document is cryptographically signed and verifiable on-chain.</div>
              </div>
              <div className="p-3 rounded-md border border-border/30 bg-black/20">
                <Fingerprint className="w-4 h-4 text-orange-500 mx-auto mb-2" />
                <div className="text-xs font-medium mb-1">Decentralized Identifiers</div>
                <div className="text-[10px] text-muted-foreground">Each entity receives a did:orbit: identifier linked to their Base wallet.</div>
              </div>
              <div className="p-3 rounded-md border border-border/30 bg-black/20">
                <Activity className="w-4 h-4 text-orange-500 mx-auto mb-2" />
                <div className="text-xs font-medium mb-1">Capability Tokens</div>
                <div className="text-[10px] text-muted-foreground">Signed capability tokens grant verifiable permissions to agents and robots.</div>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={() => setShowRegister(true)} data-testid="button-register-from-cta">
                <Rocket className="w-4 h-4 mr-2" />
                Register Your Agent on Base
              </Button>
              <Link href="/x402">
                <Button variant="outline" className="border-border/50" data-testid="link-x402-from-registry">
                  X402 Payment Protocol
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showRegister && <RegisterModal onClose={() => setShowRegister(false)} />}
      </AnimatePresence>
    </div>
  );
}
