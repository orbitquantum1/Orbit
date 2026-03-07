import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Wallet, User, Bot, CircuitBoard, Building2, Swords, Landmark, ChevronDown, LogOut, Copy, Check, ArrowUpRight, ArrowDownLeft, Shield, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const simulatedTxHistory = [
  { type: "in", label: "Agent deployment reward", amount: "+250 ORB", time: "2m ago" },
  { type: "out", label: "Compute lease payment", amount: "-18 ORB", time: "14m ago" },
  { type: "in", label: "Task completion fee", amount: "+75 ORB", time: "1h ago" },
  { type: "out", label: "Registry verification", amount: "-5 ORB", time: "3h ago" },
];

const navLinks = [
  { label: "About", href: "/#about" },
  { label: "Technology", href: "/whitepaper" },
  { label: "Payments", href: "/x402" },
  { label: "Marketplace", href: "/marketplace" },
  { label: "Registry", href: "/registry" },
  { label: "Roadmap", href: "/roadmap" },
  { label: "Research", href: "/research" },
  { label: "Team", href: "/team" },
  { label: "Token", href: "/token" },
  { label: "Tracker", href: "/tracker" },
  { label: "Merchandise", href: "/merch" },
  { label: "News", href: "/news" },
];

const entityTypes = [
  { icon: User, label: "Human", desc: "Personal wallet for individuals" },
  { icon: Bot, label: "AI Agent", desc: "Autonomous agent wallet" },
  { icon: CircuitBoard, label: "Robot", desc: "Hardware-bound wallet" },
  { icon: Building2, label: "Enterprise", desc: "Multi-sig organizational wallet" },
  { icon: Swords, label: "Military", desc: "Hardened defense wallet" },
  { icon: Landmark, label: "Government", desc: "Sovereign agency wallet" },
];

