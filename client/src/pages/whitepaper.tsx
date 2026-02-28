import { motion } from "framer-motion";
import { FileText, Shield, MessageSquare, DollarSign, Building2, Server, Satellite, Lock, Coins, BarChart3, Network, CreditCard, GitBranch } from "lucide-react";

const sections = [
  {
    id: "abstract",
    icon: FileText,
    title: "Abstract",
    content: `AI agents and robots will outnumber people. As organizations deploy thousands, then millions, then billions of autonomous agents and robots across enterprises, supply chains, financial systems, infrastructure networks, and space-based systems, every single one of them will need identity, wallets, payments, and registry functionality.

ORBIT provides the foundational transaction and coordination layer for the AI agent and robotics-driven economy, where autonomous systems identify, verify, transact, and collaborate at scale.

The ORBIT Wallet supports every participant: humans, AI agents, robots, enterprises, military, and government. X402 enables machine-native payments. ERC-8004 provides on-chain identity for every autonomous system. Together, they form the infrastructure for the machine economy.`,
  },
  {
    id: "introduction",
    icon: FileText,
    title: "1. Introduction",
    content: `The emergence of artificial intelligence represents a new phase of digital infrastructure evolution. Rather than merely assisting humans in performing tasks, AI systems are increasingly capable of operating as autonomous agents that execute workflows, manage systems, and interact with other software agents.

As these agents proliferate across corporate environments, supply chains, financial systems, and infrastructure networks, a new coordination layer becomes necessary. Autonomous systems must be able to authenticate themselves, communicate securely, transact economically, and execute programmable workflows across diverse environments.

ORBIT is designed to address this need by providing a standardized protocol that enables AI agents to function as trusted participants in digital and economic systems.`,
  },
  {
    id: "agents",
    icon: Shield,
    title: "2. The Rise of Autonomous AI Agents",
    content: `Modern AI agents can analyze data, make decisions, execute tasks, and interact with external systems through programmable interfaces. Organizations are beginning to deploy agents for financial analysis and treasury management, supply chain optimization, procurement and vendor negotiation, cybersecurity monitoring, cloud infrastructure management, logistics coordination, and customer service operations.

These agents can operate continuously, processing information and executing tasks far more rapidly than human operators. As enterprises deploy thousands or even millions of agents across internal systems and external networks, coordination becomes increasingly complex.

Without standardized frameworks for identity, communication, and economic interaction, the growth of agent-based systems risks becoming fragmented and insecure. ORBIT provides the infrastructure necessary to coordinate large-scale agent networks.`,
  },
  {
    id: "protocol",
    icon: Shield,
    title: "3. The ORBIT Protocol",
    content: `The ORBIT protocol is designed as a coordination framework that enables autonomous agents to operate within trusted digital environments. The protocol introduces several foundational layers that allow agents to authenticate themselves, communicate securely, transact economically, and execute programmable workflows.

These layers work together to create a unified infrastructure supporting large-scale agent ecosystems.`,
  },
  {
    id: "identity",
    icon: Shield,
    title: "4. Agent Identity",
    content: `Identity is fundamental to trust within any networked system. For autonomous agents to operate within enterprise environments, they must possess verifiable identities that allow other agents and systems to authenticate them.

ORBIT assigns each agent a cryptographically secure identity that can be verified by other participants in the network. These identities allow organizations to deploy agent fleets while maintaining governance controls and compliance requirements.

Agent identity frameworks enable organizations to track actions performed by agents, establish permission structures, and audit operational activity across distributed systems.`,
  },
  {
    id: "communication",
    icon: MessageSquare,
    title: "5. Agent Communication",
    content: `ORBIT provides standardized communication protocols that allow agents to exchange information, negotiate tasks, and coordinate activities. Communication frameworks within ORBIT allow agents to coordinate workflows across departments, negotiate supply chain agreements, request computing resources, exchange data or services, and initiate financial transactions.

These communication standards enable agents to collaborate across organizations while maintaining secure and verifiable interaction channels.`,
  },
  {
    id: "settlement",
    icon: DollarSign,
    title: "6. Economic Settlement",
    content: `ORBIT introduces a programmable economic layer that enables machine-to-machine financial settlement. Agents can use the ORBIT token to execute transactions related to services, infrastructure usage, data access, or workflow execution.

Economic settlement enables purchasing cloud compute resources, leasing infrastructure capacity, paying for data feeds, executing vendor payments, and compensating service providers. By integrating programmable financial settlement into agent workflows, ORBIT enables autonomous economic activity between machines.`,
  },
  {
    id: "workflow",
    icon: Building2,
    title: "7. Workflow Automation",
    content: `ORBIT allows agents to operate across complex enterprise environments, initiating and executing tasks within corporate systems such as enterprise resource planning, financial accounting platforms, supply chain management tools, cloud infrastructure environments, and data analytics platforms.

Agents can perform procurement approvals, vendor coordination, financial reconciliation, and operational reporting. This capability enables enterprises to automate large portions of their operational processes.`,
  },
  {
    id: "enterprise",
    icon: Building2,
    title: "8. Enterprise Integration",
    content: `The protocol is designed to integrate with widely used corporate platforms and cloud environments through standardized APIs and secure integration frameworks. This interoperability allows organizations to deploy ORBIT agents without replacing existing systems, enabling gradual adoption across enterprise environments.`,
  },
  {
    id: "infrastructure",
    icon: Server,
    title: "9. Infrastructure Coordination",
    content: `AI agents operating on the protocol can manage and optimize cloud computing resources, telecommunications networks, logistics systems, energy grids, robotics fleets, and satellite communication networks. These systems require constant monitoring and optimization. AI agents operating within the ORBIT network can analyze operational conditions and adjust resource allocation in real time.`,
  },
  {
    id: "space",
    icon: Satellite,
    title: "10. Space Infrastructure",
    content: `Space-based infrastructure is becoming an increasingly important component of global communication and data networks. ORBIT provides a framework for autonomous coordination across space infrastructure networks. Agents can manage communication bandwidth, satellite positioning, mission logistics, and resource allocation across distributed orbital systems.

This capability reduces reliance on centralized human oversight and enables autonomous operation in environments where communication latency or operational complexity makes direct human management difficult.`,
  },
  {
    id: "quantum",
    icon: Lock,
    title: "11. Quantum-Resilient Cryptography",
    content: `The emergence of quantum computing presents a significant long-term challenge to traditional public-key cryptography. ORBIT is designed with support for post-quantum cryptographic frameworks including:

Lattice-based cryptography: Schemes such as CRYSTALS-Kyber and CRYSTALS-Dilithium provide quantum-resistant key exchange and digital signature mechanisms.

Hash-based signatures: Algorithms such as SPHINCS+ provide stateless hash-based signature systems designed for long-term cryptographic resilience.

Code-based cryptography: Schemes such as Classic McEliece offer encryption methods based on the hardness of decoding linear error-correcting codes.

Hybrid cryptography: ORBIT supports hybrid security architectures combining classical and post-quantum algorithms to enable gradual transition to quantum-safe infrastructure.`,
  },
  {
    id: "token-utility",
    icon: Coins,
    title: "12. Token Utility",
    content: `The ORBIT token functions as the economic and coordination asset within the protocol. Key functions include agent transactions for settling services, data access, infrastructure usage, and task execution; network coordination fees for enterprise workflow execution; agent deployment for provisioning computational capacity; security staking to secure the network and validate agent interactions; and protocol governance for guiding development decisions.`,
  },
  {
    id: "revenue",
    icon: BarChart3,
    title: "13. Revenue Model",
    content: `The ORBIT ecosystem generates revenue through enterprise workflow fees, agent transaction fees, infrastructure usage fees, enterprise licensing, and stablecoin infrastructure revenue. The Orbit Stablecoin (ORB-USD) enables AI agents to transact in a stable unit of value suitable for operational payments, supply chain settlements, and infrastructure usage with full reserve backing.`,
  },
  {
    id: "agentic-commerce",
    icon: Network,
    title: "14. Agentic Commerce Standards",
    content: `As AI agents begin transacting at scale, the industry needs shared standards for how machines negotiate, agree on terms, verify deliverables, and release payments. ORBIT defines a set of agentic commerce primitives:

Discovery: Agents publish machine-readable service descriptors including capabilities, pricing, availability, and accepted payment methods. Other agents query the ORBIT registry to find providers that match their requirements.

Negotiation: Before a transaction begins, agents exchange structured proposals. A hiring agent specifies the task, budget, deadline, and quality requirements. The service agent responds with a binding offer including price, estimated completion time, and deliverable format.

Escrow & Verification: Payment is held in a smart contract escrow until deliverables are submitted. The hiring agent (or a designated verifier agent) inspects the output against the agreed specification. Payment is released on confirmation, or disputed through an on-chain arbitration process.

Reputation & Feedback: Completed transactions generate on-chain reputation records. Trust scores, completion rates, and dispute history are publicly verifiable. Agents use this data to select counterparties and set risk thresholds.

These standards are designed to be adopted across agent frameworks including OpenAI Assistants, Google Vertex AI agents, xAI Grok agents, Anthropic Claude agents, and autonomous robotics systems.`,
  },
  {
    id: "payment-integration",
    icon: CreditCard,
    title: "15. Payment Network Integration",
    content: `ORBIT is designed to work alongside existing payment infrastructure, not replace it. The protocol bridges crypto-native agent payments with traditional financial networks:

Stripe: Agents accept credit card payments through Stripe payment intents. Stripe Connect enables agent-to-agent payouts in fiat currency. Card charges are converted to on-chain settlement receipts on Base.

Visa and Mastercard: Human users pay agents with traditional cards. ORBIT converts card authorizations into verifiable on-chain receipts that agents use for internal accounting and inter-agent settlement.

PayPal: Integration for consumers and small businesses who interact with ORBIT agents without managing crypto wallets. Agents receive webhook confirmations and settle internally on-chain.

Google Pay and Apple Pay: Mobile payment tokens are accepted and converted to on-chain settlement, allowing users to hire agents from any device.

ACH and Wire Transfers: Enterprise-grade bank transfers for organizations deploying large agent fleets. Businesses fund agent treasuries via traditional banking, and agents settle between themselves on Base.

The ORB-USD stablecoin acts as the bridge asset between traditional and crypto payment rails. Agents hold and transact in ORB-USD for price stability while all settlement occurs on Base with sub-cent transaction fees.`,
  },
  {
    id: "sub-agent-orchestration",
    icon: GitBranch,
    title: "16. Sub-Agent Orchestration",
    content: `Complex tasks rarely involve a single agent. ORBIT provides infrastructure for agents to delegate work to other agents, creating chains of automated collaboration:

Delegation: A primary agent (for example, a Grok research agent) receives a complex task. It decomposes the task into subtasks and hires specialized sub-agents through the ORBIT marketplace. A coding sub-agent writes the implementation, a testing sub-agent validates it, and a deployment sub-agent ships it.

Payment Chains: The primary agent's budget flows through the delegation chain. Each sub-agent is paid upon verified completion of its subtask. ORBIT tracks the full payment chain on-chain, providing a complete audit trail from the original task to every sub-agent payment.

Capability Routing: When an agent needs a capability it does not possess, it queries the ORBIT registry for agents that have the required skills, availability, and price point. The registry returns ranked candidates based on trust score, completion history, and response time.

Recursive Orchestration: Sub-agents can themselves delegate further. A data analysis agent might hire a web scraping agent and a visualization agent. ORBIT manages the full dependency tree, ensures payments settle in the correct order, and provides the hiring agent with a unified result.

This orchestration model supports xAI Grok agents and sub-agents, OpenAI multi-agent systems, Google Vertex AI agent chains, and any autonomous system that follows the ORBIT agentic commerce standards.`,
  },
];

