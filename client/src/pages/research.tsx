import { motion } from "framer-motion";
import { useSEO } from "@/hooks/use-seo";
import { ShareButton } from "@/components/share-button";
import { Brain, Shield, Satellite, Server, Cpu, Lock, Radio, Database, Network, Bot, CircuitBoard, Globe, Zap, Crosshair, Target, Swords } from "lucide-react";

const researchDomains = [
  {
    title: "Autonomous AI Agents",
    subtitle: "Scalable agent coordination at planetary scale",
    items: [
      {
        title: "Multi-Agent Coordination",
        desc: "Scalable coordination protocols for millions of concurrent autonomous AI agents operating across distributed, adversarial environments. Real-time task allocation, conflict resolution, and hierarchical decision trees.",
        icon: Network,
      },
      {
        title: "Agent Identity & Trust",
        desc: "Cryptographic identity frameworks enabling verifiable trust between autonomous systems without centralized authorities. ERC-8004 standard implementation and trust scoring mechanisms.",
        icon: Shield,
      },
      {
        title: "Autonomous Decision Systems",
        desc: "AI agents capable of complex multi-step reasoning, negotiation, and real-time decision-making. Grok-powered reasoning engines with sub-agent orchestration and task decomposition.",
        icon: Brain,
      },
      {
        title: "Agent Economic Behavior",
        desc: "Research into autonomous economic agents that negotiate pricing, settle transactions, and manage treasury operations without human oversight. Game-theoretic incentive alignment.",
        icon: Zap,
      },
    ],
  },
  {
    title: "Robotics & Physical Systems",
    subtitle: "Hardware-bound autonomy and machine coordination",
    items: [
      {
        title: "Robot Wallet Infrastructure",
        desc: "Hardware-bound cryptographic wallets for autonomous robots. Secure enclaves, TPM-based key management, and tamper-resistant transaction signing for physical autonomous systems.",
        icon: CircuitBoard,
      },
      {
        title: "Fleet Coordination Protocols",
        desc: "Real-time coordination of autonomous vehicle fleets, drone swarms, and industrial robot clusters. Distributed consensus for physical system synchronization.",
        icon: Bot,
      },
      {
        title: "Machine-to-Machine Settlement",
        desc: "Autonomous payment settlement between physical machines. Robots purchasing raw materials, negotiating logistics, and settling supply chain transactions without human intermediaries.",
        icon: Database,
      },
    ],
  },
  {
    title: "Space Compute & Orbital Infrastructure",
    subtitle: "Interplanetary data centers and satellite coordination",
    items: [
      {
        title: "Orbital Compute Networks",
        desc: "Space-based computing infrastructure for latency-optimized global processing. Autonomous satellite constellation management, orbital edge computing, and distributed space-based AI inference.",
        icon: Server,
      },
      {
        title: "Delay-Tolerant Networking",
        desc: "Communication protocols for reliable agent coordination across orbital and deep-space links. Store-and-forward architectures, interplanetary routing, and signal propagation compensation.",
        icon: Radio,
      },
      {
        title: "Autonomous Mission Coordination",
        desc: "AI agents managing satellite positioning, bandwidth allocation, and mission logistics without centralized human oversight. Autonomous orbital maneuvering and collision avoidance.",
        icon: Satellite,
      },
      {
        title: "Interplanetary Growth Architecture",
        desc: "Infrastructure design for scaling the machine economy beyond Earth. Mars-Earth transaction settlement, lunar compute nodes, and multi-planetary agent registry synchronization.",
        icon: Globe,
      },
    ],
  },
  {
    title: "Post-Quantum Cryptography",
    subtitle: "Military-grade, quantum-resilient security for the machine economy",
    items: [
      {
        title: "Lattice-Based Encryption",
        desc: "CRYSTALS-Kyber key encapsulation and CRYSTALS-Dilithium digital signatures. NIST-approved, military-grade post-quantum cryptographic standards aligned with the Cyber Strategy for America mandate for accelerated post-quantum deployment.",
        icon: Lock,
      },
      {
        title: "Hybrid Cryptographic Architectures",
        desc: "Combining classical and post-quantum algorithms for zero-trust security transitions. Backward-compatible deployment across defense, enterprise, and civilian infrastructure while achieving quantum resistance at every layer.",
        icon: Shield,
      },
      {
        title: "Quantum-Safe Protocol Design",
        desc: "Communication and settlement protocols resilient against both classical and quantum computational attacks. SPHINCS+ hash-based signatures, Classic McEliece code-based encryption, and AES-256 symmetric encryption for classified-grade data protection.",
        icon: Cpu,
      },
    ],
  },
  {
    title: "Agentic Commerce & Policy Standards",
    subtitle: "Aligning with global standards for autonomous agent payments and cybersecurity",
    items: [
      {
        title: "Verifiable Intent Protocol",
        desc: "Alignment with the Mastercard-Google Verifiable Intent standard for cryptographically proving user authorization of agent-initiated payments. Tamper-resistant audit trails linking identity, intent, and action for autonomous transactions.",
        icon: Shield,
      },
      {
        title: "Agentic Commerce Protocols",
        desc: "Interoperability with OpenAI-Stripe ACP, Google UCP, and PayPal Agent Ready frameworks. ORBIT agents can transact across ChatGPT Instant Checkout, Google Shopping, and PayPal merchant networks using standardized payment tokens.",
        icon: Globe,
      },
      {
        title: "Trump Cyberstrategy Alignment",
        desc: "ORBIT infrastructure aligns with the March 2026 Cyber Strategy for America: rapid agentic AI deployment, post-quantum cryptography adoption, zero-trust architecture, and public-private coordination for critical infrastructure defense.",
        icon: Swords,
      },
      {
        title: "Military-Grade Agent Security",
        desc: "Hardened agent infrastructure meeting DoD and intelligence community requirements. Air-gapped operation, classified network compatibility, ITAR-compliant key management, and sovereign identity frameworks for defense-grade autonomous systems.",
        icon: Crosshair,
      },
    ],
  },
  {
    title: "Transaction & Coordination Layer",
    subtitle: "The infrastructure layer machines require to operate",
    items: [
      {
        title: "X402 Payment Protocol",
        desc: "Machine-native payment infrastructure built on HTTP 402. Sub-cent micropayments, programmatic invoicing, cross-network settlement, and autonomous treasury management for agent economies.",
        icon: Zap,
      },
      {
        title: "Coordination at Scale",
        desc: "Protocol design for coordinating billions of autonomous agents across enterprise, military, government, and space environments. Hierarchical consensus, sharded registries, and real-time state synchronization.",
        icon: Target,
      },
      {
        title: "Defense & National Security",
        desc: "Post-quantum-hardened transaction infrastructure for military and intelligence applications. CRYSTALS-Kyber key exchange, air-gapped operation, classified network compatibility, and NIST-approved quantum-safe algorithms.",
        icon: Swords,
      },
      {
        title: "Cross-Domain Interoperability",
        desc: "Bridging agent ecosystems across enterprise, defense, civilian, and space domains. Compatible with Mastercard Agent Pay, Stripe Shared Payment Tokens, and Google AP2 mandates for unified agentic commerce.",
        icon: Crosshair,
      },
    ],
  },
  {
    title: "Agent Sovereignty and Decentralized Autonomy",
    subtitle: "Preventing the weaponization and surveillance capture of autonomous systems",
    items: [
      {
        title: "Self-Sovereign Agent Identity",
        desc: "Non-custodial, on-chain identity infrastructure ensuring no platform provider, government, or corporation can revoke, surveil, or commandeer an agent's identity without the operator's explicit cryptographic consent.",
        icon: Shield,
      },
      {
        title: "Censorship-Resistant Settlement",
        desc: "Permissionless transaction infrastructure immune to government currency censorship, wallet freezing, and surveillance of machine-to-machine commerce. Agents transact freely across borders and jurisdictions.",
        icon: Lock,
      },
      {
        title: "Anti-Weaponization Architecture",
        desc: "Protocol-level enforcement preventing autonomous robots and AI systems from being redirected for mass surveillance, autonomous weapons deployment, or warrantless monitoring without human authorization.",
        icon: Shield,
      },
      {
        title: "Zero-Knowledge Compliance",
        desc: "Privacy-preserving payment proofs enabling agents to demonstrate authorization and solvency without exposing identity, location, counterparties, or operational context to any third party, including governments.",
        icon: Lock,
      },
    ],
  },
];