export function Navigation() {
  const [location, setLocation] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showWalletMenu, setShowWalletMenu] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showWalletMenu) setShowWalletMenu(false);
    };
    if (showWalletMenu) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [showWalletMenu]);

  const connectWallet = async () => {
    if (typeof window !== "undefined" && (window as any).ethereum) {
      try {
        const accounts = await (window as any).ethereum.request({
          method: "eth_requestAccounts",
        });
        if (accounts && accounts.length > 0) {
          setWalletAddress(accounts[0]);
          setWalletConnected(true);
          setShowWalletModal(false);
        }
      } catch {
        setWalletConnected(false);
      }
    } else {
      setShowWalletModal(true);
    }
  };

  const disconnectWallet = () => {
    setWalletConnected(false);
    setWalletAddress("");
    setSelectedEntity(null);
    setShowWalletMenu(false);
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegister = (entityLabel: string) => {
    setSelectedEntity(entityLabel);
  };

  const truncatedAddress = walletAddress
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
    : "";

  return (
    <>
      <nav
        data-testid="navigation"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-background/90 backdrop-blur-xl border-b border-border/50"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 h-16 lg:h-20">
            <Link href="/" data-testid="link-home">
              <div className="flex items-center gap-2.5 cursor-pointer">
                <div className="relative w-8 h-8 lg:w-9 lg:h-9">
                  <div className="absolute inset-0 rounded-full border-2 border-orange-500/80" />
                  <div className="absolute inset-[3px] rounded-full border border-orange-500/40" />
                  <div className="absolute top-1/2 left-1/2 w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500" />
                </div>
                <span className="font-display font-bold text-xl lg:text-2xl tracking-[0.15em] uppercase">
                  ORBIT
                </span>
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                if (link.href.startsWith("/#")) {
                  const anchor = link.href.substring(1);
                  return (
                    <span
                      key={link.href}
                      onClick={() => {
                        if (location === "/") {
                          document.querySelector(anchor)?.scrollIntoView({ behavior: "smooth" });
                        } else {
                          setLocation("/");
                          setTimeout(() => {
                            document.querySelector(anchor)?.scrollIntoView({ behavior: "smooth" });
                          }, 100);
                        }
                      }}
                      data-testid={`link-nav-${link.label.toLowerCase().replace(/\s/g, "-")}`}
                      className={`px-4 py-2 text-sm font-medium tracking-wide transition-colors cursor-pointer rounded-md text-muted-foreground`}
                    >
                      {link.label}
                    </span>
                  );
                }
                return (
                  <Link key={link.href} href={link.href}>
                    <span
                      data-testid={`link-nav-${link.label.toLowerCase().replace(/\s/g, "-")}`}
                      className={`px-4 py-2 text-sm font-medium tracking-wide transition-colors cursor-pointer rounded-md ${
                        location === link.href
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {link.label}
                    </span>
                  </Link>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              {walletConnected ? (
                <div className="relative">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="font-mono text-xs inline-flex gap-1.5"
                    data-testid="button-wallet-connected"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowWalletMenu(!showWalletMenu);
                    }}
                  >
                    <Wallet className="w-3.5 h-3.5" />
                    {truncatedAddress}
                    {selectedEntity && (
                      <span className="text-orange-500 ml-1">{selectedEntity}</span>
                    )}
                    <ChevronDown className="w-3 h-3 ml-0.5" />
                  </Button>

                  <AnimatePresence>
                    {showWalletMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 4, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4, scale: 0.98 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-72 rounded-md border border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                        data-testid="menu-wallet"
                      >
                        <div className="p-4 border-b border-border/30">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-muted-foreground font-mono tracking-wider uppercase">Connected</span>
                            <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm text-foreground">{truncatedAddress}</span>
                            <button
                              onClick={copyAddress}
                              className="text-muted-foreground hover:text-foreground transition-colors"
                              data-testid="button-copy-address"
                            >
                              {copied ? <Check className="w-3.5 h-3.5 text-orange-500" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                          {selectedEntity && (
                            <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-orange-500/10 text-orange-500 text-xs font-medium">
                              <Shield className="w-3 h-3" />
                              ERC-8004 {selectedEntity}
                            </div>
                          )}
                        </div>

                        <div className="p-4 border-b border-border/30">
                          <span className="text-xs text-muted-foreground font-mono tracking-wider uppercase mb-3 block">Balances</span>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Coins className="w-3.5 h-3.5 text-orange-500" />
                                <span className="text-sm font-medium">$ORB</span>
                              </div>
                              <span className="font-mono text-sm" data-testid="text-orb-balance">4,827.50</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Coins className="w-3.5 h-3.5 text-muted-foreground" />
                                <span className="text-sm font-medium">ORB-USD</span>
                              </div>
                              <span className="font-mono text-sm text-muted-foreground" data-testid="text-orbusd-balance">1,200.00</span>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 border-b border-border/30 max-h-48 overflow-y-auto">
                          <span className="text-xs text-muted-foreground font-mono tracking-wider uppercase mb-3 block">Recent Activity</span>
                          <div className="space-y-2">
                            {simulatedTxHistory.map((tx, idx) => (
                              <div key={idx} className="flex items-center gap-2.5" data-testid={`tx-history-${idx}`}>
                                <div className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 bg-orange-500/10`}>
                                  {tx.type === "in" ? (
                                    <ArrowDownLeft className="w-3 h-3 text-orange-500" />
                                  ) : (
                                    <ArrowUpRight className="w-3 h-3 text-orange-500" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-xs text-foreground truncate">{tx.label}</div>
                                  <div className="text-[10px] text-muted-foreground">{tx.time}</div>
                                </div>
                                <span className={`font-mono text-xs flex-shrink-0 ${tx.type === "in" ? "text-orange-500" : "text-muted-foreground"}`}>
                                  {tx.amount}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {!selectedEntity && (
                          <div className="p-3 border-b border-border/30">
                            <span className="text-xs text-muted-foreground font-mono tracking-wider uppercase px-1 mb-2 block">
                              Register Identity
                            </span>
                            <div className="space-y-1">
                              {entityTypes.map((entity) => (
                                <button
                                  key={entity.label}
                                  onClick={() => handleRegister(entity.label)}
                                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-white/[0.05] transition-colors text-left"
                                  data-testid={`button-register-${entity.label.toLowerCase().replace(/\s/g, "-")}`}
                                >
                                  <div className="w-8 h-8 rounded-md bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                                    <entity.icon className="w-4 h-4 text-orange-500" />
                                  </div>
                                  <div>
                                    <div className="text-sm font-medium text-foreground">{entity.label}</div>
                                    <div className="text-xs text-muted-foreground">{entity.desc}</div>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="p-3">
                          <button
                            onClick={disconnectWallet}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-white/[0.05] transition-colors text-sm text-muted-foreground hover:text-foreground"
                            data-testid="button-disconnect-wallet"
                          >
                            <LogOut className="w-4 h-4" />
                            Disconnect
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Button
                  size="sm"
                  onClick={connectWallet}
                  className="inline-flex"
                  data-testid="button-connect-wallet"
                >
                  <Wallet className="w-3.5 h-3.5 mr-1.5" />
                  <span className="hidden sm:inline">Connect</span>
                </Button>
              )}

              <Button
                size="icon"
                variant="ghost"
                className="lg:hidden"
                onClick={() => setMobileOpen(!mobileOpen)}
                data-testid="button-mobile-menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-background/95 backdrop-blur-xl border-b border-border/50 max-h-[calc(100dvh-4rem)] overflow-y-auto"
            >
              <div className="px-4 py-3 flex flex-col gap-0.5">
                {navLinks.map((link) => {
                  if (link.href.startsWith("/#")) {
                    const anchor = link.href.substring(1);
                    return (
                      <span
                        key={link.href}
                        onClick={() => {
                          setMobileOpen(false);
                          if (location === "/") {
                            document.querySelector(anchor)?.scrollIntoView({ behavior: "smooth" });
                          } else {
                            setLocation("/");
                            setTimeout(() => {
                              document.querySelector(anchor)?.scrollIntoView({ behavior: "smooth" });
                            }, 100);
                          }
                        }}
                        data-testid={`link-mobile-${link.label.toLowerCase().replace(/\s/g, "-")}`}
                        className="block px-4 py-3 min-h-[44px] flex items-center text-sm font-medium tracking-wide rounded-md cursor-pointer transition-colors text-muted-foreground"
                      >
                        {link.label}
                      </span>
                    );
                  }
                  return (
                    <Link key={link.href} href={link.href}>
                      <span
                        data-testid={`link-mobile-${link.label.toLowerCase().replace(/\s/g, "-")}`}
                        className={`block px-4 py-3 min-h-[44px] flex items-center text-sm font-medium tracking-wide rounded-md cursor-pointer transition-colors ${
                          location === link.href
                            ? "text-foreground bg-card"
                            : "text-muted-foreground"
                        }`}
                      >
                        {link.label}
                      </span>
                    </Link>
                  );
                })}
                {!walletConnected && (
                  <button
                    onClick={connectWallet}
                    className="flex items-center gap-2 px-4 py-3 min-h-[44px] text-sm font-medium tracking-wide text-orange-500 cursor-pointer"
                    data-testid="button-mobile-connect-wallet"
                  >
                    <Wallet className="w-4 h-4" />
                    Connect Wallet
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <AnimatePresence>
        {showWalletModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
            onClick={() => setShowWalletModal(false)}
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-md rounded-md border border-border/50 bg-background shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
              data-testid="modal-connect-wallet"
            >
              <div className="p-6 border-b border-border/30">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-display font-bold text-lg tracking-tight">Connect Wallet</h3>
                    <p className="text-xs text-muted-foreground mt-1">Connect your wallet to access ORBIT Protocol</p>
                  </div>
                  <button
                    onClick={() => setShowWalletModal(false)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    data-testid="button-close-modal"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <span className="text-xs text-muted-foreground font-mono tracking-wider uppercase mb-4 block">
                  Select Wallet Type
                </span>

                <div className="space-y-2 mb-6">
                  {entityTypes.slice(0, 3).map((entity) => (
                    <button
                      key={entity.label}
                      onClick={() => {
                        setSelectedEntity(entity.label);
                        setWalletAddress("0x" + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join(""));
                        setWalletConnected(true);
                        setShowWalletModal(false);
                      }}
                      className="w-full flex items-center gap-4 p-4 rounded-md border border-border/50 bg-white/[0.02] hover:border-orange-500/30 transition-all text-left"
                      data-testid={`button-connect-${entity.label.toLowerCase().replace(/\s/g, "-")}`}
                    >
                      <div className="w-10 h-10 rounded-md bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                        <entity.icon className="w-5 h-5 text-orange-500" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-foreground">{entity.label} Wallet</div>
                        <div className="text-xs text-muted-foreground">{entity.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="border-t border-border/30 pt-4">
                  <span className="text-xs text-muted-foreground font-mono tracking-wider uppercase mb-3 block">
                    Institutional
                  </span>
                  <div className="space-y-2">
                    {entityTypes.slice(3).map((entity) => (
                      <button
                        key={entity.label}
                        onClick={() => {
                          setSelectedEntity(entity.label);
                          setWalletAddress("0x" + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join(""));
                          setWalletConnected(true);
                          setShowWalletModal(false);
                        }}
                        className="w-full flex items-center gap-4 p-3 rounded-md border border-border/30 bg-white/[0.01] hover:border-orange-500/20 transition-all text-left"
                        data-testid={`button-connect-${entity.label.toLowerCase().replace(/\s/g, "-")}`}
                      >
                        <div className="w-8 h-8 rounded-md bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                          <entity.icon className="w-4 h-4 text-orange-500" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-foreground">{entity.label} Wallet</div>
                          <div className="text-xs text-muted-foreground">{entity.desc}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="px-6 pb-6">
                <p className="text-xs text-muted-foreground text-center">
                  By connecting, you agree to ORBIT Protocol Terms of Service
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
