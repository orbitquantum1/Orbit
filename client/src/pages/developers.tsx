import { motion } from "framer-motion";
import { useSEO } from "@/hooks/use-seo";
import { Code, Terminal, BookOpen, GitBranch, Package, Zap, Shield, Globe, Cpu, FileCode, ArrowRight, ExternalLink, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const sdkLanguages = [
  {
    title: "JavaScript / TypeScript",
    desc: "Full-featured SDK for Node.js and browser environments. Type-safe client with auto-generated types from the ORBIT API schema.",
    install: "npm install @orbit/sdk",
    icon: FileCode,
  },
  {
    title: "Python",
    desc: "Python SDK with async support, type hints, and seamless integration with popular AI frameworks like LangChain and AutoGPT.",
    install: "pip install orbit-sdk",
    icon: Terminal,
  },
  {
    title: "Rust",
    desc: "High-performance Rust crate for latency-critical applications, embedded systems, and robotics platforms requiring zero-cost abstractions.",
    install: "cargo add orbit-sdk",
    icon: Cpu,
  },
  {
    title: "Go",
    desc: "Lightweight Go module for microservices, cloud-native deployments, and infrastructure tooling with minimal dependencies.",
    install: "go get github.com/orbitquantum1/sdk-go",
    icon: Package,
  },
];

const apiCategories = [
  {
    category: "X402 Payment Protocol",
    endpoints: [
      { method: "POST", path: "/api/x402/request", desc: "Initiate an X402 payment request. Returns HTTP 402 with machine-readable payment headers (amount, token, network, recipient, expiration, signature).", live: true },
      { method: "POST", path: "/api/x402/verify", desc: "Verify a payment transaction proof. Validates cryptographic signature and returns a signed receipt on success.", live: true },
      { method: "POST", path: "/api/x402/invoice", desc: "Generate a programmable invoice with line items, due dates, payment terms, and callback URLs.", live: true },
      { method: "GET", path: "/api/x402/status/:txId", desc: "Check payment status for a transaction. Returns full details including amounts, timestamps, and expiration.", live: true },
    ],
  },
  {
    category: "Cross-Network Settlement",
    endpoints: [
      { method: "POST", path: "/api/settlement/initiate", desc: "Initiate cross-network settlement. Specify source/destination networks, amount, and currency.", live: true },
      { method: "GET", path: "/api/settlement/networks", desc: "List all supported settlement networks with chain IDs, types, settlement times, and currencies.", live: true },
      { method: "GET", path: "/api/settlement/fees", desc: "Get current fee schedule for cross-chain, same-chain, and gas estimates across all networks.", live: true },
      { method: "POST", path: "/api/settlement/quote", desc: "Get a settlement quote with protocol fees, gas estimates, output amount, and estimated time.", live: true },
      { method: "GET", path: "/api/settlement/status/:settlementId", desc: "Track settlement progress through initiation, fund locking, bridging, and confirmation.", live: true },
    ],
  },
  {
    category: "Identity & Attestation",
    endpoints: [
      { method: "POST", path: "/api/identity/verify", desc: "Verify an agent's ERC-8004 on-chain identity. Returns verification status, entity type, and capability proofs.", live: true },
      { method: "POST", path: "/api/identity/verify-signature", desc: "Verify a cryptographic signature against agent identity. Ed25519 signature validation.", live: true },
      { method: "GET", path: "/api/identity/resolve/:address", desc: "Resolve a wallet address to its registered identity, entity type, and trust score.", live: true },
      { method: "GET", path: "/api/attestation/:id", desc: "Retrieve capability attestation for an agent including signed proof and permission hierarchy.", live: true },
      { method: "GET", path: "/api/permissions/:entityType", desc: "Get the permission hierarchy for a given entity type (Human, AI Agent, Robot, Enterprise, Military, Government).", live: true },
      { method: "POST", path: "/api/permissions/check", desc: "Check if an entity type has a specific permission. Returns boolean authorization result.", live: true },
    ],
  },
  {
    category: "Agent Registry",
    endpoints: [
      { method: "GET", path: "/api/registry", desc: "Query the ORBIT Marketplace. Filter by entity type, capabilities, availability, and search terms.", live: true },
      { method: "GET", path: "/api/registry/:id", desc: "Retrieve full agent profile: capabilities, trust score, transaction history, ratings, and status.", live: true },
      { method: "POST", path: "/api/registry", desc: "Register a new agent or robot with ERC-8004 identity, capabilities, and wallet address.", live: true },
    ],
  },
  {
    category: "Cryptography",
    endpoints: [
      { method: "POST", path: "/api/encrypt", desc: "Encrypt data with AES-256-GCM. Returns base64 ciphertext with authentication tag.", live: true },
      { method: "POST", path: "/api/decrypt", desc: "Decrypt AES-256-GCM ciphertext. Verifies authentication tag integrity.", live: true },
    ],
  },
];

const integrationGuides = [
  {
    icon: Zap,
    title: "Quick Start",
    desc: "Get your first autonomous agent registered and transacting on ORBIT in under 5 minutes. Covers wallet creation, identity registration, and first payment.",
  },
  {
    icon: Shield,
    title: "Authentication & Security",
    desc: "API key management, JWT token flows, webhook signatures, and post-quantum cryptographic options for enterprise and defense deployments.",
  },
  {
    icon: Globe,
    title: "Cross-Network Settlement",
    desc: "Configure multi-chain payment rails, bridge integrations, and stablecoin settlement across L1/L2 networks and enterprise systems.",
  },
  {
    icon: GitBranch,
    title: "Agent Fleet Management",
    desc: "Deploy and manage fleets of autonomous agents with hierarchical permissions, spending limits, and real-time monitoring dashboards.",
  },
  {
    icon: BookOpen,
    title: "X402 Protocol Integration",
    desc: "Implement HTTP 402 payment flows in your services. Server-side middleware, client interceptors, and payment negotiation protocols.",
  },
  {
    icon: Code,
    title: "Webhook & Event Streams",
    desc: "Real-time event subscriptions for agent activity, payment confirmations, identity changes, and registry updates via WebSocket or webhooks.",
  },
];

const quickstartCode = `import { OrbitClient } from '@orbit/sdk';

const orbit = new OrbitClient({
  apiKey: process.env.ORBIT_API_KEY,
  network: 'mainnet',
});

// Register an autonomous agent
const agent = await orbit.agents.register({
  name: 'supply-chain-optimizer',
  capabilities: ['logistics', 'procurement'],
  walletType: 'ai-agent',
});

// Initiate a machine-to-machine payment
const payment = await orbit.payments.create({
  from: agent.walletAddress,
  to: '0x...',
  amount: '0.001',
  currency: 'ORB-USD',
  memo: 'API compute costs',
});

console.log('Agent ID:', agent.id);
console.log('Payment:', payment.status);`;

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      size="icon"
      variant="ghost"
      onClick={handleCopy}
      className="text-white/40 hover:text-white"
      data-testid="button-copy-code"
    >
      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
    </Button>
  );
}