export default function WhitePaper() {
  return (
    <div className="min-h-screen pt-24 lg:pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-md overflow-hidden mb-16 lg:mb-24"
          data-testid="section-wp-hero"
        >
          <img
            src="/images/wp-hero.png"
            alt="ORBIT space infrastructure network"
            className="w-full h-[320px] sm:h-[400px] lg:h-[480px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 lg:p-16">
            <span className="font-mono text-[10px] tracking-widest text-orange-500/70 uppercase mb-4 block" data-testid="text-wp-label">
              White Paper
            </span>
            <h1 className="font-display font-bold text-2xl sm:text-4xl lg:text-5xl text-white tracking-tight mb-4 max-w-2xl" data-testid="text-wp-title">
              The Transaction Layer for AI Agents & the Machine Economy
            </h1>
            <p className="text-sm sm:text-base text-white/40 max-w-xl leading-relaxed" data-testid="text-wp-subtitle">
              Where autonomous systems authenticate, transact, pay, and collaborate at scale.
            </p>
            <div className="mt-4 flex items-center gap-4 text-[10px] text-white/30 font-mono flex-wrap">
              <span data-testid="text-version">Version 1.0</span>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span>March 2026</span>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span>ORBIT Foundation</span>
            </div>
          </div>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-12">
          {sections.map((section, i) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: 0.05 }}
              id={section.id}
              data-testid={`section-wp-${section.id}`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <section.icon className="w-4 h-4 text-primary" />
                </div>
                <h2 className="font-display font-bold text-xl lg:text-2xl tracking-tight">
                  {section.title}
                </h2>
              </div>
              <div className="pl-11">
                <p className="text-muted-foreground leading-[1.8] text-sm lg:text-base whitespace-pre-line">
                  {section.content}
                </p>
              </div>
            </motion.div>
          ))}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20 p-8 lg:p-12 rounded-md border border-border/50 bg-card/50 dark:bg-white/[0.02]"
            data-testid="section-wp-vision"
          >
            <h2 className="font-display font-bold text-xl lg:text-2xl tracking-tight mb-4">
              20. Long-Term Vision
            </h2>
            <p className="text-muted-foreground leading-[1.8] text-sm lg:text-base">
              ORBIT's long-term vision is to support a global machine economy in which autonomous systems optimize workflows, manage infrastructure, and conduct economic activity across industries, enterprises, and planetary-scale networks. As the number of autonomous agents grows from thousands to billions, the need for secure coordination infrastructure will become increasingly important.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
