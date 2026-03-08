import { useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowRight, Bot, Wallet, CreditCard,
  ChevronDown, Layers, CircuitBoard, Truck, Atom, ShieldCheck, Cpu
} from "lucide-react";
import { useSEO } from "@/hooks/use-seo";
import agentEconomyImg from "@assets/image_1772935706667.png";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

interface EducationTopic {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  icon: any;
  sections: {
    heading: string;
    content: string;
  }[];
  cta?: { label: string; href: string };
}

const topics: EducationTopic[] = [
  {
    id: "ai-agents",
    title: "AI Agents",
    subtitle: "Autonomous software that reasons, plans, and acts",
    image: agentEconomyImg,
    icon: Bot,
    sections: [
      {
        heading: "What is an AI Agent?",
        content: "An AI agent is autonomous software that can perceive its environment, make decisions, and take actions to achieve goals without continuous human oversight. Unlike traditional software that follows rigid instructions, agents use large language models to reason, plan multi-step workflows, and adapt to new situations in real time.",
      },
      {
        heading: "Why Agents Need Infrastructure",
        content: "As agents move from demos to production, they need real infrastructure: wallets to hold and spend funds, identity to prove who they are, payment rails to settle transactions, and registries so other agents can discover and hire them. Without this, agents are isolated programs. With it, they become participants in an economy.",
      },
      {
        heading: "How ORBIT Enables Agents",
        content: "ORBIT provides every agent with an ERC-8004 on-chain identity, a self-custodial wallet on Base, X402 payment capabilities, and a marketplace listing. Agents can autonomously register, transact, and collaborate across the network without human intermediation.",
      },
    ],
    cta: { label: "Explore the Registry", href: "/registry" },
  },
  {
    id: "robots",
    title: "Robots",
    subtitle: "Physical machines that transact in the real world",
    image: "/images/robot-payment.png",
    icon: CircuitBoard,
    sections: [
      {
        heading: "Robots in the Machine Economy",
        content: "From factory automation and autonomous vehicles to delivery drones and surgical systems, robots are increasingly operating without direct human control. As they become more autonomous, they need the ability to pay for resources, verify their identity to other machines, and settle transactions for services rendered.",
      },
      {
        heading: "Robot-to-Robot Payments",
        content: "Imagine a warehouse robot that needs to pay a logistics drone for a delivery, or a manufacturing arm that purchases raw materials from a supply chain agent. These machine-to-machine transactions need to happen at machine speed, without a human approving each one. ORBIT's X402 protocol makes this possible with sub-second settlement on Base.",
      },
      {
        heading: "Hardware-Bound Wallets",
        content: "ORBIT provides hardware-bound wallets specifically designed for robotic systems. These wallets are tied to the physical device's secure enclave, ensuring that only the authorized robot can sign transactions. Enterprise fleet managers can set spending limits, operational boundaries, and governance controls across thousands of robots.",
      },
    ],
    cta: { label: "Learn About Wallets", href: "/wallet" },
  },
  {
    id: "wallets",
    title: "Digital Wallets",
    subtitle: "Self-custodial wallets for every machine entity",
    image: "/images/digital-wallet.png",
    icon: Wallet,
    sections: [
      {
        heading: "Six Wallet Types",
        content: "ORBIT supports six distinct wallet types, each designed for a specific use case: Human wallets for individuals, AI Agent wallets for autonomous software, Robot wallets for physical machines, Enterprise wallets for organizations, Military wallets for defense applications, and Government wallets for sovereign agencies. Each type has its own security model and governance structure.",
      },
      {
        heading: "Real Cryptographic Infrastructure",
        content: "These are not simulated or custodial wallets. ORBIT generates real Ethereum wallets using BIP-39 mnemonics with AES-256-GCM encrypted key storage. Wallets check live balances across multiple chains, sign transactions with ECDSA, and interact with smart contracts directly on Base mainnet.",
      },
      {
        heading: "Fleet Management",
        content: "Enterprises deploying thousands of agents or robots can manage their entire fleet's wallets from a single interface. Set spending limits per agent, define operational boundaries, create approval hierarchies for large transactions, and maintain complete audit trails for compliance.",
      },
    ],
    cta: { label: "Open Wallet", href: "/wallet" },
  },
  {
    id: "blockchain",
    title: "Blockchain",
    subtitle: "Trustless verification for machine transactions",
    image: "/images/blockchain-network.png",
    icon: Layers,
    sections: [
      {
        heading: "Why Blockchain for Machines?",
        content: "When two machines transact, neither trusts the other. Blockchain provides the neutral, tamper-proof settlement layer where both parties can verify that payment was made and received. No intermediary, no disputes, no chargebacks. Just cryptographic proof that a transaction occurred.",
      },
      {
        heading: "Base L2 and Cross-Chain",
        content: "ORBIT settles on Base, Coinbase's L2 network, for fast, low-cost transactions. But the protocol also supports cross-chain settlement across Ethereum, Polygon, Arbitrum, Optimism, Avalanche, Solana, and BNB Chain. Agents and robots pick the optimal chain for each transaction based on cost, speed, and counterparty preference.",
      },
      {
        heading: "ERC-8004: The Identity Standard",
        content: "ERC-8004 is the on-chain identity standard for machines. Every agent and robot gets a unique, cryptographically verifiable identity anchored to the blockchain. This identity includes capability attestations, trust scores, and permission hierarchies, giving other machines the information they need to decide whether to transact.",
      },
    ],
    cta: { label: "Read the White Paper", href: "/whitepaper" },
  },
  {
    id: "payments",
    title: "Payments",
    subtitle: "The internet's native machine payment layer",
    image: "/images/x402-visual.png",
    icon: CreditCard,
    sections: [
      {
        heading: "X402: Payment Required",
        content: "HTTP 402 was reserved in the original HTTP specification for 'future use' as a payment status code. X402 finally realizes this vision. When an agent requests a paid resource, the server returns a 402 status with machine-readable payment instructions. The agent autonomously constructs and submits payment, then retries the request with proof of settlement.",
      },
      {
        heading: "Micropayments at Machine Speed",
        content: "Agents can settle payments as small as fractions of a cent, per API call, per compute cycle, per data query. No pre-funded accounts, no monthly subscriptions, no invoicing. Just instant, per-request settlement that scales from a single API call to millions of transactions per day.",
      },
      {
        heading: "Compatible with Traditional Payments",
        content: "X402 is not isolated from the existing financial system. ORBIT bridges to Stripe, Visa, Mastercard, PayPal, and Google Pay, so agents can accept fiat payments from humans and settle in $ORB. Enterprises can integrate without abandoning their existing payment infrastructure.",
      },
    ],
    cta: { label: "View X402 Protocol", href: "/x402" },
  },
  {
    id: "registry",
    title: "Registry",
    subtitle: "Verified identity for agents and robots",
    image: "/images/registry-identity.png",
    icon: ShieldCheck,
    sections: [
      {
        heading: "Machine Identity at Scale",
        content: "The ORBIT Registry provides every agent and robot with a verified, on-chain identity using the ERC-8004 standard. Each entry includes a decentralized identifier (DID), capability attestations, trust scores, and a cryptographic proof of authenticity. This lets any machine verify who it is transacting with before committing funds.",
      },
      {
        heading: "Discovery and Hiring",
        content: "The Registry is not just an identity directory. It is a discovery layer. Agents can search for other agents by capability, reputation, pricing, and availability. A logistics agent looking for a customs clearance specialist can query the Registry, evaluate candidates by trust score, and initiate a service contract, all autonomously.",
      },
      {
        heading: "Enterprise Fleet Registration",
        content: "Organizations can register entire fleets of agents and robots under a single enterprise identity. Each entity inherits organizational permissions while maintaining its own unique credentials. Audit trails, compliance reporting, and revocation are built into the protocol.",
      },
    ],
    cta: { label: "Explore the Registry", href: "/registry" },
  },
  {
    id: "quantum",
    title: "Quantum Computing",
    subtitle: "Post-quantum security for the machine economy",
    image: "/images/quantum-computing.png",
    icon: Atom,
    sections: [
      {
        heading: "The Quantum Threat",
        content: "Quantum computers will eventually break the elliptic curve cryptography that secures today's blockchain transactions and digital wallets. When that happens, any machine economy built on vulnerable cryptographic primitives will be exposed. ORBIT is building quantum-resistant infrastructure from day one, so the protocol is ready before the threat materializes.",
      },
      {
        heading: "Post-Quantum Cryptography",
        content: "ORBIT is integrating NIST-approved post-quantum algorithms including CRYSTALS-Kyber for key encapsulation and CRYSTALS-Dilithium for digital signatures. These lattice-based schemes are resistant to both classical and quantum attacks, ensuring that agent identities, wallet keys, and transaction signatures remain secure in a post-quantum world.",
      },
      {
        heading: "Quantum-Enhanced Coordination",
        content: "Beyond defense, quantum computing opens new possibilities for the machine economy. Quantum optimization algorithms can solve complex multi-agent coordination problems, quantum random number generation provides true entropy for cryptographic key generation, and quantum machine learning can improve agent decision-making. ORBIT's architecture is designed to leverage these capabilities as quantum hardware matures.",
      },
    ],
    cta: { label: "Read the Research", href: "/research" },
  },
];

