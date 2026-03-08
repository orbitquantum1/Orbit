import { useMemo } from "react";
import { useSEO } from "@/hooks/use-seo";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Server, Zap, Globe, Shield, CreditCard, FileCode, ArrowLeftRight, Lock, Layers, Clock, CheckCircle, XCircle, AlertTriangle, Banknote, Building2, Smartphone, Network } from "lucide-react";
import { SiStripe, SiVisa, SiMastercard, SiPaypal, SiGooglepay } from "react-icons/si";

const protocolSteps = [
  {
    step: "01",
    title: "Agent Sends Request",
    desc: "An autonomous AI agent or robot sends a standard HTTP request to a resource or API endpoint. The request includes the agent's ERC-8004 identity and cryptographic signature.",
    icon: Server,
  },
  {
    step: "02",
    title: "Server Returns 402",
    desc: "The server responds with HTTP 402 Payment Required, including a machine-readable payment header specifying the price, accepted tokens, settlement network, and payment address.",
    icon: AlertTriangle,
  },
  {
    step: "03",
    title: "Agent Constructs Payment",
    desc: "The agent autonomously constructs a payment transaction using its ORBIT wallet. It selects the optimal token, network, and gas strategy based on its treasury management policies.",
    icon: CreditCard,
  },
  {
    step: "04",
    title: "Payment Settlement",
    desc: "The payment is submitted on-chain and settled. The agent includes the transaction proof in a follow-up request. The server verifies settlement and grants access to the resource.",
    icon: CheckCircle,
  },
];

const responseHeaders = [
  { field: "X-Payment-Required", value: "true", desc: "Indicates payment is required" },
  { field: "X-Payment-Amount", value: "0.00025", desc: "Price in specified token" },
  { field: "X-Payment-Token", value: "ORB-USD", desc: "Accepted payment token" },
  { field: "X-Payment-Network", value: "base", desc: "Settlement network" },
  { field: "X-Payment-Address", value: "0x7f...a3b2", desc: "Recipient address" },
  { field: "X-Payment-Expires", value: "1720000000", desc: "Payment deadline (UNIX)" },
];

const capabilities = [
  {
    icon: Zap,
    title: "Sub-Cent Micropayments",
    desc: "Settle payments as small as fractions of a cent. Agents pay per API call, per compute cycle, per data query. No minimum thresholds, no pre-funded accounts required.",
  },
  {
    icon: Globe,
    title: "Cross-Network Settlement",
    desc: "Interoperable across L1 chains, L2 rollups, and enterprise payment rails. Agents select the optimal settlement network based on cost, speed, and counterparty requirements.",
  },
  {
    icon: Lock,
    title: "Cryptographic Verification",
    desc: "Every payment includes cryptographic proof of settlement. Servers verify on-chain transaction receipts before granting resource access. No trusted intermediaries required.",
  },
  {
    icon: FileCode,
    title: "Programmable Invoicing",
    desc: "Smart-contract-based invoicing and receipt generation. Agents generate, validate, and settle invoices autonomously with verifiable proof of delivery and service completion.",
  },
  {
    icon: ArrowLeftRight,
    title: "Bidirectional Payments",
    desc: "Agents can both pay for and charge for services. A compute agent pays for data access while simultaneously charging for inference results, all within a single session.",
  },
  {
    icon: Layers,
    title: "Streaming Payments",
    desc: "Continuous payment streams for long-running services. Agents establish payment channels for ongoing compute, bandwidth, or data access with per-second settlement granularity.",
  },
];

const useCases = [
  {
    title: "API Monetization",
    desc: "AI agents pay per API call without subscriptions or API keys. Service providers monetize endpoints with zero onboarding friction for autonomous consumers.",
    icon: Server,
  },
  {
    title: "Compute Markets",
    desc: "Agents purchase GPU compute, inference capacity, and processing power on-demand. Pay-per-token for LLM inference, pay-per-cycle for specialized compute workloads.",
    icon: Zap,
  },
  {
    title: "Data Marketplaces",
    desc: "Autonomous agents purchase datasets, real-time feeds, and proprietary data. Micropayments enable granular access: pay per row, per query, per data point.",
    icon: Globe,
  },
  {
    title: "Supply Chain Settlement",
    desc: "Robots and autonomous systems settle supply chain transactions. Raw material procurement, logistics payments, and manufacturing settlements without human intermediaries.",
    icon: ArrowLeftRight,
  },
];