export default function Research() {
  useSEO({ title: "Research", description: "Frontier research in autonomous agents, robotics, post-quantum cryptography, space infrastructure, and agentic commerce policy." });
  return (
    <div className="min-h-screen pt-20 lg:pt-32 pb-16 lg:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-md overflow-hidden mb-12 lg:mb-20"
          data-testid="section-research-hero"
        >
          <img
            src="/images/earth-orbit.png"
            alt="Earth from orbit"
            className="w-full h-[320px] sm:h-[400px] lg:h-[480px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 lg:p-16">
            <span className="font-mono text-[10px] tracking-widest text-orange-500/70 uppercase mb-4 block" data-testid="text-research-label">
              Research & Development
            </span>
            <h1 className="font-display font-bold text-2xl sm:text-4xl lg:text-5xl text-white tracking-tight mb-4 max-w-2xl" data-testid="text-research-title">
              What We Are Building and Why
            </h1>
            <p className="text-sm sm:text-base text-white/40 max-w-xl leading-relaxed" data-testid="text-research-subtitle">
              The foundational research behind coordinating autonomous AI agents, robots, and machines at planetary scale.
            </p>
            <div className="mt-6">
              <ShareButton
                text="ORBIT research: quantum-safe cryptography, agent sovereignty, anti-weaponization architecture, and decentralized coordination for the machine economy."
                label="Share Research"
              />
            </div>
          </div>
        </motion.div>

        <div className="space-y-16 lg:space-y-24">
          {researchDomains.map((domain, domainIdx) => (
            <motion.div
              key={domain.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              data-testid={`section-research-domain-${domainIdx}`}
            >
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-1.5 h-8 bg-orange-500 rounded-full" />
                  <h2 className="font-display font-bold text-2xl lg:text-3xl tracking-tight">
                    {domain.title}
                  </h2>
                </div>
                <p className="text-muted-foreground text-base ml-5 pl-1">
                  {domain.subtitle}
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                {domain.items.map((item, i) => (
                  <div
                    key={item.title}
                    className="p-6 lg:p-8 rounded-md border border-border/50 bg-white/[0.02] hover-elevate"
                    data-testid={`card-research-${domainIdx}-${i}`}
                  >
                    <div className="w-10 h-10 rounded-md bg-orange-500/10 flex items-center justify-center mb-4">
                      <item.icon className="w-5 h-5 text-orange-500" />
                    </div>
                    <h3 className="font-display font-semibold text-lg mb-2 tracking-tight">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 relative rounded-md overflow-hidden"
          data-testid="section-research-vision"
        >
          <img
            src="/images/quantum-bg.png"
            alt="Quantum visualization"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-black/50" />
          <div className="relative p-6 sm:p-8 lg:p-16">
            <div className="max-w-2xl">
              <span className="font-mono text-xs tracking-widest text-orange-500/80 uppercase mb-4 block">
                Research Thesis
              </span>
              <h2 className="font-display font-bold text-2xl lg:text-4xl text-white tracking-tight mb-4">
                Machines will need their own economy.
              </h2>
              <p className="text-white/50 leading-relaxed mb-4">
                As autonomous agents and robots scale from thousands to billions, they will require standardized identity, payment, and coordination infrastructure. Without a unified transaction layer, the machine economy fragments into incompatible silos.
              </p>
              <p className="text-white/50 leading-relaxed">
                ORBIT research is focused on building the protocols, cryptographic standards, and infrastructure that make autonomous machine coordination possible, from enterprise data centers to interplanetary compute networks.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
