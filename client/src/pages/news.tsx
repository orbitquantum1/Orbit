import { motion } from "framer-motion";
import { useSEO } from "@/hooks/use-seo";
import { ExternalLink } from "lucide-react";

const newsItems = [
  {
    quote: "Caitlin Kalinowski, former head of hardware at Meta's Reality Labs, resigned from OpenAI after the company signed a deal with the Pentagon to integrate AI into military and surveillance operations. Her departure highlights the growing tension between AI development and its weaponization by state actors.",
    source: "Caitlin Kalinowski, OpenAI Resignation",
    date: "2026",
    link: "https://x.com/kaboringtech",
  },
  {
    quote: "The White House Cyber Strategy for America calls for rapid adoption of agentic AI for cyber defense, post-quantum cryptography deployment, and unprecedented public-private coordination to secure critical infrastructure.",
    source: "White House, Cyber Strategy for America",
    date: "March 2026",
    link: "https://www.whitehouse.gov/wp-content/uploads/2026/03/President-Trumps-Cyber-Strategy-for-America.pdf",
  },
  {
    quote: "The number of autonomous machines, from factory robots to self-driving vehicles, will exceed the human workforce within a decade.",
    source: "McKinsey Global Institute",
    date: "2025",
    link: "https://www.mckinsey.com/capabilities/mckinsey-digital/our-insights/superagency-in-the-age-of-ai",
  },
  {
    quote: "We will have more AI agents than human employees within the next few years. Digital labor is here.",
    source: "Marc Benioff, CEO of Salesforce",
    date: "2025",
    link: "https://www.cnbc.com/2024/12/18/salesforce-ceo-benioff-says-ai-approach-approach-differs-from-microsoft.html",
  },
  {
    quote: "AI agents are the next frontier of computing. Every company will deploy thousands of agents that work autonomously on their behalf.",
    source: "Satya Nadella, CEO of Microsoft",
    date: "2025",
    link: "https://blogs.microsoft.com/blog/2025/01/15/the-golden-age-of-ai-begins/",
  },
  {
    quote: "Mastercard and Google launch Verifiable Intent, an open-source standard that cryptographically links identity, intent, and action for AI agent payments, creating tamper-resistant proof of user authorization.",
    source: "Mastercard & Google",
    date: "March 2026",
    link: "https://verifiableintent.dev",
  },
  {
    quote: "PayPal launches Agent Ready and Store Sync, enabling AI agents to autonomously discover products and complete payments across millions of merchants with built-in fraud detection and buyer protection.",
    source: "PayPal Agentic Commerce",
    date: "2026",
    link: "https://paypal.ai",
  },
  {
    quote: "OpenAI and Stripe introduce the Agentic Commerce Protocol (ACP) with Shared Payment Tokens, allowing AI agents to execute purchases on ChatGPT without ever seeing card details.",
    source: "OpenAI & Stripe",
    date: "2025",
    link: "https://stripe.com/newsroom",
  },
  {
    quote: "NVIDIA is hiring interplanetary data center specialists to support AI infrastructure beyond Earth, building compute systems designed for space-based deployment.",
    source: "NVIDIA Job Listing",
    date: "2026",
    link: "https://www.nvidia.com/en-us/about-nvidia/careers/",
  },
  {
    quote: "There will be more computers orbiting Earth than people living on it.",
    source: "Elon Musk via X",
    date: "2026",
    link: "https://x.com/elonmusk",
  },
  {
    quote: "By 2028, 33% of enterprise software applications will include agentic AI, up from less than 1% in 2024.",
    source: "Gartner Research",
    date: "2025",
    link: "https://www.gartner.com/en/newsroom/press-releases/2024-10-21-gartner-identifies-the-top-10-strategic-technology-trends-for-2025",
  },
];

export default function News() {
  useSEO({ title: "News", description: "Industry insights and citations confirming the emergence of the machine economy. AI agents, robots, and autonomous commerce." });
  return (
    <div className="min-h-screen pt-20 lg:pt-32 pb-16 lg:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase mb-3 block" data-testid="text-news-label">
            In the News
          </span>
          <h1 className="font-display font-bold text-3xl lg:text-6xl tracking-tight mb-6" data-testid="text-news-title">
            The machine economy is{" "}
            <span className="text-gradient">already here.</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
            Industry leaders and analysts are converging on a single thesis: autonomous AI agents and robots will outnumber humans. ORBIT is building the infrastructure for this reality.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {newsItems.map((item, i) => (
            <motion.a
              key={i}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.5 }}
              className="group p-6 lg:p-8 rounded-md border border-border/50 bg-card/50 dark:bg-white/[0.02] hover-elevate block"
              data-testid={`card-news-${i}`}
            >
              <div className="flex items-center justify-between mb-5">
                <div className="w-2 h-2 rounded-full bg-orange-500" />
                <ExternalLink className="w-3.5 h-3.5 text-muted-foreground/50 group-hover:text-orange-500 transition-colors" />
              </div>
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
    </div>
  );
}
