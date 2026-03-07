import { Link } from "wouter";
import { SiX, SiDiscord, SiGithub, SiTelegram } from "react-icons/si";
import { WaitlistForm } from "@/components/waitlist";

export function Footer() {
  return (
    <footer data-testid="footer" className="border-t border-border/50 bg-card/30 dark:bg-black/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-8">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="relative w-7 h-7">
                <div className="absolute inset-0 rounded-full border-2 border-orange-500/70" />
                <div className="absolute inset-[3px] rounded-full border border-orange-500/30" />
                <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-display font-bold text-lg tracking-[0.15em] uppercase">ORBIT</span>
                              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              The transaction layer for AI agents and the robot economy. Identity, wallets, payments, and coordination at scale.
            </p>
          </div>

          <div>
            <h4 className="font-display font-semibold text-sm tracking-wider uppercase mb-4 text-foreground">
              Protocol
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Technology", href: "/whitepaper" },
                { label: "Token", href: "/token" },
                { label: "Marketplace", href: "/registry" },
                { label: "Research", href: "/research" },
                { label: "Tracker", href: "/tracker" },
                { label: "Developers", href: "/developers" },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href}>
                    <span className="text-sm text-muted-foreground cursor-pointer transition-colors" data-testid={`link-footer-${item.label.toLowerCase().replace(/\s/g, "-")}`}>
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-sm tracking-wider uppercase mb-4 text-foreground">
              Ecosystem
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Agent Wallet", href: "" },
                { label: "X402 Payments", href: "/x402" },
                { label: "ERC-8004 Identity", href: "" },
                { label: "Grok Integration", href: "" },
              ].map((item) => (
                <li key={item.label}>
                  {item.href ? (
                    <Link href={item.href}>
                      <span className="text-sm text-muted-foreground cursor-pointer transition-colors" data-testid={`link-footer-${item.label.toLowerCase().replace(/\s/g, "-")}`}>
                        {item.label}
                      </span>
                    </Link>
                  ) : (
                    <span className="text-sm text-muted-foreground cursor-pointer transition-colors">
                      {item.label}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-sm tracking-wider uppercase mb-4 text-foreground">
              Community
            </h4>
            <ul className="space-y-3 mb-5">
              <li>
                <Link href="/education">
                  <span className="text-sm text-muted-foreground cursor-pointer transition-colors" data-testid="link-footer-education">
                    Education
                  </span>
                </Link>
              </li>
            </ul>
            <div className="flex items-center gap-3 flex-wrap">
              <a href="#" className="w-11 h-11 sm:w-9 sm:h-9 rounded-md bg-card dark:bg-white/5 border border-border/50 flex items-center justify-center text-muted-foreground transition-colors" data-testid="link-twitter">
                <SiX className="w-4 h-4" />
              </a>
              <a href="#" className="w-11 h-11 sm:w-9 sm:h-9 rounded-md bg-card dark:bg-white/5 border border-border/50 flex items-center justify-center text-muted-foreground transition-colors" data-testid="link-discord">
                <SiDiscord className="w-4 h-4" />
              </a>
              <a href="https://github.com/orbitquantum1/Orbit" target="_blank" rel="noopener noreferrer" className="w-11 h-11 sm:w-9 sm:h-9 rounded-md bg-card dark:bg-white/5 border border-border/50 flex items-center justify-center text-muted-foreground transition-colors" data-testid="link-github">
                <SiGithub className="w-4 h-4" />
              </a>
              <a href="#" className="w-11 h-11 sm:w-9 sm:h-9 rounded-md bg-card dark:bg-white/5 border border-border/50 flex items-center justify-center text-muted-foreground transition-colors" data-testid="link-telegram">
                <SiTelegram className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 sm:mt-16 pt-6 sm:pt-8 border-t border-border/30 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-white mb-1">Join the ORBIT Network</p>
              <p className="text-xs text-muted-foreground">Get early access to the agent economy.</p>
            </div>
            <WaitlistForm variant="compact" />
          </div>
        </div>

        <div className="pt-6 sm:pt-8 border-t border-border/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} ORBIT Protocol. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-xs text-muted-foreground cursor-pointer">Privacy</span>
            <span className="text-xs text-muted-foreground cursor-pointer">Terms</span>
            <span className="text-xs text-muted-foreground cursor-pointer">Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
