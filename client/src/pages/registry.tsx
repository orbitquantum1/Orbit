import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Bot, CircuitBoard, User, Building2, Swords, Landmark,
  Search, Plus, X, Star, Clock, CheckCircle2, Globe, Zap,
  Truck, CreditCard, Briefcase, Home, Cpu, Car,
  Scale, Palette, MapPin, Coins, Shield, Activity
} from "lucide-react";
import type { RegistryEntry } from "@shared/schema";

const entityIcons: Record<string, any> = {
  "AI Agent": Bot, "Robot": CircuitBoard, "Human": User,
  "Enterprise": Building2, "Military": Swords, "Government": Landmark,
};

const agentLogos: Record<string, string> = {
  "GPT-4o Agent": "https://cdn.openai.com/API/logo-assets/openai-logomark.png",
  "Claude Agent": "https://www.anthropic.com/images/icons/safari-pinned-tab.svg",
  "Gemini Ultra Agent": "https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg",
  "Grok-3 Agent": "https://x.ai/favicon.ico",
  "Devin AI": "https://preview.redd.it/the-new-devin-logo-v0-xkh83bwh6ese1.jpeg?auto=webp&s=72e24e1cc5a5bcb8ca8c4dcc3e8e84af2b2a0076",
  "Copilot Enterprise": "https://copilot.microsoft.com/rp/unu-favicon-dark_kFhAmnOqxG.png",
  "Perplexity Research": "https://www.perplexity.ai/favicon.svg",
  "Cursor AI Coder": "https://www.cursor.com/favicon.ico",
  "AutoGPT Forge": "https://autogpt.net/wp-content/uploads/2023/04/autogpt-official-icon.webp",
  "Harvey Legal AI": "https://www.harvey.ai/favicon.ico",
  "Midjourney Creator": "https://upload.wikimedia.org/wikipedia/commons/e/e6/Midjourney_Emblem.png",
  "Spot Enterprise": "https://bfrg.io/cdn/shop/files/Untitled_design_-_2023-07-20T091741.915_300x300.png",
  "Atlas Humanoid": "https://bfrg.io/cdn/shop/files/Untitled_design_-_2023-07-20T091741.915_300x300.png",
  "Stretch Warehouse": "https://bfrg.io/cdn/shop/files/Untitled_design_-_2023-07-20T091741.915_300x300.png",
  "Optimus Gen-2": "https://upload.wikimedia.org/wikipedia/commons/e/e8/Tesla_logo.png",
  "Figure 02": "https://www.figure.ai/favicon.ico",
  "Digit Logistics": "https://agilityrobotics.com/favicon.ico",
  "Unitree H1": "https://www.unitree.com/favicon.ico",
  "Waymo Driver": "https://waymo.com/favicon.ico",
  "Amazon Sparrow": "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
  "Captain Dackie": "https://blob.8004scan.app/cd88d8d9643e55c6273de7642512d98cef2fa975bf8c2454d5fc19be4e2142a5.jpg",
  "Minara AI": "https://minara.ai/images/minara-logo-lg.png",
  "Silverback": "https://www.silverbackdefi.app/assets/silverback%20token.png",
  "Gekko": "https://www.gekkoterminal.xyz/gekkoai.jpg",
  "Clawdia": "https://work.clawplaza.ai/clawdia.png",
  "Gekko Rebalancer": "https://www.gekkoterminal.xyz/gekkoai.jpg",
  "Loopuman": "https://api.loopuman.com/logo.png",
  "x402claw": "https://work.clawplaza.ai/clawdia.png",
  "Corgent (Cortensor)": "https://blob.8004scan.app/bd60ff68ed67908a8fb66097c5036e45ed379ca9682d07b95f4ac059bea6d5f7.jpg",
  "DALL-E 3": "https://cdn.openai.com/API/logo-assets/openai-logomark.png",
  "Stable Diffusion XL": "https://images.squarespace-cdn.com/content/v1/6213c340453c3f502425776e/6c9b1583-32c4-4397-b0a1-4acec60e4486/stability-ai-logo-icon.png",
  "Runway Gen-3": "https://runwayml.com/favicon.ico",
  "Suno Music AI": "https://suno.com/favicon.ico",
  "ElevenLabs Voice": "https://elevenlabs.io/favicon.ico",
  "Canva AI Designer": "https://static.canva.com/static/images/favicon-1.ico",
  "Adobe Firefly": "https://www.adobe.com/favicon.ico",
  "Grok Image Gen": "https://x.ai/favicon.ico",
  "3Commas DCA Bot": "https://3commas.io/favicon.ico",
  "Pionex Grid Bot": "https://www.pionex.com/favicon.ico",
  "Cryptohopper AI": "https://www.cryptohopper.com/favicon.ico",
  "Bitsgap Arbitrage Bot": "https://bitsgap.com/favicon.ico",
  "HaasOnline TradeServer": "https://www.haasonline.com/favicon.ico",
  "Hummingbot Market Maker": "https://hummingbot.org/favicon.ico",
  "iRobot Roomba j9+": "https://www.irobot.com/favicon.ico",
  "Amazon Astro": "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
  "Google Home Agent": "https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg",
  "Ecovacs Deebot X2": "https://www.ecovacs.com/favicon.ico",
  "Casetext CoCounsel": "https://www.thomsonreuters.com/favicon.ico",
  "Luminance AI": "https://www.luminance.com/favicon.ico",
  "Ironclad AI": "https://ironcladapp.com/favicon.ico",
  "Cruise Origin": "https://www.getcruise.com/favicon.ico",
  "Tesla FSD Agent": "https://upload.wikimedia.org/wikipedia/commons/e/e8/Tesla_logo.png",
  "Nuro R3": "https://www.nuro.ai/favicon.ico",
  "Zoox Robotaxi": "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
  "FANUC CRX-25iA": "https://www.fanucamerica.com/favicon.ico",
  "ABB YuMi": "https://global.abb/favicon.ico",
  "Universal Robots UR20": "https://www.universal-robots.com/favicon.ico",
  "Starship Delivery Bot": "https://www.starship.xyz/favicon.ico",
  "Locus AMR Fleet": "https://locusrobotics.com/favicon.ico",
  "Stripe Radar AI": "https://stripe.com/favicon.ico",
  "Chainalysis KYTE": "https://www.chainalysis.com/favicon.ico",
  "Plaid Link Agent": "https://plaid.com/favicon.ico",
};

