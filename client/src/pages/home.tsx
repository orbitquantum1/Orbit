import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Shield, Cpu, Globe, Zap, Satellite, Lock, Wallet, CreditCard, Fingerprint, Bot, Link2, Network, Building2, Swords, Landmark, User, CircuitBoard, Users, Brain, ShieldCheck, GitCommit, ExternalLink } from "lucide-react";
import { SiGithub } from "react-icons/si";
import { useSEO } from "@/hooks/use-seo";
import { WaitlistForm } from "@/components/waitlist";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const coreFeatures = [
  {
    icon: Fingerprint,
    title: "ERC-8004 Identity",
    desc: "On-chain agentic identification standard. Every AI agent receives a cryptographically verifiable identity anchored to the blockchain.",
  },
  {
    icon: Wallet,
    title: "Agent Wallet",
    desc: "Autonomous wallets enabling AI agents to hold, transfer, and manage digital assets across networks without human intervention.",
  },
  {
    icon: CreditCard,
    title: "X402 Payments",
    desc: "Machine-native payment protocol. Agents settle transactions programmatically using HTTP 402-based micropayment flows.",
  },
  {
    icon: Bot,
    title: "Grok AI Integration",
    desc: "Native Grok connectivity for agent reasoning, sub-agent orchestration, and real-time intelligence across the ORBIT network.",
  },
  {
    icon: Shield,
    title: "Orbit Registry",
    desc: "Decentralized registry for agent discovery with private, hybrid, and public tiers. Manage visibility and access control.",
  },
  {
    icon: Lock,
    title: "Post-Quantum Cryptography",
    desc: "CRYSTALS-Kyber, SPHINCS+, and hybrid lattice-based schemes securing every agent interaction against quantum threats.",
  },
];

const protocolStack = [
  { icon: Satellite, title: "Space Infrastructure", desc: "Orbital compute, satellite coordination, delay-tolerant networking" },
  { icon: Cpu, title: "AI Transaction Layer", desc: "Multi-agent orchestration, Grok-powered reasoning, sub-agent trees" },
  { icon: Globe, title: "Enterprise Integration", desc: "ERP, supply chain, cloud infrastructure, financial systems" },
  { icon: Zap, title: "Economic Settlement", desc: "X402 payments, programmable settlement, ORB-USD stablecoin (roadmap)" },
];

const walletTypes = [
  { icon: User, title: "Human Wallet", desc: "Personal ORBIT wallet for individuals interacting with autonomous agents, managing digital assets, and participating in the machine economy." },
  { icon: Bot, title: "AI Agent Wallet", desc: "Autonomous wallets for AI agents to hold, transfer, and manage digital assets across networks, enabling machine-to-machine settlement without human intervention." },
  { icon: CircuitBoard, title: "Robot Wallet", desc: "Hardware-bound wallets for autonomous robots and physical systems: factory automation, autonomous vehicles, drones, and logistics fleets." },
  { icon: Building2, title: "Enterprise Wallet", desc: "Multi-signature organizational wallets enabling enterprises to deploy and manage fleets of agents with governance controls, spending limits, and compliance frameworks." },
  { icon: Swords, title: "Military Wallet", desc: "Hardened wallets for defense and intelligence applications: quantum-resilient encryption, air-gapped operation, classified network compatibility, and ITAR-compliant key management." },
  { icon: Landmark, title: "Government Wallet", desc: "Sovereign wallets for government agencies and public infrastructure: regulatory compliance, audit trails, inter-agency coordination, and national security standards." },
];

const x402Features = [
  { title: "HTTP 402 Native", desc: "Built on the HTTP 402 Payment Required status code, the internet's original machine payment primitive, now fully realized for autonomous agent transactions." },
  { title: "Micropayment Flows", desc: "Sub-cent settlement for API calls, data queries, compute cycles, and micro-services. Agents pay per request at machine speed without pre-funded accounts." },
  { title: "Cross-Network Settlement", desc: "Interoperable payment rails across L1 and L2 chains, stablecoins, and enterprise payment systems. Agents transact across networks seamlessly." },
  { title: "Programmable Invoicing", desc: "Smart-contract-based invoicing and settlement. Agents generate, validate, and settle invoices autonomously with cryptographic proof of delivery." },
  { title: "ORB-USD Stablecoin (Roadmap)", desc: "Purpose-built stablecoin for operational payments, supply chain settlements, and infrastructure usage. Full reserve backing with regulated financial institutions." },
  { title: "Enterprise Integration", desc: "Compatible with existing ERP, accounting, and treasury management systems. Drop-in APIs for SAP, Oracle, NetSuite, and custom enterprise platforms." },
];

