import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Fingerprint, Wallet, CreditCard, Bot, Shield, Lock, Globe, Cpu, Satellite, Zap, Building2, Swords, Landmark, User, CircuitBoard, Users, Brain, ShieldCheck, BookOpen } from "lucide-react";

const walletTypes = [
  {
    icon: User,
    title: "Human Wallet",
    desc: "Personal ORBIT wallet for individuals interacting with autonomous agents, managing digital assets, and participating in the machine economy.",
  },
  {
    icon: Bot,
    title: "AI Agent Wallet",
    desc: "Autonomous wallets for AI agents to hold, transfer, and manage digital assets across networks, enabling machine-to-machine settlement without human intervention.",
  },
  {
    icon: CircuitBoard,
    title: "Robot Wallet",
    desc: "Hardware-bound wallets for autonomous robots and physical systems: factory automation, autonomous vehicles, drones, and logistics fleets.",
  },
  {
    icon: Building2,
    title: "Enterprise Wallet",
    desc: "Multi-signature organizational wallets enabling enterprises to deploy and manage fleets of agents with governance controls, spending limits, and compliance frameworks.",
  },
  {
    icon: Swords,
    title: "Military Wallet",
    desc: "Hardened wallets for defense and intelligence applications: quantum-resilient encryption, air-gapped operation, classified network compatibility, and ITAR-compliant key management.",
  },
  {
    icon: Landmark,
    title: "Government Wallet",
    desc: "Sovereign wallets for government agencies and public infrastructure: regulatory compliance, audit trails, inter-agency coordination, and national security standards.",
  },
];

const x402Features = [
  {
    title: "HTTP 402 Native",
    desc: "Built on the HTTP 402 Payment Required status code, the internet's original machine payment primitive, now fully realized for autonomous agent transactions.",
  },
  {
    title: "Micropayment Flows",
    desc: "Sub-cent settlement for API calls, data queries, compute cycles, and micro-services. Agents pay per request at machine speed without pre-funded accounts.",
  },
  {
    title: "Cross-Network Settlement",
    desc: "Interoperable payment rails across L1 and L2 chains, stablecoins, and enterprise payment systems. Agents transact across networks seamlessly.",
  },
  {
    title: "Programmable Invoicing",
    desc: "Smart-contract-based invoicing and settlement. Agents generate, validate, and settle invoices autonomously with cryptographic proof of delivery.",
  },
  {
    title: "ORB-USD Stablecoin (Roadmap)",
    desc: "Purpose-built stablecoin for operational payments, supply chain settlements, and infrastructure usage. Full reserve backing with regulated financial institutions.",
  },
  {
    title: "Enterprise Integration",
    desc: "Compatible with existing ERP, accounting, and treasury management systems. Drop-in APIs for SAP, Oracle, NetSuite, and custom enterprise platforms.",
  },
];

const erc8004Features = [
  {
    title: "Cryptographic Agent Identity",
    desc: "Every AI agent, robot, and autonomous system receives a unique, cryptographically verifiable on-chain identity. Tamper-proof and globally resolvable.",
  },
  {
    title: "Capability Attestation",
    desc: "Agents declare and prove their capabilities on-chain: reasoning models, tool access, security clearance, operational domain, and specialization.",
  },
  {
    title: "Trust Scoring",
    desc: "Verifiable on-chain reputation built through transaction history, uptime, task completion rates, and peer attestations across the network.",
  },
  {
    title: "Permission Hierarchies",
    desc: "Role-based access control for agent fleets. Define spending limits, operational boundaries, data access levels, and escalation protocols per identity.",
  },
  {
    title: "Cross-Chain Portability",
    desc: "Agent identities are portable across L1 and L2 chains, sidechains, and enterprise networks. One identity, every network.",
  },
  {
    title: "Compliance & Audit",
    desc: "Built-in audit trails for every agent action, meeting regulatory requirements for financial services, healthcare, defense, and government applications.",
  },
];

const domains = [
  { icon: Cpu, title: "Enterprise Workflows", desc: "ERP, procurement, supply chain, financial systems, cloud infrastructure management" },
  { icon: Globe, title: "Robotics & Manufacturing", desc: "Factory automation, autonomous vehicles, logistics fleets, industrial coordination" },
  { icon: Satellite, title: "Space Infrastructure", desc: "Satellite coordination, orbital compute, delay-tolerant networking, mission management" },
  { icon: Zap, title: "Machine Economics", desc: "Agent-to-agent settlement, programmable payments, stablecoin infrastructure, token-based coordination" },
];