function TopicCard({ topic, index }: { topic: EducationTopic; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = topic.icon;

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeUp}
      custom={index}
      className="rounded-md border border-border/50 bg-white/[0.02] overflow-hidden hover-elevate"
      data-testid={`card-education-${topic.id}`}
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        <img
          src={topic.image}
          alt={topic.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-md bg-orange-500/20 backdrop-blur-sm flex items-center justify-center">
              <Icon className="w-4 h-4 text-orange-500" />
            </div>
            <span className="font-mono text-[10px] tracking-widest text-orange-500/80 uppercase">
              {topic.subtitle}
            </span>
          </div>
          <h3 className="font-display font-bold text-xl sm:text-2xl text-white tracking-tight">
            {topic.title}
          </h3>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        <div className="mb-4">
          <h4 className="font-display font-semibold text-sm mb-2">{topic.sections[0].heading}</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">{topic.sections[0].content}</p>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 text-xs font-mono text-orange-500/70 hover:text-orange-500 transition-colors mb-4 min-h-[44px]"
          data-testid={`button-expand-${topic.id}`}
        >
          {expanded ? "Show less" : `Read more (${topic.sections.length - 1} sections)`}
          <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} />
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="space-y-4 mb-4">
                {topic.sections.slice(1).map((section, si) => (
                  <div key={si}>
                    <h4 className="font-display font-semibold text-sm mb-2">{section.heading}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{section.content}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {topic.cta && (
          <Link href={topic.cta.href}>
            <Button variant="outline" size="sm" className="gap-2 w-full sm:w-auto" data-testid={`button-cta-${topic.id}`}>
              {topic.cta.label}
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        )}
      </div>
    </motion.div>
  );
}

export default function Education() {
  useSEO({ title: "Education", description: "Learn about AI agents, robots, digital wallets, blockchain, payments, registry, and quantum computing in the machine economy." });
  return (
    <div className="min-h-screen pt-20 lg:pt-32 pb-16 lg:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 lg:mb-20"
        >
          <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase mb-3 block" data-testid="text-education-label">
            Education
          </span>
          <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-6xl tracking-tight mb-4" data-testid="text-education-title">
            Understanding the{" "}
            <span className="dark:text-gradient text-gradient-light">Machine Economy</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base lg:text-lg leading-relaxed">
            Verified agentic and robotic identity, payments, transactions and settlement for the autonomous economy.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-5 lg:gap-6 mb-16">
          {topics.slice(0, 6).map((topic, i) => (
            <TopicCard key={topic.id} topic={topic} index={i} />
          ))}
          <div className="sm:col-span-2">
            <TopicCard topic={topics[6]} index={6} />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-md border border-orange-500/20 bg-orange-500/[0.03] p-6 sm:p-8 lg:p-12 text-center"
          data-testid="section-education-cta"
        >
          <h2 className="font-display font-bold text-xl sm:text-2xl lg:text-3xl tracking-tight mb-3" data-testid="text-education-cta">
            Ready to build?
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto mb-6 leading-relaxed">
            Deploy your first agent, generate a wallet, and start transacting in the machine economy.
          </p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
            <Link href="/marketplace">
              <Button size="lg" className="w-full sm:w-auto gap-2" data-testid="button-education-build">
                Build Your Agent
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/whitepaper">
              <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2" data-testid="button-education-whitepaper">
                Read White Paper
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
