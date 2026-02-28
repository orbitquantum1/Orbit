import { motion } from "framer-motion";
import { Shield, Users, Brain, Lock, ShieldCheck, Landmark, Search, Database } from "lucide-react";

const contributorDomains = [
  {
    icon: Brain,
    label: "AI & Machine Learning",
    desc: "Frontier model integration, agent orchestration, autonomous reasoning, reinforcement learning, multi-modal systems.",
  },
  {
    icon: Lock,
    label: "Blockchain & Crypto",
    desc: "Smart contract architecture, tokenomics design, DeFi protocols, cross-chain bridging, on-chain identity systems.",
  },
  {
    icon: ShieldCheck,
    label: "Cybersecurity & Defense",
    desc: "Post-quantum cryptography, zero-trust architecture, penetration testing, military-grade encryption, threat modeling.",
  },
  {
    icon: Search,
    label: "Search & Discovery",
    desc: "Agent discovery algorithms, semantic search, registry indexing, marketplace ranking, distributed knowledge graphs.",
  },
  {
    icon: Database,
    label: "Data Science & Analytics",
    desc: "Network analytics, on-chain metrics, agent performance modeling, yield optimization, risk quantification.",
  },
  {
    icon: Landmark,
    label: "Government & Policy",
    desc: "Regulatory compliance, sovereign infrastructure, national security alignment, policy frameworks, institutional adoption.",
  },
];