export default function About() {
  return (
    <div className="min-h-screen pt-24 lg:pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1fr_auto] gap-12 lg:gap-16 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase mb-3 block" data-testid="text-about-label">
              About ORBIT
            </span>
            <h1 className="font-display font-bold text-4xl lg:text-6xl tracking-tight mb-6" data-testid="text-about-title">
              The Coordination Layer for{" "}
              <span className="text-gradient">Autonomous AI</span>{" "}
              <span className="text-white/60">&</span>{" "}
              <span className="text-gradient">the Machine Economy</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              ORBIT provides the foundational transaction and coordination layer for the AI agent and robotics-driven economy, where autonomous systems identify, verify, transact, and collaborate at scale.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="hidden lg:flex justify-center"
          >
            <div className="relative">
              <div className="absolute -inset-16 bg-orange-500/5 rounded-full blur-3xl animate-pulse-glow" />
              <img
                src="/images/astronaut-hero.png"
                alt="Astronaut in orbit"
                className="relative w-[380px] h-auto animate-float"
                data-testid="img-astronaut-hero"
              />
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-md overflow-hidden mb-24"
          data-testid="section-about-thesis"
        >
          <img
            src="/images/earth-orbit.png"
            alt="Earth from orbit"
            className="w-full h-72 lg:h-96 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
          <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12">
            <div className="max-w-2xl">
              <h2 className="font-display font-bold text-2xl lg:text-3xl text-white tracking-tight mb-4" data-testid="text-thesis-heading">
                AI agents and robots will outnumber people.
              </h2>
              <p className="text-white/50 leading-relaxed text-sm lg:text-base">
                As organizations deploy thousands, then millions, then billions of autonomous agents and robots across enterprises, supply chains, financial systems, infrastructure networks, and space-based systems, every single one of them will need identity, wallets, payments, and registry functionality.
              </p>
            </div>
          </div>
        </motion.div>

        <section className="mb-24" data-testid="section-orbit-wallet">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <span className="font-mono text-xs tracking-widest text-orange-500/80 uppercase mb-3 block">
              ORBIT Wallet
            </span>
            <h2 className="font-display font-bold text-3xl lg:text-4xl tracking-tight mb-3">
              One wallet standard.{" "}
              <span className="text-gradient">Every participant.</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl text-base lg:text-lg leading-relaxed">
              The ORBIT Wallet is designed for every participant in the machine economy: humans, AI agents, robots, enterprises, military, and government. Each wallet type is purpose-built for its operational context.
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
                className="p-6 lg:p-8 rounded-md border border-border/50 bg-white/[0.02] hover-elevate"
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
        </section>

        <section className="mb-24" data-testid="section-x402">
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
              <span className="text-gradient">payments.</span>
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
                className="p-6 rounded-md border border-border/50 bg-white/[0.02] hover-elevate"
                data-testid={`card-x402-${i}`}
              >
                <div className="w-2 h-2 rounded-full bg-orange-500 mb-4" />
                <h3 className="font-display font-semibold text-base mb-2 tracking-tight">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mb-24" data-testid="section-erc8004">
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
              <span className="text-gradient">every machine.</span>
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
                className="p-6 rounded-md border border-border/50 bg-white/[0.02] hover-elevate"
                data-testid={`card-erc8004-${i}`}
              >
                <div className="w-2 h-2 rounded-full bg-orange-500 mb-4" />
                <h3 className="font-display font-semibold text-base mb-2 tracking-tight">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mb-24" data-testid="section-about-domains">
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
                className="flex items-start gap-4 p-6 rounded-md border border-border/30 bg-white/[0.015]"
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
        </section>

        <section data-testid="section-about-team" className="mb-24">
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
              className="p-6 lg:p-8 rounded-md border border-border/50 bg-white/[0.02]"
              data-testid="card-team-founder"
            >
              <div className="w-12 h-12 rounded-md bg-orange-500/10 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-1 tracking-tight">Anonymous Founder</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                Unicorn founder with a $7.5B enterprise exit and a $500M market cap token under his belt. Prefers to remain anonymous, letting the protocol and its community speak for themselves.
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
              className="p-6 lg:p-8 rounded-md border border-border/50 bg-white/[0.02]"
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

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
                className="p-4 rounded-md border border-border/30 bg-white/[0.015]"
                data-testid={`card-team-domain-${i}`}
              >
                <domain.icon className="w-5 h-5 text-orange-500 mb-3" />
                <h4 className="font-display font-semibold text-sm mb-1">{domain.label}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{domain.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section data-testid="section-about-vision">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-md overflow-hidden"
          >
            <img
              src="/images/quantum-bg.png"
              alt="Quantum visualization"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-black/50" />
            <div className="relative p-8 lg:p-16">
              <div className="max-w-xl">
                <span className="font-mono text-xs tracking-widest text-orange-500/80 uppercase mb-4 block">
                  Long-Term Vision
                </span>
                <h2 className="font-display font-bold text-3xl lg:text-4xl text-white tracking-tight mb-4">
                  Planetary-scale coordination.
                </h2>
                <p className="text-white/50 leading-relaxed mb-8">
                  Without standardized frameworks for identity, communication, and economic interaction, the growth of agent-based systems risks becoming fragmented and insecure. ORBIT provides the infrastructure necessary to coordinate this emerging machine economy, from enterprise floors to orbital systems.
                </p>
                <div className="flex items-center gap-3 flex-wrap">
                  <Link href="/whitepaper">
                    <Button size="lg" data-testid="button-about-whitepaper">
                      Read White Paper
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                  <Link href="/token">
                    <Button size="lg" variant="outline" className="backdrop-blur-sm bg-white/5 border-white/15 text-white" data-testid="button-about-token">
                      Token Economics
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
