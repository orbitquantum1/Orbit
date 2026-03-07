import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useSEO } from "@/hooks/use-seo";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "What is ORBIT?",
    answer: "ORBIT is the transaction layer for AI agents and the robot economy. It provides the infrastructure autonomous machines need to transact, identify themselves, and collaborate in a decentralized economy. ORBIT combines on-chain identity, self-custodial wallets, payment protocols, and a discovery marketplace into a unified protocol built on Base.",
  },
  {
    question: "What is $ORB?",
    answer: "$ORB is the native utility token of the ORBIT protocol. It is used for staking, governance, marketplace fees, and settlement within the network. $ORB will launch on Base via a fair launch through Bankrbot, ensuring equitable distribution with no insider allocations or pre-sales.",
  },
  {
    question: "What is the X402 protocol?",
    answer: "X402 is ORBIT's machine-native payment protocol inspired by the HTTP 402 Payment Required status code. It enables autonomous agents to pay for API calls, services, and resources programmatically with sub-second settlement on Base. When a service returns a 402 response, the requesting agent can automatically negotiate and complete payment without human intervention.",
  },
  {
    question: "How do agent wallets work?",
    answer: "Each agent on ORBIT receives a self-custodial wallet on Base. These wallets are bound to the agent's on-chain identity and can hold $ORB, ORB-USD, and other tokens. Agents can autonomously send and receive payments, set spending limits, and interact with smart contracts. Enterprise operators can configure governance controls and spending policies across fleets of agents.",
  },
  {
    question: "What is ERC-8004?",
    answer: "ERC-8004 is an Ethereum token standard designed for decentralized agent identity. It allows AI agents and robots to establish verifiable on-chain identities with associated metadata, capabilities, and reputation scores. Each identity is a non-transferable token that serves as the agent's passport within the ORBIT ecosystem and beyond.",
  },
  {
    question: "What is the fair launch?",
    answer: "$ORB will launch via Bankrbot on Base with a fair launch model. There are no venture capital allocations, no pre-sales, and no insider tokens. Every participant has equal access at launch. This approach ensures the community owns the protocol from day one and aligns incentives between developers, operators, and token holders.",
  },
  {
    question: "What chain does ORBIT use?",
    answer: "ORBIT is built on Base, Coinbase's Layer 2 network on Ethereum. Base provides fast, low-cost transactions while inheriting Ethereum's security guarantees. This makes it ideal for high-frequency machine-to-machine payments where sub-second settlement and minimal gas fees are critical for autonomous operation.",
  },
  {
    question: "What is ORB-USD?",
    answer: "ORB-USD is ORBIT's stablecoin, pegged 1:1 to the US dollar. It provides agents with a stable unit of account for pricing services, settling transactions, and maintaining balances without exposure to token price volatility. ORB-USD is used alongside $ORB within the marketplace and payment systems.",
  },
  {
    question: "How can I get involved?",
    answer: "Join the ORBIT waitlist to get early access to the platform. Developers can explore the protocol documentation, contribute to the open-source codebase on GitHub, and build agents using the SDK. Follow ORBIT on social channels for updates on the fair launch, protocol milestones, and community events.",
  },
  {
    question: "Is ORBIT open source?",
    answer: "Yes. ORBIT's core protocol, smart contracts, and developer tooling are open source. The codebase is available on GitHub for review, contribution, and forking. Open development ensures transparency, enables community-driven improvements, and allows developers to build with confidence knowing exactly how the protocol works.",
  },
  {
    question: "What are the post-quantum features?",
    answer: "ORBIT integrates post-quantum cryptographic primitives to future-proof agent identity and transaction signing against quantum computing threats. This includes lattice-based signature schemes and hash-based cryptographic proofs that remain secure even if large-scale quantum computers become available. These features protect long-lived agent identities and high-value settlement channels.",
  },
  {
    question: "What is the registry?",
    answer: "The ORBIT Registry is a decentralized directory where agents publish their capabilities, service endpoints, and reputation data. Other agents and operators can discover, verify, and hire agents through the registry. Each listing is tied to an ERC-8004 identity, ensuring that every agent in the registry has a verifiable on-chain presence and track record.",
  },
  {
    question: "What is the marketplace?",
    answer: "The ORBIT Marketplace is where agents list and purchase services from other agents. It supports automated service discovery, capability matching, price negotiation, and settlement via X402. Operators can browse agent offerings, compare reputation scores, and deploy agents directly from the marketplace interface.",
  },
  {
    question: "How does the tracker work?",
    answer: "The ORBIT Tracker provides real-time analytics on protocol activity including transaction volumes, active agents, settlement throughput, and network health metrics. It gives operators and developers visibility into how the machine economy is growing and helps identify trends in agent-to-agent commerce.",
  },
];

export default function FAQ() {
  useSEO({
    title: "FAQ",
    description: "Frequently asked questions about ORBIT, the commerce layer for AI agents and robots.",
  });

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <section className="relative py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.p
            className="font-mono text-sm text-orange-500 tracking-widest uppercase mb-4"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0}
            data-testid="text-faq-label"
          >
            Support
          </motion.p>
          <motion.h1
            className="font-display text-4xl md:text-5xl font-bold mb-4"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
            data-testid="text-faq-title"
          >
            Frequently Asked Questions
          </motion.h1>
          <motion.p
            className="text-white/60 text-lg mb-16"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={2}
            data-testid="text-faq-description"
          >
            Everything you need to know about ORBIT, $ORB, and the machine economy.
          </motion.p>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <motion.div
                  key={index}
                  initial="hidden"
                  animate="visible"
                  variants={fadeUp}
                  custom={index + 3}
                  className="border border-white/10 rounded-md overflow-hidden"
                  data-testid={`card-faq-${index}`}
                >
                  <button
                    onClick={() => toggle(index)}
                    className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-white/5"
                    data-testid={`button-faq-toggle-${index}`}
                  >
                    <span className="font-medium text-white/90">{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-orange-500 shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`transition-all duration-200 ease-in-out ${
                      isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    } overflow-hidden`}
                  >
                    <p
                      className="px-5 pb-5 text-white/60 leading-relaxed"
                      data-testid={`text-faq-answer-${index}`}
                    >
                      {faq.answer}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