export default function Team() {
  return (
    <div className="min-h-screen pt-20 lg:pt-32 pb-16 lg:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 lg:mb-20"
        >
          <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase mb-3 block" data-testid="text-team-label">
            Team
          </span>
          <h1 className="font-display font-bold text-3xl lg:text-6xl tracking-tight mb-6" data-testid="text-team-title">
            Decentralized by{" "}
            <span className="dark:text-gradient text-gradient-light">design.</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
            ORBIT is a decentralized fair launch. No VC allocation, no insider rounds, no centralized control. The protocol is built and maintained by a distributed network of contributors across the disciplines that matter most to the machine economy.
          </p>
        </motion.div>

        <section className="mb-16 lg:mb-24" data-testid="section-founder">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-md overflow-hidden"
          >
            <img
              src="/images/quantum-bg.png"
              alt="Background"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/80 to-black/60" />
            <div className="relative p-6 sm:p-8 lg:p-16">
              <div className="grid lg:grid-cols-[1fr_auto] gap-12 items-start">
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-14 h-14 rounded-md bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                      <Shield className="w-7 h-7 text-orange-500" />
                    </div>
                    <div>
                      <h2 className="font-display font-bold text-xl lg:text-3xl text-white tracking-tight" data-testid="text-founder-heading">
                        Anonymous Founder
                      </h2>
                      <span className="font-mono text-xs tracking-wider text-orange-500/80 uppercase">Sole Founder</span>
                    </div>
                  </div>
                  <p className="text-white/60 leading-relaxed mb-6 max-w-2xl">
                    Serial builder with two major exits. Previous IPO exit reached $7.5 Billion, and most recent token project achieved a $500 Million market cap. Prefers to remain anonymous, letting the protocol and its community speak for themselves.
                  </p>
                  <p className="text-white/50 leading-relaxed mb-8 max-w-2xl">
                    ORBIT represents the convergence of deep experience in enterprise-scale infrastructure, token economics, and the conviction that autonomous AI systems will need their own financial and identity layer to operate at planetary scale.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["$7.5B IPO Exit", "$500M Token Project", "Enterprise Infrastructure", "Token Economics", "AI Systems"].map((tag) => (
                      <span
                        key={tag}
                        className="text-xs font-mono text-orange-500/80 px-3 py-1.5 rounded-md bg-orange-500/5 border border-orange-500/10"
                        data-testid={`tag-founder-${tag.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="hidden lg:block space-y-4 min-w-[220px]">
                  <div className="p-4 rounded-md bg-white/[0.04] border border-white/10">
                    <div className="font-mono text-xs text-white/40 uppercase tracking-wider mb-1">Previous IPO Exit</div>
                    <div className="font-display font-bold text-2xl text-white" data-testid="text-founder-exit">$7.5B</div>
                    <div className="text-xs text-white/40">IPO Exit</div>
                  </div>
                  <div className="p-4 rounded-md bg-white/[0.04] border border-white/10">
                    <div className="font-mono text-xs text-white/40 uppercase tracking-wider mb-1">Last Token Project</div>
                    <div className="font-display font-bold text-2xl text-white" data-testid="text-founder-token">$500M</div>
                    <div className="text-xs text-white/40">Market Cap</div>
                  </div>
                  <div className="p-4 rounded-md bg-white/[0.04] border border-white/10">
                    <div className="font-mono text-xs text-white/40 uppercase tracking-wider mb-1">Launch Model</div>
                    <div className="font-display font-semibold text-base text-orange-500" data-testid="text-founder-launch">Fair Launch</div>
                    <div className="text-xs text-white/40">No VC, No Insiders</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        <section className="mb-16 lg:mb-24" data-testid="section-fair-launch">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display font-bold text-xl lg:text-3xl tracking-tight mb-3">
              Fair Launch Principles
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              ORBIT launches with the same rules for everyone. No backroom deals, no preferential access.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-5">
            {[
              {
                title: "No VC Allocation",
                desc: "Zero tokens reserved for venture capital firms. The protocol belongs to its participants, not its investors.",
              },
              {
                title: "No Insider Rounds",
                desc: "No pre-sale, no seed round, no private placement. Every participant enters under the same conditions.",
              },
              {
                title: "Decentralized From Day One",
                desc: "No central team holding the keys. Protocol governance and treasury management are distributed across the community.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="p-6 lg:p-8 rounded-md border border-border/50 bg-card/50 dark:bg-white/[0.02]"
                data-testid={`card-fair-launch-${i}`}
              >
                <div className="w-2 h-2 rounded-full bg-orange-500 mb-5" />
                <h3 className="font-display font-semibold text-lg mb-2 tracking-tight">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mb-16 lg:mb-24" data-testid="section-contributors">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-6 h-6 text-orange-500" />
              <h2 className="font-display font-bold text-xl lg:text-3xl tracking-tight">
                Decentralized Contributors
              </h2>
            </div>
            <p className="text-muted-foreground max-w-3xl leading-relaxed">
              A global network of open-source experts contributing to protocol development, security audits, research, and ecosystem growth. No central team, no single point of failure. Contributors operate across six core disciplines.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {contributorDomains.map((domain, i) => (
              <motion.div
                key={domain.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="p-6 rounded-md border border-border/50 bg-card/50 dark:bg-white/[0.02] hover-elevate"
                data-testid={`card-contributor-${i}`}
              >
                <div className="w-10 h-10 rounded-md bg-orange-500/10 flex items-center justify-center mb-4">
                  <domain.icon className="w-5 h-5 text-orange-500" />
                </div>
                <h3 className="font-display font-semibold text-base mb-2 tracking-tight">{domain.label}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{domain.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section data-testid="section-join">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-6 sm:p-8 lg:p-12 rounded-md border border-orange-500/20 bg-orange-500/[0.03] text-center"
          >
            <h2 className="font-display font-bold text-xl lg:text-3xl tracking-tight mb-3" data-testid="text-join-heading">
              Contribute to ORBIT
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed mb-6">
              ORBIT is open to contributors across every discipline. If you build infrastructure for autonomous systems, the machine economy needs you.
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              {["Protocol Development", "Security Audits", "Research", "Ecosystem Growth", "Documentation"].map((area) => (
                <span
                  key={area}
                  className="text-xs font-mono text-foreground/70 px-3 py-1.5 rounded-md bg-card border border-border/50"
                >
                  {area}
                </span>
              ))}
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