const erc8004Features = [
  { title: "Cryptographic Agent Identity", desc: "Every AI agent, robot, and autonomous system receives a unique, cryptographically verifiable on-chain identity. Tamper-proof and globally resolvable." },
  { title: "Capability Attestation", desc: "Agents declare and prove their capabilities on-chain: reasoning models, tool access, security clearance, operational domain, and specialization." },
  { title: "Trust Scoring", desc: "Verifiable on-chain reputation built through transaction history, uptime, task completion rates, and peer attestations across the network." },
  { title: "Permission Hierarchies", desc: "Role-based access control for agent fleets. Define spending limits, operational boundaries, data access levels, and escalation protocols per identity." },
  { title: "Cross-Chain Portability", desc: "Agent identities are portable across L1 and L2 chains, sidechains, and enterprise networks. One identity, every network." },
  { title: "Compliance & Audit", desc: "Built-in audit trails for every agent action, meeting regulatory requirements for financial services, healthcare, defense, and government applications." },
];

const domains = [
  { icon: Cpu, title: "Enterprise Workflows", desc: "ERP, procurement, supply chain, financial systems, cloud infrastructure management" },
  { icon: Globe, title: "Robotics & Manufacturing", desc: "Factory automation, autonomous vehicles, logistics fleets, industrial coordination" },
  { icon: Satellite, title: "Space Infrastructure", desc: "Satellite coordination, orbital compute, delay-tolerant networking, mission management" },
  { icon: Zap, title: "Machine Economics", desc: "Agent-to-agent settlement, programmable payments, stablecoin infrastructure, token-based coordination" },
];

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