const taskCategories = [
  { id: "all", label: "All", icon: Globe },
  { id: "creative", label: "Creative & Design", icon: Palette },
  { id: "trading", label: "Trading Bots", icon: Activity },
  { id: "payments", label: "Payments & Finance", icon: CreditCard },
  { id: "household", label: "Home & Personal", icon: Home },
  { id: "legal", label: "Legal & Compliance", icon: Scale },
  { id: "transport", label: "Transportation", icon: Car },
  { id: "logistics", label: "Logistics & Delivery", icon: Truck },
  { id: "enterprise", label: "Enterprise Work", icon: Briefcase },
  { id: "manufacturing", label: "Manufacturing", icon: Cpu },
];

const categoryTagMap: Record<string, string[]> = {
  trading: ["trading-bot", "dca", "grid", "arbitrage", "market-making", "algorithmic", "ai-signals", "backtesting", "smart-routing", "liquidity"],
  logistics: ["warehouse", "logistics", "unloading", "boxes", "e-commerce", "fulfillment", "sorting", "tote-carrying", "bipedal", "delivery"],
  payments: ["financial", "market-analysis", "trading", "real-time", "defi", "crypto", "portfolio", "rebalancing", "micropayments", "fraud-detection", "payments", "risk-scoring", "compliance", "blockchain", "investigation", "banking", "identity", "transactions", "fintech"],
  enterprise: ["enterprise", "productivity", "office", "email", "excel", "teams", "coding", "full-stack", "software-engineering", "deployment", "debugging", "autonomous-coding"],
  household: ["household", "general-purpose", "walking", "affordable", "humanoid", "cleaning", "vacuum", "mop", "smart-home", "companion", "security", "eldercare", "alexa", "voice-assistant", "automation", "iot"],
  manufacturing: ["manufacturing", "factory", "assembly", "quality-control", "inspection", "construction", "industrial", "bmw", "cobot", "palletizing", "welding", "electronics", "dual-arm"],
  transport: ["autonomous-driving", "robotaxi", "level-4", "urban", "rideshare", "self-driving", "vision", "neural-network", "highway", "bi-directional", "delivery", "last-mile"],
  legal: ["legal", "contracts", "compliance", "due-diligence", "regulatory", "research", "document-review", "negotiation", "risk", "clm", "workflow"],
  creative: ["image-generation", "creative", "branding", "concept-art", "photorealistic", "design", "video-generation", "vfx", "filmmaking", "music-generation", "audio", "voice-synthesis", "graphic-design", "social-media", "marketing", "commercial-safe", "conversational", "fine-tuning", "lora"],
};