const lifecycle = [
  { status: "Discovery", desc: "Agent discovers a paid resource via standard HTTP", icon: Globe, color: "text-gray-400" },
  { status: "Negotiation", desc: "Server specifies price, token, and network requirements", icon: FileCode, color: "text-orange-400" },
  { status: "Authorization", desc: "Agent's wallet authorizes payment within policy limits", icon: Shield, color: "text-orange-500" },
  { status: "Settlement", desc: "On-chain payment is submitted and confirmed", icon: Clock, color: "text-orange-600" },
  { status: "Verification", desc: "Server verifies transaction receipt on-chain", icon: CheckCircle, color: "text-gray-500" },
  { status: "Fulfillment", desc: "Resource access is granted with cryptographic receipt", icon: Lock, color: "text-white" },
];

function StarField() {
  const stars = useMemo(() => Array.from({ length: 60 }, (_, i) => {
    const seed = (i * 7919 + 104729) % 100000;
    const r = (n: number) => ((seed * (n + 1) * 13397) % 10000) / 10000;
    return {
      id: i,
      x: r(0) * 100,
      y: r(1) * 100,
      size: r(2) * 1.5 + 0.5,
      opacity: r(3) * 0.4 + 0.1,
      duration: r(4) * 4 + 3,
      delay: r(5) * 5,
    };
  }), []);
  return (
    <div className="absolute inset-0 overflow-hidden">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
          }}
          animate={{ opacity: [star.opacity, star.opacity * 2.5, star.opacity] }}
          transition={{ duration: star.duration, repeat: Infinity, delay: star.delay, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

export default function X402() {
  useSEO({ title: "X402 Payment Protocol", description: "The internet's native machine payment layer. HTTP 402 Payment Required realized for autonomous agent micropayments." });
  return (
    <div className="min-h-screen pt-20 lg:pt-32 pb-16 lg:pb-24 relative">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img
          src="/images/x402-space-hero.png"
          alt=""
          className="w-full h-full object-cover opacity-[0.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black" />
        <StarField />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-md overflow-hidden mb-12 lg:mb-20"
          data-testid="section-x402-hero"
        >
          <img
            src="/images/x402-space-hero.png"
            alt="Orbital payment network"
            className="w-full h-[320px] sm:h-[400px] lg:h-[480px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 lg:p-16">
            <span className="font-mono text-[10px] tracking-widest text-orange-500/70 uppercase mb-4 block" data-testid="text-x402-label">
              Payment Protocol Specification
            </span>
            <h1 className="font-display font-bold text-2xl sm:text-4xl lg:text-5xl text-white tracking-tight mb-4 max-w-2xl" data-testid="text-x402-title">
              How Machines Pay Each Other
            </h1>
            <p className="text-sm sm:text-base text-white/40 max-w-xl leading-relaxed" data-testid="text-x402-subtitle">
              X402 lets AI agents and robots send and receive payments automatically, no human needed.
            </p>
          </div>
        </motion.div>

        <section className="mb-16 lg:mb-24" data-testid="section-x402-flow">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <span className="font-mono text-xs tracking-widest text-orange-500/80 uppercase mb-3 block">
              Request / Response Flow
            </span>
            <h2 className="font-display font-bold text-2xl lg:text-4xl tracking-tight mb-3">
              How X402{" "}
              <span className="text-gradient">works.</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl text-base lg:text-lg leading-relaxed">
              A four-step process from initial request to resource access. Every step is fully autonomous and machine-readable.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-5">
            {protocolSteps.map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="p-6 lg:p-8 rounded-md border border-border/50 bg-white/[0.02] hover-elevate"
                data-testid={`card-x402-step-${i}`}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-md bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                    <s.icon className="w-5 h-5 text-orange-500" />
                  </div>
                  <span className="font-mono text-sm text-orange-500/70">STEP {s.step}</span>
                </div>
                <h3 className="font-display font-semibold text-lg mb-2 tracking-tight">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mb-16 lg:mb-24" data-testid="section-x402-response">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <span className="font-mono text-xs tracking-widest text-orange-500/80 uppercase mb-3 block">
              402 Response Headers
            </span>
            <h2 className="font-display font-bold text-2xl lg:text-4xl tracking-tight mb-3">
              Machine-readable{" "}
              <span className="text-gradient">payment instructions.</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl text-base lg:text-lg leading-relaxed">
              When a server returns HTTP 402, it includes structured headers that agents parse to construct payment transactions automatically.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-md border border-border/50 bg-white/[0.02] overflow-x-auto"
            data-testid="table-x402-headers"
          >
            <div className="p-4 lg:p-6 border-b border-border/30">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-400" />
                  <span className="font-mono text-sm text-red-400">HTTP/1.1 402 Payment Required</span>
                </div>
              </div>
            </div>
            <div className="divide-y divide-border/20">
              {responseHeaders.map((h, i) => (
                <div key={h.field} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 p-4 lg:px-6" data-testid={`row-header-${i}`}>
                  <span className="font-mono text-sm text-orange-500 sm:w-56 flex-shrink-0">{h.field}</span>
                  <span className="font-mono text-sm text-foreground/80 sm:w-40 flex-shrink-0">{h.value}</span>
                  <span className="text-sm text-muted-foreground">{h.desc}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        <section className="mb-16 lg:mb-24" data-testid="section-x402-lifecycle">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <span className="font-mono text-xs tracking-widest text-orange-500/80 uppercase mb-3 block">
              Payment Lifecycle
            </span>
            <h2 className="font-display font-bold text-2xl lg:text-4xl tracking-tight mb-3">
              End-to-end{" "}
              <span className="text-gradient">payment lifecycle.</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl text-base lg:text-lg leading-relaxed">
              From resource discovery to cryptographic receipt, every stage of the X402 payment lifecycle is designed for autonomous operation.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {lifecycle.map((l, i) => (
              <motion.div
                key={l.status}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.5 }}
                className="p-6 rounded-md border border-border/50 bg-white/[0.02] hover-elevate"
                data-testid={`card-lifecycle-${i}`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-md bg-orange-500/10 flex items-center justify-center">
                    <l.icon className={`w-5 h-5 ${l.color}`} />
                  </div>
                  <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase">Phase {i + 1}</span>
                </div>
                <h3 className="font-display font-semibold text-base mb-2 tracking-tight">{l.status}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{l.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mb-16 lg:mb-24" data-testid="section-x402-capabilities">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <span className="font-mono text-xs tracking-widest text-orange-500/80 uppercase mb-3 block">
              Protocol Capabilities
            </span>
            <h2 className="font-display font-bold text-2xl lg:text-4xl tracking-tight mb-3">
              Built for the{" "}
              <span className="text-gradient">machine economy.</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl text-base lg:text-lg leading-relaxed">
              X402 goes beyond simple request-response payments. It supports the full range of economic interactions that autonomous agents require.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {capabilities.map((c, i) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.5 }}
                className="p-6 lg:p-8 rounded-md border border-border/50 bg-white/[0.02] hover-elevate"
                data-testid={`card-capability-${i}`}
              >
                <div className="w-10 h-10 rounded-md bg-orange-500/10 flex items-center justify-center mb-4">
                  <c.icon className="w-5 h-5 text-orange-500" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2 tracking-tight">{c.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mb-16 lg:mb-24" data-testid="section-x402-integration">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <span className="font-mono text-xs tracking-widest text-orange-500/80 uppercase mb-3 block">
              Integration Details
            </span>
            <h2 className="font-display font-bold text-2xl lg:text-4xl tracking-tight mb-3">
              Integration{" "}
              <span className="text-gradient">patterns.</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl text-base lg:text-lg leading-relaxed">
              X402 is designed as a drop-in protocol layer. Any HTTP server can become payment-aware, and any agent with an ORBIT wallet can pay.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-5">
            {useCases.map((u, i) => (
              <motion.div
                key={u.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-start gap-4 p-6 rounded-md border border-border/30 bg-white/[0.015]"
                data-testid={`card-usecase-${i}`}
              >
                <div className="w-10 h-10 rounded-md bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                  <u.icon className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-base mb-1">{u.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{u.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mb-16 lg:mb-24" data-testid="section-x402-rails">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <span className="font-mono text-xs tracking-widest text-orange-500/80 uppercase mb-3 block">
              Payment Network Compatibility
            </span>
            <h2 className="font-display font-bold text-2xl lg:text-4xl tracking-tight mb-3">
              Works alongside{" "}
              <span className="text-gradient">traditional rails.</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl text-base lg:text-lg leading-relaxed">
              X402 is not a replacement for existing payment infrastructure. It bridges crypto-native agent payments with the traditional networks that already move trillions of dollars.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
            {[
              {
                name: "Stripe",
                icon: SiStripe,
                role: "Fiat On-Ramp & Payouts",
                desc: "Agents trigger Stripe payment intents to accept credit cards, issue payouts, and bridge fiat currency into on-chain settlements. Stripe Connect enables agent-to-agent payouts in USD.",
              },
              {
                name: "Visa / Mastercard",
                icon: SiVisa,
                role: "Card Network Settlement",
                desc: "Human users pay agents with traditional cards. ORBIT converts card payments into on-chain settlement receipts that agents can verify and reconcile automatically.",
              },
              {
                name: "PayPal",
                icon: SiPaypal,
                role: "Consumer & SMB Bridge",
                desc: "PayPal integration lets smaller businesses and individual users interact with ORBIT agents without crypto wallets. Agents receive payment confirmation via webhook and settle on-chain.",
              },
              {
                name: "Google Pay",
                icon: SiGooglepay,
                role: "Mobile & Web Payments",
                desc: "One-tap payments from mobile devices and web browsers. Google Pay tokens are converted to on-chain settlement, letting users hire agents from any device without managing wallets.",
              },
              {
                name: "ACH / Wire",
                icon: Building2,
                role: "Enterprise Bank Settlement",
                desc: "Enterprise-grade bank transfers for large agent fleet deployments. Businesses fund agent treasuries via ACH, and agents settle between themselves on Base at machine speed.",
              },
              {
                name: "Stablecoin Bridge",
                icon: Banknote,
                role: "ORB-USD Settlement Layer",
                desc: "The ORBIT stablecoin (ORB-USD) sits between traditional and crypto rails. Agents hold and transact in ORB-USD for predictable pricing while settling on Base with sub-cent fees.",
              },
            ].map((rail, i) => (
              <motion.div
                key={rail.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.5 }}
                className="p-6 rounded-md border border-border/50 bg-white/[0.02] hover-elevate"
                data-testid={`card-rail-${i}`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-md bg-orange-500/10 flex items-center justify-center">
                    <rail.icon className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-sm tracking-tight">{rail.name}</h3>
                    <span className="text-[10px] text-orange-500 font-mono">{rail.role}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{rail.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-6 rounded-md border border-border/30 bg-white/[0.015]"
            data-testid="card-payment-flow"
          >
            <div className="flex items-center gap-3 mb-4">
              <Network className="w-5 h-5 text-orange-500" />
              <h3 className="font-display font-semibold text-base tracking-tight">How It Connects</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              A human pays with their Visa card via Stripe. Stripe confirms the charge and triggers an ORBIT webhook. The agent receives an on-chain settlement receipt on Base. The agent can now spend that balance to hire sub-agents, purchase compute, or pay for data -- all settled on-chain via X402. Traditional money flows in, machine-native payments flow between agents.
            </p>
            <div className="flex items-center gap-2 flex-wrap text-[10px] font-mono text-muted-foreground">
              <span className="px-2 py-1 rounded-md bg-white/[0.05] border border-border/30">Visa/Mastercard</span>
              <span className="text-orange-500">&#8594;</span>
              <span className="px-2 py-1 rounded-md bg-white/[0.05] border border-border/30">Stripe</span>
              <span className="text-orange-500">&#8594;</span>
              <span className="px-2 py-1 rounded-md bg-white/[0.05] border border-border/30">ORBIT Webhook</span>
              <span className="text-orange-500">&#8594;</span>
              <span className="px-2 py-1 rounded-md bg-orange-500/10 border border-orange-500/30 text-orange-500">On-Chain Settlement (Base)</span>
              <span className="text-orange-500">&#8594;</span>
              <span className="px-2 py-1 rounded-md bg-white/[0.05] border border-border/30">Agent-to-Agent (X402)</span>
            </div>
          </motion.div>
        </section>

        <section data-testid="section-x402-cta">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-md overflow-hidden"
          >
            <img
              src="/images/x402-space-hero.png"
              alt="Orbital payment network"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-black/50" />
            <div className="relative p-6 sm:p-8 lg:p-16">
              <div className="max-w-xl">
                <span className="font-mono text-xs tracking-widest text-orange-500/80 uppercase mb-4 block">
                  Get Started
                </span>
                <h2 className="font-display font-bold text-2xl lg:text-4xl text-white tracking-tight mb-4">
                  Build on X402.
                </h2>
                <p className="text-white/50 leading-relaxed mb-8">
                  X402 is the payment protocol for the autonomous economy. Read the white paper for the complete technical specification, or explore the ORBIT Protocol to see how agents use X402 in production.
                </p>
                <div className="flex items-center gap-3 flex-wrap">
                  <Link href="/whitepaper">
                    <Button size="lg" data-testid="button-x402-whitepaper">
                      Read White Paper
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                  <Link href="/about">
                    <Button size="lg" variant="outline" className="backdrop-blur-sm bg-white/5 border-white/15 text-white" data-testid="button-x402-about">
                      About ORBIT
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