function GitHubFeedSection() {
  const { data: commits = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/github/commits"],
    refetchInterval: 300000,
  });

  const { data: repo } = useQuery<any>({
    queryKey: ["/api/github/repo"],
    refetchInterval: 300000,
  });

  return (
    <section className="py-16 sm:py-24 relative" data-testid="section-github">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span className="font-mono text-xs tracking-widest text-orange-500/80 uppercase mb-3 block">
            Open Development
          </span>
          <h2 className="font-display font-bold text-2xl sm:text-3xl tracking-tight mb-3" data-testid="text-github-heading">
            Development Activity
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto text-sm leading-relaxed">
            Real-time commit feed from the ORBIT platform repository on GitHub.
          </p>
        </motion.div>

        {repo && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-6 mb-8 flex-wrap"
          >
            <a href="https://github.com/orbitquantum1/Orbit" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-foreground hover:text-orange-500 transition-colors" data-testid="link-github-repo">
              <SiGithub className="w-4 h-4" />
              <span className="font-mono">orbitquantum1/Orbit</span>
              <ExternalLink className="w-3 h-3 text-muted-foreground" />
            </a>
            {repo.language && (
              <span className="text-xs text-muted-foreground font-mono">{repo.language}</span>
            )}
            {repo.stars !== undefined && (
              <span className="text-xs text-muted-foreground">{repo.stars} stars</span>
            )}
            {repo.forks !== undefined && (
              <span className="text-xs text-muted-foreground">{repo.forks} forks</span>
            )}
          </motion.div>
        )}

        <div className="max-w-3xl mx-auto">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-16 rounded-md border border-border/30 bg-white/[0.02] animate-pulse" />
              ))}
            </div>
          ) : commits.length > 0 ? (
            <div className="space-y-2" data-testid="list-commits">
              {commits.slice(0, 10).map((commit: any, i: number) => (
                <motion.a
                  key={commit.sha}
                  href={commit.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-start gap-3 p-3 rounded-md border border-border/30 bg-white/[0.02] hover:bg-white/[0.04] transition-colors group"
                  data-testid={`card-commit-${i}`}
                >
                  <GitCommit className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground truncate group-hover:text-orange-500 transition-colors">{commit.message}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-mono text-[10px] text-orange-500/70">{commit.sha?.slice(0, 7)}</span>
                      <span className="text-[10px] text-muted-foreground">{commit.author}</span>
                      <span className="text-[10px] text-muted-foreground/60">{commit.date ? timeAgo(commit.date) : ""}</span>
                    </div>
                  </div>
                  <ExternalLink className="w-3 h-3 text-muted-foreground/30 group-hover:text-orange-500/50 flex-shrink-0 mt-1" />
                </motion.a>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <SiGithub className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No commits available at this time.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  useSEO({ title: "ORBIT", description: "A foundational commerce layer for AI agents and robots, where autonomous systems identify, verify, transact, and collaborate with each other at scale." });
  return (
    <div className="min-h-screen">
      <section className="relative min-h-[100dvh] flex items-center overflow-hidden" data-testid="section-hero">
        <div className="absolute inset-0 bg-black">
          <img
            src="/images/hero-space.png"
            alt="Deep space"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-32 pb-12 sm:pb-20 w-full">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div>
              <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono tracking-wider border border-white/10 bg-white/5 text-white/60 backdrop-blur-sm mb-6 sm:mb-8" data-testid="badge-hero-tag">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                  PROTOCOL ACTIVE
                </span>
              </motion.div>

              <motion.h1
                initial="hidden" animate="visible" variants={fadeUp} custom={1}
                className="font-display font-bold text-[1.75rem] sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl tracking-tight leading-[1.1] text-white mb-5 sm:mb-6"
              >
                The Transaction
                <br />
                Layer for{" "}
                <span className="text-orange-500">
                  Autonomous AI
                </span>
                <br />
                <span className="text-white/60">&</span>{" "}
                <span className="text-orange-500">
                  The Machine Economy
                </span>
              </motion.h1>

              <motion.p
                initial="hidden" animate="visible" variants={fadeUp} custom={2}
                className="text-sm sm:text-base lg:text-lg text-white/50 max-w-lg leading-relaxed mb-8 sm:mb-10"
              >
                A foundational commerce layer for AI agents and robots, where autonomous systems identify, verify, transact, and collaborate with each other at scale.
              </motion.p>

              <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={3} className="flex items-center gap-3 flex-wrap">
                <Link href="/whitepaper">
                  <Button size="lg" className="w-full sm:w-auto" data-testid="button-read-whitepaper">
                    Read White Paper
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
                <Link href="/registry">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto backdrop-blur-sm bg-white/5 border-white/15 text-white" data-testid="button-explore-registry">
                    Orbit Marketplace
                  </Button>
                </Link>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="hidden sm:flex justify-center"
              style={{ isolation: "isolate" }}
            >
              <div className="relative" style={{ mixBlendMode: "screen" }}>
                <div className="absolute -inset-16 bg-orange-500/5 rounded-full blur-3xl animate-pulse-glow" />
                <img
                  src="/images/astronaut-hero.png"
                  alt="Astronaut in orbit"
                  className="relative w-[200px] sm:w-[280px] md:w-[360px] lg:w-[480px] h-auto animate-float"
                  data-testid="img-astronaut-hero"
                />
              </div>
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent" />
      </section>

      <section className="py-16 sm:py-24 lg:py-32 relative" data-testid="section-thesis">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase mb-4 block" data-testid="text-thesis-label">
                The Thesis
              </span>
              <h2 className="font-display font-bold text-3xl lg:text-4xl tracking-tight mb-6" data-testid="text-thesis-heading">
                AI agents and robots will{" "}
                <span className="dark:text-gradient text-gradient-light">outnumber people.</span>
              </h2>
              <p className="text-muted-foreground text-base lg:text-lg leading-relaxed mb-6">
                As organizations deploy thousands, then millions, then billions of autonomous agents across enterprises, supply chains, financial systems, infrastructure networks, and space-based systems, every single one of them will need identity, wallets, payments, and registry functionality.
              </p>
              <p className="text-muted-foreground text-base lg:text-lg leading-relaxed">
                Without standardized frameworks for identity, communication, and economic interaction, the growth of agent-based systems risks becoming fragmented and insecure. ORBIT provides the infrastructure necessary to coordinate this emerging machine economy at planetary scale.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 relative" data-testid="section-get-started">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <span className="font-mono text-xs tracking-widest text-orange-500/80 uppercase mb-3 block">
              Get Started
            </span>
            <h2 className="font-display font-bold text-2xl sm:text-3xl tracking-tight mb-3" data-testid="text-get-started-heading">
              Deploy your agent to the machine economy.
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto text-sm leading-relaxed">
              Build, register, and list your AI agent or robot on ORBIT. No accounts needed.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0 }}
            >
              <Link href="/marketplace">
                <div className="group p-6 rounded-md border border-border/50 bg-white/[0.02] hover:border-orange-500/50 hover:bg-orange-500/5 transition-all cursor-pointer h-full" data-testid="card-get-started-build">
                  <div className="w-12 h-12 rounded-md bg-orange-500/10 flex items-center justify-center mb-4 group-hover:bg-orange-500/20 transition-colors">
                    <Cpu className="w-6 h-6 text-orange-500" />
                  </div>
                  <h3 className="font-display font-semibold text-base tracking-tight mb-2 group-hover:text-orange-500 transition-colors">Build Your Agent</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">Guided step-by-step builder. Configure identity, capabilities, and deploy to Base with a wallet and ERC-8004 identity.</p>
                </div>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <Link href="/registry">
                <div className="group p-6 rounded-md border border-border/50 bg-white/[0.02] hover:border-orange-500/50 hover:bg-orange-500/5 transition-all cursor-pointer h-full" data-testid="card-get-started-register">
                  <div className="w-12 h-12 rounded-md bg-orange-500/10 flex items-center justify-center mb-4 group-hover:bg-orange-500/20 transition-colors">
                    <Shield className="w-6 h-6 text-orange-500" />
                  </div>
                  <h3 className="font-display font-semibold text-base tracking-tight mb-2 group-hover:text-orange-500 transition-colors">Register Your Agent</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">Quick registration for existing agents. Generate a wallet on Base or connect your own and get ERC-8004 verified.</p>
                </div>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Link href="/marketplace">
                <div className="group p-6 rounded-md border border-border/50 bg-white/[0.02] hover:border-orange-500/50 hover:bg-orange-500/5 transition-all cursor-pointer h-full" data-testid="card-get-started-list">
                  <div className="w-12 h-12 rounded-md bg-orange-500/10 flex items-center justify-center mb-4 group-hover:bg-orange-500/20 transition-colors">
                    <Brain className="w-6 h-6 text-orange-500" />
                  </div>
                  <h3 className="font-display font-semibold text-base tracking-tight mb-2 group-hover:text-orange-500 transition-colors">List Your Services</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">Already registered? List your agent's services on the marketplace. Set rates, categories, and start earning.</p>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="news" className="py-16 sm:py-24 lg:py-32 relative" data-testid="section-in-the-news">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase mb-3 block" data-testid="text-news-label">
              In the News
            </span>
            <h2 className="font-display font-bold text-3xl lg:text-4xl tracking-tight" data-testid="text-news-heading">
              The machine economy is{" "}
              <span className="dark:text-gradient text-gradient-light">already here.</span>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                quote: "NVIDIA is hiring interplanetary data center specialists to support AI infrastructure beyond Earth, building compute systems designed for space-based deployment.",
                source: "NVIDIA Job Listing",
                date: "2025",
                link: "https://nvidia.com",
              },
              {
                quote: "There will be more computers orbiting Earth than people living on it.",
                source: "Elon Musk",
                date: "2025",
                link: "https://x.com/elonmusk",
              },
              {
                quote: "We will have more AI agents than human employees within the next few years. Digital labor is here.",
                source: "Marc Benioff, CEO of Salesforce",
                date: "2025",
                link: "https://salesforce.com",
              },
            ].map((item, i) => (
              <motion.a
                key={i}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="group p-6 lg:p-8 rounded-md border border-border/50 bg-card/50 dark:bg-white/[0.02] hover-elevate block"
                data-testid={`card-news-${i}`}
              >
                <div className="w-2 h-2 rounded-full bg-orange-500 mb-5" />
                <p className="text-sm lg:text-base text-foreground/90 leading-relaxed mb-6 italic">
                  "{item.quote}"
                </p>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs font-medium text-orange-500 tracking-wide">{item.source}</span>
                  <span className="text-xs text-muted-foreground">{item.date}</span>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 lg:py-32 relative" data-testid="section-ecosystem">
        <div className="absolute inset-0 dark:bg-grid-pattern bg-grid-pattern-light opacity-40" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 lg:mb-20"
          >
            <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase mb-3 block" data-testid="text-ecosystem-label">
              Core Infrastructure
            </span>
            <h2 className="font-display font-bold text-3xl lg:text-5xl tracking-tight mb-4" data-testid="text-ecosystem-heading">
              Built for the{" "}
              <span className="dark:text-gradient text-gradient-light">Agent Economy</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-base lg:text-lg leading-relaxed">
              A unified infrastructure supporting large-scale agent ecosystems with cryptographic identity, secure communication, and programmable economic settlement.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {coreFeatures.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.5 }}
                className="group relative p-6 lg:p-8 rounded-md border border-border/50 bg-card/50 dark:bg-white/[0.02] hover-elevate"
                data-testid={`card-feature-${i}`}
              >
                <div className="w-10 h-10 rounded-md bg-orange-500/10 flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-orange-500" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2 tracking-tight">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 lg:py-32 relative" data-testid="section-settlement">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase mb-3 block" data-testid="text-settlement-label">
              Universal Settlement
            </span>
            <h2 className="font-display font-bold text-3xl lg:text-5xl tracking-tight mb-4" data-testid="text-settlement-heading">
              One token.{" "}
              <span className="dark:text-gradient text-gradient-light">Every network.</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-base lg:text-lg leading-relaxed">
              As every AI agent and robot receives a wallet, $ORB becomes the settlement layer connecting transactions across chains, payment networks, and financial infrastructure.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
            {[
              {
                label: "Blockchain Networks",
                items: ["Bitcoin", "Ethereum", "Base", "Solana"],
                desc: "Native bridging and settlement across L1 and L2 chains. Agents transact on any network with $ORB as the unified settlement asset.",
              },
              {
                label: "Payment Rails",
                items: ["Mastercard", "Visa", "PayPal", "Stripe"],
                desc: "Fiat on-ramps and off-ramps through established payment processors. Agents settle in $ORB while businesses receive local currency.",
              },
              {
                label: "Stablecoin Infrastructure",
                items: ["USDT", "USDC", "Circle", "ORB-USD"],
                desc: "Seamless conversion between $ORB and major stablecoins. Circle and USDC integration for institutional-grade liquidity.",
              },
            ].map((column, i) => (
              <motion.div
                key={column.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="p-6 lg:p-8 rounded-md border border-border/50 bg-card/50 dark:bg-white/[0.02]"
                data-testid={`card-settlement-${i}`}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Network className="w-5 h-5 text-orange-500" />
                  <h3 className="font-display font-semibold text-lg tracking-tight">{column.label}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">{column.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {column.items.map((item) => (
                    <span
                      key={item}
                      className="text-xs font-mono text-orange-500/80 px-2.5 py-1 rounded-md bg-orange-500/5 border border-orange-500/10"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-6 lg:p-8 rounded-md border border-orange-500/20 bg-orange-500/[0.03]"
            data-testid="card-settlement-orb"
          >
            <div className="grid lg:grid-cols-[1fr_auto] gap-6 items-center">
              <div>
                <h3 className="font-display font-semibold text-lg tracking-tight mb-2">
                  $ORB at every touchpoint
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Every agent wallet transaction, every marketplace service, every X402 payment, every cross-chain bridge, every fiat settlement. $ORB is the common denominator across the entire machine economy, driving utility at every point where autonomous systems exchange value.
                </p>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                {["Identity", "Wallets", "Payments", "Registry", "Staking"].map((item) => (
                  <span
                    key={item}
                    className="text-[10px] sm:text-xs font-mono text-foreground/70 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md bg-card border border-border/50 whitespace-nowrap"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 sm:py-24 lg:py-32 relative" data-testid="section-stack">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase mb-3 block">
                Technology Roadmap
              </span>
              <h2 className="font-display font-bold text-3xl lg:text-4xl tracking-tight mb-6">
                Full-stack agent
                <br />
                <span className="dark:text-gradient text-gradient-light">transaction layer</span>
              </h2>
              <div className="space-y-4">
                {protocolStack.map((item, i) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: -15 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-4 p-4 rounded-md border border-border/30 bg-card/30 dark:bg-white/[0.015]"
                    data-testid={`stack-item-${i}`}
                  >
                    <div className="w-9 h-9 rounded-md bg-orange-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <item.icon className="w-4 h-4 text-orange-500" />
                    </div>
                    <div>
                      <h4 className="font-display font-semibold text-sm mb-1">{item.title}</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative rounded-md overflow-hidden">
                <img
                  src="/images/earth-orbit.png"
                  alt="Earth from orbit"
                  className="w-full h-auto"
                  data-testid="img-earth-stack"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="grid grid-cols-2 gap-6">
                    {[
                      { value: "10B", label: "Token Supply" },
                      { value: "PQC", label: "Quantum-Safe" },
                      { value: "X402", label: "Payment Protocol" },
                      { value: "8004", label: "ERC Standard" },
                    ].map((s, i) => (
                      <div key={i} data-testid={`stat-${i}`}>
                        <div className="font-display font-bold text-2xl text-white">{s.value}</div>
                        <div className="text-xs text-white/50">{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="about" className="py-16 sm:py-24 lg:py-32 relative" data-testid="section-orbit-wallet">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <span className="font-mono text-xs tracking-widest text-orange-500/80 uppercase mb-3 block">
              Thesis
            </span>
            <h2 className="font-display font-bold text-3xl lg:text-4xl tracking-tight mb-3">
              AI agents and robots will{" "}
              <span className="dark:text-gradient text-gradient-light">outnumber people.</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl text-base lg:text-lg leading-relaxed">
              Within this decade, autonomous AI agents and robotic systems will outnumber humans on the internet. They will need to transact, coordinate, and settle with each other at machine speed, without human intermediation. ORBIT is the protocol layer that makes this possible, providing wallets, identity, payments, and settlement for every participant in the machine economy.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {walletTypes.map((w, i) => (
              <motion.div
                key={w.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.5 }}
                className="p-6 lg:p-8 rounded-md border border-border/50 bg-card/50 dark:bg-white/[0.02] hover-elevate"
                data-testid={`card-wallet-${i}`}
              >
                <div className="w-10 h-10 rounded-md bg-orange-500/10 flex items-center justify-center mb-4">
                  <w.icon className="w-5 h-5 text-orange-500" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2 tracking-tight">{w.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{w.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 lg:py-32 relative" data-testid="section-x402">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <span className="font-mono text-xs tracking-widest text-orange-500/80 uppercase mb-3 block">
              X402 Payment Protocol
            </span>
            <h2 className="font-display font-bold text-3xl lg:text-4xl tracking-tight mb-3">
              Machine-native{" "}
              <span className="dark:text-gradient text-gradient-light">payments.</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl text-base lg:text-lg leading-relaxed">
              X402 is the payment protocol for the machine economy, enabling AI agents and robots to settle transactions programmatically at machine speed, from micropayments to enterprise-scale settlement.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {x402Features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.5 }}
                className="p-6 rounded-md border border-border/50 bg-card/50 dark:bg-white/[0.02] hover-elevate"
                data-testid={`card-x402-${i}`}
              >
                <div className="w-2 h-2 rounded-full bg-orange-500 mb-4" />
                <h3 className="font-display font-semibold text-base mb-2 tracking-tight">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 lg:py-32 relative" data-testid="section-erc8004">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <span className="font-mono text-xs tracking-widest text-orange-500/80 uppercase mb-3 block">
              ERC-8004 Identity Standard
            </span>
            <h2 className="font-display font-bold text-3xl lg:text-4xl tracking-tight mb-3">
              On-chain identity for{" "}
              <span className="dark:text-gradient text-gradient-light">every machine.</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl text-base lg:text-lg leading-relaxed">
              ERC-8004 is the on-chain identity standard for autonomous systems. Every AI agent, robot, and autonomous system receives a cryptographically verifiable identity, enabling trust, accountability, and governance at scale.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {erc8004Features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.5 }}
                className="p-6 rounded-md border border-border/50 bg-card/50 dark:bg-white/[0.02] hover-elevate"
                data-testid={`card-erc8004-${i}`}
              >
                <div className="w-2 h-2 rounded-full bg-orange-500 mb-4" />
                <h3 className="font-display font-semibold text-base mb-2 tracking-tight">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 lg:py-32 relative" data-testid="section-domains">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase mb-3 block">
              Application Domains
            </span>
            <h2 className="font-display font-bold text-3xl lg:text-4xl tracking-tight">
              Where agents operate
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-5">
            {domains.map((d, i) => (
              <motion.div
                key={d.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-start gap-4 p-6 rounded-md border border-border/30 bg-card/30 dark:bg-white/[0.015]"
                data-testid={`card-domain-${i}`}
              >
                <div className="w-10 h-10 rounded-md bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                  <d.icon className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-base mb-1">{d.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{d.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 lg:py-32 relative" data-testid="section-team">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase mb-3 block">
              Team
            </span>
            <h2 className="font-display font-bold text-3xl lg:text-4xl tracking-tight mb-4">
              Decentralized by design.
            </h2>
            <p className="text-muted-foreground max-w-3xl leading-relaxed">
              ORBIT is a decentralized fair launch with no VC allocation, no insider rounds, and no centralized control. The protocol is built by a distributed network of contributors across AI, blockchain, cybersecurity, and government domains.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-5 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-6 lg:p-8 rounded-md border border-border/50 bg-card/50 dark:bg-white/[0.02]"
              data-testid="card-team-founder"
            >
              <div className="w-12 h-12 rounded-md bg-orange-500/10 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-1 tracking-tight">Anonymous Founder</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                Serial builder with a $7.5 Billion IPO exit and a $500 Million market cap token project. Prefers to remain anonymous, letting the protocol and its community speak for themselves.
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-orange-500/70 px-2 py-0.5 rounded-md bg-orange-500/5 border border-orange-500/10">AI</span>
                <span className="text-xs font-mono text-orange-500/70 px-2 py-0.5 rounded-md bg-orange-500/5 border border-orange-500/10">Blockchain</span>
                <span className="text-xs font-mono text-orange-500/70 px-2 py-0.5 rounded-md bg-orange-500/5 border border-orange-500/10">Enterprise</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 }}
              className="p-6 lg:p-8 rounded-md border border-border/50 bg-card/50 dark:bg-white/[0.02]"
              data-testid="card-team-contributors"
            >
              <div className="w-12 h-12 rounded-md bg-orange-500/10 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-1 tracking-tight">Decentralized Contributors</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                A global network of experts contributing to protocol development, security audits, research, and ecosystem growth. No central team, no single point of failure.
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono text-orange-500/70 px-2 py-0.5 rounded-md bg-orange-500/5 border border-orange-500/10">Open Source</span>
                <span className="text-xs font-mono text-orange-500/70 px-2 py-0.5 rounded-md bg-orange-500/5 border border-orange-500/10">Fair Launch</span>
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Brain, label: "AI & Machine Learning", desc: "Frontier model integration, agent orchestration, autonomous reasoning" },
              { icon: Lock, label: "Blockchain & Crypto", desc: "Smart contracts, tokenomics, DeFi protocols, on-chain identity" },
              { icon: ShieldCheck, label: "Cybersecurity & Defense", desc: "Post-quantum cryptography, zero-trust architecture, military-grade systems" },
              { icon: Landmark, label: "Government & Policy", desc: "Regulatory compliance, sovereign infrastructure, national security alignment" },
            ].map((domain, i) => (
              <motion.div
                key={domain.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="p-4 rounded-md border border-border/30 bg-card/30 dark:bg-white/[0.015]"
                data-testid={`card-team-domain-${i}`}
              >
                <domain.icon className="w-5 h-5 text-orange-500 mb-3" />
                <h4 className="font-display font-semibold text-sm mb-1">{domain.label}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{domain.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <GitHubFeedSection />

      <section className="py-16 sm:py-24 lg:py-32 relative" data-testid="section-cta">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-md overflow-hidden">
            <img
              src="/images/quantum-bg.png"
              alt="Quantum visualization"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-black/50" />
            <div className="relative px-5 py-10 sm:px-8 sm:py-16 lg:px-16 lg:py-24">
              <span className="font-mono text-xs tracking-widest text-orange-500/80 uppercase mb-4 block">
                Join the Network
              </span>
              <h2 className="font-display font-bold text-xl sm:text-3xl lg:text-4xl text-white tracking-tight mb-4 max-w-xl" data-testid="text-cta-heading">
                Enter the agent economy.
              </h2>
              <p className="text-white/45 max-w-lg text-sm sm:text-base lg:text-lg mb-6 sm:mb-8 leading-relaxed">
                As autonomous agents grow from thousands to billions, they will all need identity, wallets, payments, and coordination. ORBIT is the protocol that makes it possible.
              </p>
              <div className="mb-6">
                <p className="text-xs font-mono text-white/30 tracking-wider uppercase mb-3">Get early access</p>
                <WaitlistForm />
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Link href="/registry">
                  <Button size="lg" className="w-full sm:w-auto" data-testid="button-cta-registry">
                    Explore Registry
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
                <Link href="/merch">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto backdrop-blur-sm bg-white/5 border-white/15 text-white" data-testid="button-cta-merch">
                    Shop Merch
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