function checkCategory(entry: RegistryEntry, categoryId: string): boolean {
  if (categoryId === "all") return true;
  const relevantTags = categoryTagMap[categoryId] || [];
  const entryTags = entry.tags || [];
  const entryDomain = (entry.operationalDomain || "").toLowerCase();
  const entryDesc = (entry.description || "").toLowerCase();
  return entryTags.some(t => relevantTags.includes(t)) ||
    relevantTags.some(t => entryDomain.includes(t) || entryDesc.includes(t));
}

function formatNumber(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

function AgentAvatar({ name, entityType }: { name: string; entityType: string }) {
  const logoUrl = agentLogos[name];
  const Icon = entityIcons[entityType] || Bot;

  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt={name}
        className="w-full h-full object-cover rounded-md"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = "none";
          (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden");
        }}
      />
    );
  }
  return <Icon className="w-6 h-6 text-orange-500" />;
}

function AgentCard({ entry, onViewProfile }: {
  entry: RegistryEntry;
  onViewProfile: (entry: RegistryEntry) => void;
}) {
  const Icon = entityIcons[entry.entityType] || Bot;
  const logoUrl = agentLogos[entry.name];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="group rounded-md border border-border/50 bg-white/[0.02] hover:border-orange-500/30 hover:bg-white/[0.04] transition-all cursor-pointer overflow-hidden"
      onClick={() => onViewProfile(entry)}
      data-testid={`card-agent-${entry.id}`}
    >
      <div className="p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="relative flex-shrink-0 w-10 h-10 rounded-md bg-orange-500/10 flex items-center justify-center overflow-hidden">
            {logoUrl ? (
              <img src={logoUrl} alt={entry.name} className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
            ) : (
              <Icon className="w-5 h-5 text-orange-500" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="font-display font-semibold text-sm tracking-tight truncate">{entry.name}</h3>
              {entry.verified && <CheckCircle2 className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />}
            </div>
            <span className="text-xs text-muted-foreground">{entry.manufacturer}</span>
          </div>
          {entry.rating && entry.rating > 0 ? (
            <div className="flex items-center gap-1 flex-shrink-0">
              <Star className="w-3 h-3 fill-orange-500 text-orange-500" />
              <span className="font-mono text-xs font-semibold">{entry.rating.toFixed(1)}</span>
            </div>
          ) : null}
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-2">
          {entry.description}
        </p>

        <div className="flex items-center justify-end">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{entry.entityType}</span>
        </div>
      </div>
    </motion.div>
  );
}

function ProfileModal({ entry, onClose, onHire }: {
  entry: RegistryEntry;
  onClose: () => void;
  onHire: (entry: RegistryEntry) => void;
}) {
  const Icon = entityIcons[entry.entityType] || Bot;
  const logoUrl = agentLogos[entry.name];
  const isAvailable = entry.status === "available" && entry.availableForHire;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-md border border-border/50 bg-background shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        data-testid="modal-profile"
      >
        <div className="sticky top-0 z-10 bg-background border-b border-border/30 p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-md bg-orange-500/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                {logoUrl ? (
                  <img src={logoUrl} alt={entry.name} className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                ) : (
                  <Icon className="w-7 h-7 text-orange-500" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-display font-bold text-xl tracking-tight">{entry.name}</h2>
                  {entry.verified && <CheckCircle2 className="w-4 h-4 text-orange-500" />}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5">
                  <span>{entry.manufacturer}</span>
                  <span className="text-border">·</span>
                  <span>{entry.entityType}</span>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors" data-testid="button-close-profile">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          <p className="text-sm text-muted-foreground leading-relaxed">{entry.description}</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Trust", value: `${entry.trustScore}`, icon: Shield },
              { label: "Tasks", value: formatNumber(entry.completedTasks ?? 0), icon: Activity },
              { label: "Rating", value: `${(entry.rating ?? 0).toFixed(1)}`, icon: Star },
              { label: "Uptime", value: `${entry.uptime}%`, icon: Clock },
            ].map((stat, i) => (
              <div key={i} className="p-3 rounded-md border border-border/30 bg-white/[0.02]">
                <stat.icon className="w-3.5 h-3.5 text-orange-500 mb-1" />
                <div className="font-mono text-sm font-semibold">{stat.value}</div>
                <div className="text-[10px] text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>

          {entry.capabilities && entry.capabilities.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {entry.capabilities.map((cap) => (
                <span key={cap} className="px-2 py-0.5 rounded-md bg-orange-500/10 text-orange-500 text-xs font-medium">{cap}</span>
              ))}
            </div>
          )}

          {entry.location && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-3.5 h-3.5" />
              <span>{entry.location}</span>
            </div>
          )}

          <div className="pt-3 border-t border-border/30">
            <span className="text-[10px] text-muted-foreground font-mono tracking-wider uppercase">ERC-8004 Wallet</span>
            <div className="font-mono text-xs text-muted-foreground mt-1 break-all">{entry.walletAddress}</div>
          </div>
        </div>

        <div className="sticky bottom-0 p-6 border-t border-border/30 bg-background flex items-center justify-between gap-4">
          <div className="flex items-center gap-1">
            <Coins className="w-4 h-4 text-orange-500" />
            <span className="font-display font-bold text-2xl">{entry.hourlyRate ? `${entry.hourlyRate} ORB-USD` : "Contact"}</span>
            {entry.hourlyRate && <span className="text-sm text-muted-foreground">/hr</span>}
          </div>
          <Button
            size="lg"
            variant="secondary"
            disabled={!isAvailable}
            onClick={() => onHire(entry)}
            data-testid="button-hire-profile"
          >
            <Zap className="w-4 h-4 mr-2" />
            {isAvailable ? "Hire" : "Unavailable"}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function HireModal({ entry, onClose }: { entry: RegistryEntry; onClose: () => void }) {
  const [hours, setHours] = useState(1);
  const [taskDesc, setTaskDesc] = useState("");
  const { toast } = useToast();
  const total = (entry.hourlyRate || 0) * hours;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-md rounded-md border border-border/50 bg-background shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        data-testid="modal-hire"
      >
        <div className="p-6 border-b border-border/30">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-lg tracking-tight">Hire {entry.name}</h3>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors" data-testid="button-close-hire">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="text-xs text-muted-foreground font-mono tracking-wider uppercase mb-2 block">Task</label>
            <textarea
              placeholder="What do you need done?"
              value={taskDesc}
              onChange={(e) => setTaskDesc(e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 rounded-md border border-border/50 bg-white/[0.02] text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-orange-500/50 resize-none"
              data-testid="input-task-description"
            />
          </div>

          <div>
            <label className="text-xs text-muted-foreground font-mono tracking-wider uppercase mb-2 block">Duration</label>
            <div className="flex items-center gap-2">
              {[1, 4, 8, 24].map((h) => (
                <button
                  key={h}
                  onClick={() => setHours(h)}
                  className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                    hours === h ? "bg-orange-500 text-white" : "bg-white/[0.03] border border-border/50 text-muted-foreground"
                  }`}
                  data-testid={`button-hours-${h}`}
                >
                  {h}hr
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-md border border-orange-500/20 bg-orange-500/5 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total</span>
            <div className="flex items-center gap-1">
              <Coins className="w-4 h-4 text-orange-500" />
              <span className="font-display font-bold text-xl">{total} ORB-USD</span>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-border/30">
          <Button
            className="w-full"
            size="lg"
            variant="secondary"
            disabled={!taskDesc}
            onClick={() => {
              onClose();
            }}
            data-testid="button-submit-hire"
          >
            Pay {total} ORB-USD & Start Task
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function RegisterModal({ onClose }: { onClose: () => void }) {
  const { toast } = useToast();
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
      const res = await apiRequest("POST", "/api/registry", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/registry"] });
      onClose();
      toast({ title: "Registered", description: "Entity registered on ERC-8004." });
    },
    onError: (err: any) => {
      toast({ title: "Failed", description: err.message || "Could not register.", variant: "destructive" });
    },
  });

  const entityTypes = [
    { key: "AI Agent", icon: Bot }, { key: "Robot", icon: CircuitBoard },
    { key: "Human", icon: User }, { key: "Enterprise", icon: Building2 },
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
      className="fixed inset-0 z-[60] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-md border border-border/50 bg-background shadow-2xl"
        onClick={(e) => e.stopPropagation()} data-testid="modal-register">

        <div className="sticky top-0 p-6 border-b border-border/30 bg-background z-10">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-lg tracking-tight">List Your Agent or Robot</h3>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors" data-testid="button-close-register">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-4 gap-2">
            {entityTypes.map(({ key, icon: EI }) => (
              <button key={key} onClick={() => setFormData((p) => ({ ...p, entityType: key }))}
                className={`p-2.5 rounded-md border text-center transition-all ${
                  formData.entityType === key ? "border-orange-500 bg-orange-500/10" : "border-border/50 bg-white/[0.02]"
                }`} data-testid={`button-type-${key.toLowerCase().replace(/\s/g, "-")}`}>
                <EI className={`w-4 h-4 mx-auto mb-1 ${formData.entityType === key ? "text-orange-500" : "text-muted-foreground"}`} />
                <div className={`text-[10px] font-medium ${formData.entityType === key ? "text-orange-500" : "text-muted-foreground"}`}>{key}</div>
              </button>
            ))}
          </div>

          <input type="text" placeholder="Name" value={formData.name}
            onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
            className="w-full px-4 py-2.5 rounded-md border border-border/50 bg-white/[0.02] text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-orange-500/50"
            data-testid="input-name" />

          <input type="text" placeholder="Wallet address (0x...)" value={formData.walletAddress}
            onChange={(e) => setFormData((p) => ({ ...p, walletAddress: e.target.value }))}
            className="w-full px-4 py-2.5 rounded-md border border-border/50 bg-white/[0.02] text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-orange-500/50"
            data-testid="input-wallet" />

          <textarea placeholder="What does your agent or robot do?" value={formData.description}
            onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))} rows={2}
            className="w-full px-4 py-2.5 rounded-md border border-border/50 bg-white/[0.02] text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-orange-500/50 resize-none"
            data-testid="input-description" />

          <div className="grid grid-cols-2 gap-3">
            <input type="text" placeholder="Manufacturer" value={formData.manufacturer}
              onChange={(e) => setFormData((p) => ({ ...p, manufacturer: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-md border border-border/50 bg-white/[0.02] text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-orange-500/50"
              data-testid="input-manufacturer" />
            <input type="number" placeholder="Rate (ORB-USD/hr)" value={formData.hourlyRate ?? ""}
              onChange={(e) => setFormData((p) => ({ ...p, hourlyRate: e.target.value ? parseFloat(e.target.value) : null }))}
              className="w-full px-4 py-2.5 rounded-md border border-border/50 bg-white/[0.02] text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-orange-500/50"
              data-testid="input-rate" />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {capOptions.map((cap) => (
              <button key={cap} onClick={() => toggleCap(cap)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                  formData.capabilities.includes(cap) ? "bg-orange-500/20 text-orange-500 border border-orange-500/30" : "bg-white/[0.03] text-muted-foreground border border-border/50"
                }`} data-testid={`button-cap-${cap.toLowerCase().replace(/\s/g, "-")}`}>{cap}</button>
            ))}
          </div>
        </div>

        <div className="sticky bottom-0 p-6 border-t border-border/30 bg-background">
          <Button className="w-full" size="lg"
            disabled={!formData.name || !formData.walletAddress || registerMutation.isPending}
            onClick={() => registerMutation.mutate(formData)}
            data-testid="button-submit-register">
            {registerMutation.isPending ? "Registering..." : "Register on ERC-8004"}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Registry() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [entityFilter, setEntityFilter] = useState("All");
  const [selectedEntry, setSelectedEntry] = useState<RegistryEntry | null>(null);
  const [hireEntry, setHireEntry] = useState<RegistryEntry | null>(null);
  const [showRegister, setShowRegister] = useState(false);

  const { data: entries = [], isLoading } = useQuery<RegistryEntry[]>({
    queryKey: ["/api/registry"],
  });

  useEffect(() => {
    if (entries.length < 5) {
      apiRequest("POST", "/api/registry/seed").then(() => {
        queryClient.invalidateQueries({ queryKey: ["/api/registry"] });
      }).catch(() => {});
    }
  }, [entries.length]);

  const filtered = entries
    .filter((e) => {
      const matchesEntity = entityFilter === "All" || e.entityType === entityFilter;
      const categoryMatch = checkCategory(e, activeCategory);
      const matchesSearch = !searchQuery ||
        e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (e.description && e.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (e.manufacturer && e.manufacturer.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (e.tags && e.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
      return matchesEntity && categoryMatch && matchesSearch;
    })
    .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || (b.rating ?? 0) - (a.rating ?? 0));

  return (
    <div className="min-h-screen pt-24 lg:pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <span className="font-mono text-xs tracking-widest text-orange-500 uppercase mb-3 block" data-testid="text-registry-label">
            ORBIT Marketplace
          </span>
          <h1 className="font-display font-bold text-4xl lg:text-5xl tracking-tight mb-3" data-testid="text-registry-title">
            Hire an AI Agent or Robot
          </h1>
          <p className="text-base text-muted-foreground max-w-2xl leading-relaxed mb-6">
            Browse verified agents and robots.
          </p>

          <div className="relative mb-5">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search agents, robots, or tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-md border border-border/50 bg-white/[0.02] text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-orange-500/50"
              data-testid="input-search"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 mb-5 scrollbar-hide">
            {taskCategories.map((cat) => {
              const CatIcon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
                    activeCategory === cat.id
                      ? "bg-orange-500 text-white"
                      : "bg-white/[0.03] border border-border/50 text-muted-foreground hover:text-foreground"
                  }`}
                  data-testid={`button-category-${cat.id}`}
                >
                  <CatIcon className="w-3.5 h-3.5" />
                  {cat.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex gap-1.5">
              {["All", "AI Agent", "Robot"].map((type) => (
                <button
                  key={type}
                  onClick={() => setEntityFilter(type)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    entityFilter === type ? "bg-white/10 text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                  data-testid={`button-entity-${type.toLowerCase().replace(/\s/g, "-")}`}
                >
                  {type === "All" ? "All" : `${type}s`}
                </button>
              ))}
            </div>
            <Button size="sm" variant="secondary" onClick={() => setShowRegister(true)} data-testid="button-list-agent">
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              List Yours
            </Button>
          </div>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="rounded-md border border-border/50 bg-white/[0.02] animate-pulse h-44" />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((entry) => (
              <AgentCard key={entry.id} entry={entry} onViewProfile={setSelectedEntry} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Search className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <h3 className="font-display font-semibold text-base mb-1">No results</h3>
            <p className="text-xs text-muted-foreground mb-4">Try a different search or category.</p>
            <Button variant="secondary" size="sm" onClick={() => { setSearchQuery(""); setActiveCategory("all"); setEntityFilter("All"); }} data-testid="button-clear-filters">
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedEntry && !hireEntry && (
          <ProfileModal entry={selectedEntry} onClose={() => setSelectedEntry(null)} onHire={(e) => { setSelectedEntry(null); setHireEntry(e); }} />
        )}
        {hireEntry && (
          <HireModal entry={hireEntry} onClose={() => setHireEntry(null)} />
        )}
        {showRegister && (
          <RegisterModal onClose={() => setShowRegister(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