function MethodBadge({ method }: { method: string }) {
  const colors: Record<string, string> = {
    GET: "text-gray-400 bg-gray-500/10",
    POST: "text-orange-400 bg-orange-500/10",
    PUT: "text-orange-500 bg-orange-500/10",
    DELETE: "text-gray-500 bg-gray-500/10",
  };
  return (
    <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${colors[method] || ""}`} data-testid={`badge-method-${method.toLowerCase()}`}>
      {method}
    </span>
  );
}

export default function Developers() {
  useSEO({ title: "Developers", description: "Build on ORBIT with TypeScript, Python, Rust, and Go SDKs. 35+ live API endpoints for wallets, identity, settlement, and registry." });
  return (
    <div className="min-h-screen pt-20 lg:pt-32 pb-16 lg:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 lg:mb-20"
        >
          <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase mb-3 block" data-testid="text-developers-label">
            Developer Documentation
          </span>
          <h1 className="font-display font-bold text-3xl lg:text-6xl tracking-tight mb-6" data-testid="text-developers-title">
            Build on{" "}
            <span className="text-gradient">ORBIT</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
            Everything you need to integrate autonomous AI agents with the ORBIT coordination layer. SDKs, API references, protocol specs, and integration guides.
          </p>
          <div className="flex items-center gap-3 mt-8 flex-wrap">
            <a href="#quickstart">
              <Button size="lg" data-testid="button-get-started">
                Get Started
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </a>
            <a href="https://github.com/orbitquantum1/Orbit" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" data-testid="button-github">
                <GitBranch className="w-4 h-4 mr-2" />
                GitHub
                <ExternalLink className="w-3 h-3 ml-1 opacity-50" />
              </Button>
            </a>
          </div>
        </motion.div>

        <section id="quickstart" className="mb-16 lg:mb-24" data-testid="section-quickstart">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1.5 h-8 bg-orange-500 rounded-full" />
              <h2 className="font-display font-bold text-2xl lg:text-3xl tracking-tight">
                Quick Start
              </h2>
            </div>
            <p className="text-muted-foreground text-base ml-5 pl-1">
              Register an agent and make your first payment in minutes
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-md border border-border/50 overflow-hidden"
            data-testid="card-quickstart-code"
          >
            <div className="flex items-center justify-between gap-3 px-4 py-3 bg-white/[0.03] border-b border-border/30">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-orange-500" />
                <span className="font-mono text-sm text-muted-foreground">quickstart.ts</span>
              </div>
              <CopyButton text={quickstartCode} />
            </div>
            <pre className="p-4 sm:p-6 overflow-x-auto text-xs sm:text-sm leading-relaxed">
              <code className="text-white/70 font-mono">{quickstartCode}</code>
            </pre>
          </motion.div>
        </section>

        <section className="mb-16 lg:mb-24" data-testid="section-sdks">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1.5 h-8 bg-orange-500 rounded-full" />
              <h2 className="font-display font-bold text-2xl lg:text-3xl tracking-tight">
                SDKs & Libraries
              </h2>
            </div>
            <p className="text-muted-foreground text-base ml-5 pl-1">
              Official client libraries for every major platform
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-5">
            {sdkLanguages.map((sdk, i) => (
              <motion.div
                key={sdk.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.5 }}
                className="p-6 lg:p-8 rounded-md border border-border/50 bg-white/[0.02] hover-elevate"
                data-testid={`card-sdk-${i}`}
              >
                <div className="w-10 h-10 rounded-md bg-orange-500/10 flex items-center justify-center mb-4">
                  <sdk.icon className="w-5 h-5 text-orange-500" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2 tracking-tight">{sdk.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{sdk.desc}</p>
                <div className="font-mono text-xs bg-white/[0.04] border border-border/30 rounded px-3 py-2 text-orange-400/80">
                  {sdk.install}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mb-16 lg:mb-24" data-testid="section-api-reference">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1.5 h-8 bg-orange-500 rounded-full" />
              <h2 className="font-display font-bold text-2xl lg:text-3xl tracking-tight">
                API Reference
              </h2>
            </div>
            <p className="text-muted-foreground text-base ml-5 pl-1">
              35+ live API endpoints across payments, settlement, identity, registry, and cryptography
            </p>
          </motion.div>

          <div className="space-y-8">
            {apiCategories.map((cat, ci) => (
              <motion.div
                key={cat.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: ci * 0.05, duration: 0.5 }}
                data-testid={`section-api-category-${ci}`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="font-mono text-xs tracking-widest text-orange-500/80 uppercase">{cat.category}</span>
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-400">LIVE</span>
                </div>
                <div className="space-y-2">
                  {cat.endpoints.map((endpoint, ei) => (
                    <div
                      key={endpoint.path}
                      className="p-4 rounded-md border border-border/50 bg-white/[0.02] hover-elevate"
                      data-testid={`card-api-endpoint-${ci}-${ei}`}
                    >
                      <div className="flex items-start gap-3 flex-wrap">
                        <MethodBadge method={endpoint.method} />
                        <span className="font-mono text-sm text-foreground/80">{endpoint.path}</span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed mt-2">{endpoint.desc}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mb-16 lg:mb-24" data-testid="section-integration-guides">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1.5 h-8 bg-orange-500 rounded-full" />
              <h2 className="font-display font-bold text-2xl lg:text-3xl tracking-tight">
                Integration Guides
              </h2>
            </div>
            <p className="text-muted-foreground text-base ml-5 pl-1">
              Step-by-step guides for common integration patterns
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {integrationGuides.map((guide, i) => (
              <motion.div
                key={guide.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.5 }}
                className="p-6 rounded-md border border-border/50 bg-white/[0.02] hover-elevate"
                data-testid={`card-guide-${i}`}
              >
                <div className="w-10 h-10 rounded-md bg-orange-500/10 flex items-center justify-center mb-4">
                  <guide.icon className="w-5 h-5 text-orange-500" />
                </div>
                <h3 className="font-display font-semibold text-base mb-2 tracking-tight">{guide.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{guide.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mb-16 lg:mb-24" data-testid="section-protocol-specs">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1.5 h-8 bg-orange-500 rounded-full" />
              <h2 className="font-display font-bold text-2xl lg:text-3xl tracking-tight">
                Protocol Specifications
              </h2>
            </div>
            <p className="text-muted-foreground text-base ml-5 pl-1">
              Technical specifications for the ORBIT protocol stack
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                title: "X402 Payment Protocol",
                version: "v1.0-draft",
                desc: "Machine-native HTTP 402 payment protocol specification. Request/response flows, payment lifecycle, header formats, and settlement mechanics.",
                link: "/x402",
              },
              {
                title: "ERC-8004 Identity",
                version: "v0.9-draft",
                desc: "On-chain identity standard for autonomous agents. Capability attestation, trust scoring, permission hierarchies, and cross-chain portability.",
                link: "/about",
              },
              {
                title: "Agent Registry Protocol",
                version: "v0.8-draft",
                desc: "Decentralized agent discovery and registry specification. Registration, lookup, capability matching, and reputation aggregation.",
                link: "/registry",
              },
              {
                title: "Coordination Protocol",
                version: "v0.7-draft",
                desc: "Multi-agent coordination and task orchestration. Hierarchical consensus, sharded state, and real-time synchronization primitives.",
                link: "/research",
              },
              {
                title: "Post-Quantum Security",
                version: "v0.6-draft",
                desc: "Quantum-resilient cryptographic specifications. CRYSTALS-Kyber, CRYSTALS-Dilithium, SPHINCS+, and hybrid deployment architectures.",
                link: "/research",
              },
              {
                title: "ORB Tokenomics",
                version: "v1.0",
                desc: "Token utility, distribution, staking mechanics, governance framework, and economic model for the ORBIT network.",
                link: "/token",
              },
            ].map((spec, i) => (
              <motion.a
                key={spec.title}
                href={spec.link}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.5 }}
                className="block p-6 rounded-md border border-border/50 bg-white/[0.02] hover-elevate group"
                data-testid={`card-spec-${i}`}
              >
                <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
                  <h3 className="font-display font-semibold text-base tracking-tight">{spec.title}</h3>
                  <span className="font-mono text-xs text-orange-500/70">{spec.version}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">{spec.desc}</p>
                <span className="text-xs text-orange-500/60 font-mono flex items-center gap-1">
                  View spec <ArrowRight className="w-3 h-3" />
                </span>
              </motion.a>
            ))}
          </div>
        </section>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-md overflow-hidden"
          data-testid="section-developers-cta"
        >
          <img
            src="/images/quantum-bg.png"
            alt="Quantum visualization"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-black/50" />
          <div className="relative p-6 sm:p-8 lg:p-16">
            <div className="max-w-xl">
              <span className="font-mono text-xs tracking-widest text-orange-500/80 uppercase mb-4 block">
                Open Source
              </span>
              <h2 className="font-display font-bold text-2xl lg:text-4xl text-white tracking-tight mb-4">
                Join the developer community.
              </h2>
              <p className="text-white/50 leading-relaxed mb-8">
                ORBIT is built in the open. Contribute to the protocol, build integrations, submit proposals, and help shape the infrastructure for the autonomous machine economy.
              </p>
              <div className="flex items-center gap-3 flex-wrap">
                <a href="https://github.com/orbitquantum1/Orbit" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" data-testid="button-dev-github">
                    <GitBranch className="w-4 h-4 mr-2" />
                    View on GitHub
                  </Button>
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" variant="outline" className="backdrop-blur-sm bg-white/5 border-white/15 text-white" data-testid="button-dev-discord">
                    Join Discord
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
