import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSEO } from "@/hooks/use-seo";
import {
  ArrowDown,
  ArrowUpDown,
  Shield,
  Zap,
  ChevronDown,
  Check,
  Loader2,
  Network,
  Lock,
  Globe,
} from "lucide-react";

const networks = [
  { id: "ethereum", name: "Ethereum", symbol: "ETH", icon: "E", color: "text-blue-400", chainId: 1 },
  { id: "base", name: "Base", symbol: "ETH", icon: "B", color: "text-blue-500", chainId: 8453 },
  { id: "polygon", name: "Polygon", symbol: "POL", icon: "P", color: "text-purple-400", chainId: 137 },
  { id: "arbitrum", name: "Arbitrum", symbol: "ETH", icon: "A", color: "text-blue-300", chainId: 42161 },
  { id: "optimism", name: "Optimism", symbol: "ETH", icon: "O", color: "text-red-400", chainId: 10 },
];

const tokens = [
  { symbol: "ETH", name: "Ethereum", decimals: 18 },
  { symbol: "ORB", name: "ORBIT Protocol", decimals: 18 },
  { symbol: "USDC", name: "USD Coin", decimals: 6 },
  { symbol: "USDT", name: "Tether", decimals: 6 },
];

const recentBridges = [
  { from: "Ethereum", to: "Base", token: "ETH", amount: "2.5", time: "3 min ago", status: "confirmed", txHash: "0x8f3a...b2c1" },
  { from: "Polygon", to: "Base", token: "USDC", amount: "10,000", time: "7 min ago", status: "confirmed", txHash: "0x1d4e...a8f3" },
  { from: "Arbitrum", to: "Base", token: "ORB", amount: "50,000", time: "12 min ago", status: "confirmed", txHash: "0x6b2c...d9e4" },
  { from: "Base", to: "Ethereum", token: "ETH", amount: "1.2", time: "18 min ago", status: "confirmed", txHash: "0x3a7f...c5b2" },
  { from: "Optimism", to: "Base", token: "USDC", amount: "5,250", time: "24 min ago", status: "pending", txHash: "0x9e1d...f7a6" },
];

const bridgeFeatures = [
  { icon: Zap, title: "Sub-Minute Settlement", desc: "Cross-chain transfers finalize in under 60 seconds via optimistic relay infrastructure." },
  { icon: Shield, title: "Secured by Validators", desc: "Multi-sig validation with threshold consensus. No single point of failure on bridge operations." },
  { icon: Lock, title: "Post-Quantum Ready", desc: "Bridge signatures use hybrid lattice-based cryptography resistant to quantum computing attacks." },
  { icon: Globe, title: "5 Networks Supported", desc: "Ethereum, Base, Polygon, Arbitrum, and Optimism. More networks on the roadmap." },
];

export default function Bridge() {
  useSEO({ title: "Bridge", description: "Bridge assets to and from Base. Cross-chain transfers for $ORB, ETH, USDC, and more across Ethereum, Polygon, Arbitrum, and Optimism." });

  const [fromNetwork, setFromNetwork] = useState(networks[0]);
  const [toNetwork, setToNetwork] = useState(networks[1]);
  const [selectedToken, setSelectedToken] = useState(tokens[0]);
  const [amount, setAmount] = useState("");
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [showTokenDropdown, setShowTokenDropdown] = useState(false);
  const [bridgeStatus, setBridgeStatus] = useState<"idle" | "confirming" | "bridging" | "complete">("idle");

  const swapNetworks = () => {
    const temp = fromNetwork;
    setFromNetwork(toNetwork);
    setToNetwork(temp);
  };

  const estimatedGas = amount ? (parseFloat(amount) * 0.0003).toFixed(6) : "0.000000";
  const estimatedTime = fromNetwork.id === "base" || toNetwork.id === "base" ? "~30s" : "~2 min";
  const bridgeFee = amount ? (parseFloat(amount) * 0.001).toFixed(6) : "0.000000";

  const handleBridge = () => {
    if (!amount || parseFloat(amount) <= 0) return;
    setBridgeStatus("confirming");
    setTimeout(() => setBridgeStatus("bridging"), 2000);
    setTimeout(() => setBridgeStatus("complete"), 5000);
    setTimeout(() => setBridgeStatus("idle"), 8000);
  };

  return (
    <div className="min-h-screen pt-20 lg:pt-32 pb-16 lg:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <span className="font-mono text-xs tracking-widest text-orange-500/80 uppercase mb-3 block" data-testid="label-bridge">
            Cross-Chain Infrastructure
          </span>
          <h1 className="font-display font-bold text-3xl lg:text-5xl tracking-tight mb-4" data-testid="heading-bridge">
            ORBIT{" "}
            <span className="dark:text-gradient text-gradient-light">Bridge</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base lg:text-lg leading-relaxed" data-testid="desc-bridge">
            Move assets seamlessly across networks. Bridge to Base and back with sub-minute settlement, secured by multi-sig validation and post-quantum cryptography.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-6 lg:p-8 bg-card/50 dark:bg-white/[0.02] border-border/50" data-testid="card-bridge-form">
                <div className="space-y-4">
                  <div className="relative p-4 rounded-md bg-black/20 border border-border/30">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-xs text-muted-foreground uppercase tracking-wider">From</span>
                      <span className="font-mono text-xs text-muted-foreground">Balance: 0.00</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <button
                          onClick={() => { setShowFromDropdown(!showFromDropdown); setShowToDropdown(false); setShowTokenDropdown(false); }}
                          className="flex items-center gap-2 px-3 py-2 rounded-md bg-white/[0.04] border border-border/30 transition-colors"
                          aria-label="Select source network"
                          aria-expanded={showFromDropdown}
                          data-testid="select-from-network"
                        >
                          <span className={`font-mono font-bold text-sm ${fromNetwork.color}`}>{fromNetwork.icon}</span>
                          <span className="text-sm font-medium">{fromNetwork.name}</span>
                          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                        </button>
                        {showFromDropdown && (
                          <div className="absolute top-full left-0 mt-1 w-48 rounded-md bg-card border border-border/50 shadow-xl z-50">
                            {networks.filter(n => n.id !== toNetwork.id).map((n) => (
                              <button
                                key={n.id}
                                onClick={() => { setFromNetwork(n); setShowFromDropdown(false); }}
                                className="flex items-center gap-2 w-full px-3 py-2.5 text-left hover:bg-white/[0.04] transition-colors first:rounded-t-md last:rounded-b-md"
                                data-testid={`option-from-${n.id}`}
                              >
                                <span className={`font-mono font-bold text-sm ${n.color}`}>{n.icon}</span>
                                <span className="text-sm">{n.name}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        aria-label="Bridge amount"
                        className="flex-1 bg-transparent text-right text-2xl font-display font-bold outline-none placeholder:text-muted-foreground/30 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        data-testid="input-bridge-amount"
                      />
                    </div>
                  </div>

                  <div className="flex justify-center -my-1 relative z-10">
                    <button
                      onClick={swapNetworks}
                      className="w-10 h-10 rounded-md bg-orange-500/10 border border-orange-500/20 flex items-center justify-center transition-colors"
                      aria-label="Swap source and destination networks"
                      data-testid="button-swap-networks"
                    >
                      <ArrowUpDown className="w-4 h-4 text-orange-500" />
                    </button>
                  </div>

                  <div className="relative p-4 rounded-md bg-black/20 border border-border/30">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-xs text-muted-foreground uppercase tracking-wider">To</span>
                      <span className="font-mono text-xs text-muted-foreground">Balance: 0.00</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <button
                          onClick={() => { setShowToDropdown(!showToDropdown); setShowFromDropdown(false); setShowTokenDropdown(false); }}
                          className="flex items-center gap-2 px-3 py-2 rounded-md bg-white/[0.04] border border-border/30 transition-colors"
                          aria-label="Select destination network"
                          aria-expanded={showToDropdown}
                          data-testid="select-to-network"
                        >
                          <span className={`font-mono font-bold text-sm ${toNetwork.color}`}>{toNetwork.icon}</span>
                          <span className="text-sm font-medium">{toNetwork.name}</span>
                          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                        </button>
                        {showToDropdown && (
                          <div className="absolute top-full left-0 mt-1 w-48 rounded-md bg-card border border-border/50 shadow-xl z-50">
                            {networks.filter(n => n.id !== fromNetwork.id).map((n) => (
                              <button
                                key={n.id}
                                onClick={() => { setToNetwork(n); setShowToDropdown(false); }}
                                className="flex items-center gap-2 w-full px-3 py-2.5 text-left hover:bg-white/[0.04] transition-colors first:rounded-t-md last:rounded-b-md"
                                data-testid={`option-to-${n.id}`}
                              >
                                <span className={`font-mono font-bold text-sm ${n.color}`}>{n.icon}</span>
                                <span className="text-sm">{n.name}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 text-right text-2xl font-display font-bold text-muted-foreground/50" data-testid="text-receive-amount">
                        {amount ? (parseFloat(amount) - parseFloat(bridgeFee)).toFixed(6) : "0.00"}
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <button
                      onClick={() => { setShowTokenDropdown(!showTokenDropdown); setShowFromDropdown(false); setShowToDropdown(false); }}
                      className="flex items-center justify-between w-full px-4 py-3 rounded-md bg-black/20 border border-border/30 transition-colors"
                      aria-label="Select token"
                      aria-expanded={showTokenDropdown}
                      data-testid="select-token"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-muted-foreground uppercase tracking-wider">Token:</span>
                        <span className="font-medium">{selectedToken.symbol}</span>
                        <span className="text-xs text-muted-foreground">{selectedToken.name}</span>
                      </div>
                      <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                    {showTokenDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-1 rounded-md bg-card border border-border/50 shadow-xl z-50">
                        {tokens.map((t) => (
                          <button
                            key={t.symbol}
                            onClick={() => { setSelectedToken(t); setShowTokenDropdown(false); }}
                            className="flex items-center gap-3 w-full px-4 py-2.5 text-left hover:bg-white/[0.04] transition-colors first:rounded-t-md last:rounded-b-md"
                            data-testid={`option-token-${t.symbol.toLowerCase()}`}
                          >
                            <span className="font-medium text-sm">{t.symbol}</span>
                            <span className="text-xs text-muted-foreground">{t.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 px-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Estimated gas</span>
                      <span className="font-mono text-muted-foreground" data-testid="text-gas-estimate">{estimatedGas} {selectedToken.symbol}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Bridge fee (0.1%)</span>
                      <span className="font-mono text-muted-foreground" data-testid="text-bridge-fee">{bridgeFee} {selectedToken.symbol}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Estimated time</span>
                      <span className="font-mono text-muted-foreground" data-testid="text-estimated-time">{estimatedTime}</span>
                    </div>
                  </div>

                  <Button
                    onClick={handleBridge}
                    disabled={!amount || parseFloat(amount) <= 0 || bridgeStatus !== "idle"}
                    size="lg"
                    className="w-full font-display font-semibold"
                    data-testid="button-bridge"
                  >
                    {bridgeStatus === "idle" && (
                      <>
                        <ArrowDown className="w-4 h-4 mr-2" />
                        Bridge {selectedToken.symbol}
                      </>
                    )}
                    {bridgeStatus === "confirming" && (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Confirm in Wallet...
                      </>
                    )}
                    {bridgeStatus === "bridging" && (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Bridging...
                      </>
                    )}
                    {bridgeStatus === "complete" && (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Bridge Complete
                      </>
                    )}
                  </Button>

                  {bridgeStatus !== "idle" && (
                    <div className="p-3 rounded-md bg-orange-500/5 border border-orange-500/10">
                      <div className="flex items-start gap-2">
                        {bridgeStatus === "complete" ? (
                          <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                        ) : (
                          <Loader2 className="w-4 h-4 text-orange-500 mt-0.5 shrink-0 animate-spin" />
                        )}
                        <div>
                          <p className="text-sm font-medium" data-testid="text-bridge-status">
                            {bridgeStatus === "confirming" && "Waiting for wallet confirmation..."}
                            {bridgeStatus === "bridging" && `Bridging ${amount} ${selectedToken.symbol} from ${fromNetwork.name} to ${toNetwork.name}...`}
                            {bridgeStatus === "complete" && `Successfully bridged ${amount} ${selectedToken.symbol} to ${toNetwork.name}`}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {bridgeStatus === "confirming" && "Please confirm the transaction in your wallet."}
                            {bridgeStatus === "bridging" && "Transaction submitted. Waiting for cross-chain confirmation."}
                            {bridgeStatus === "complete" && "Assets are now available on the destination network."}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-semibold text-lg tracking-tight" data-testid="heading-recent-bridges">Recent Bridge Transactions</h2>
                <Badge variant="outline" className="font-mono text-[10px]" data-testid="badge-bridge-count">
                  {recentBridges.length} recent
                </Badge>
              </div>
              <div className="space-y-2">
                {recentBridges.map((tx, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-md bg-card/50 dark:bg-white/[0.02] border border-border/30 hover:border-border/50 transition-colors"
                    data-testid={`row-bridge-tx-${i}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-md bg-orange-500/10 flex items-center justify-center">
                        <Network className="w-4 h-4 text-orange-500" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">
                          {tx.from} <span className="text-muted-foreground mx-1">&rarr;</span> {tx.to}
                        </div>
                        <div className="text-xs text-muted-foreground font-mono">{tx.txHash}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-mono font-medium">{tx.amount} {tx.token}</div>
                      <div className="flex items-center gap-1.5 justify-end">
                        <div className={`w-1.5 h-1.5 rounded-full ${tx.status === "confirmed" ? "bg-green-500" : "bg-orange-500 animate-pulse"}`} />
                        <span className="text-xs text-muted-foreground">{tx.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <Card className="p-5 bg-card/50 dark:bg-white/[0.02] border-border/50" data-testid="card-bridge-stats">
                <h3 className="font-mono text-xs tracking-widest text-orange-500/80 uppercase mb-4">Bridge Stats</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Volume (24h)</span>
                    <span className="font-mono text-sm font-medium" data-testid="text-bridge-volume">$2.4M</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Transactions (24h)</span>
                    <span className="font-mono text-sm font-medium" data-testid="text-bridge-txcount">1,247</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Avg. Settlement</span>
                    <span className="font-mono text-sm font-medium" data-testid="text-bridge-settlement">34s</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Networks</span>
                    <span className="font-mono text-sm font-medium" data-testid="text-bridge-networks">5 active</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Uptime</span>
                    <span className="font-mono text-sm font-medium text-green-500" data-testid="text-bridge-uptime">99.97%</span>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-5 bg-card/50 dark:bg-white/[0.02] border-border/50" data-testid="card-supported-networks">
                <h3 className="font-mono text-xs tracking-widest text-orange-500/80 uppercase mb-4">Supported Networks</h3>
                <div className="space-y-2">
                  {networks.map((n) => (
                    <div
                      key={n.id}
                      className="flex items-center justify-between p-2.5 rounded-md bg-black/20 border border-border/20"
                      data-testid={`row-network-${n.id}`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`font-mono font-bold text-sm w-6 text-center ${n.color}`}>{n.icon}</span>
                        <span className="text-sm font-medium">{n.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        <span className="text-xs text-muted-foreground">Live</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <Card className="p-5 bg-orange-500/5 border-orange-500/10" data-testid="card-bridge-security">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-orange-500 mt-0.5 shrink-0" />
                  <div>
                    <h3 className="font-display font-semibold text-sm mb-1">Security Notice</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      ORBIT Bridge uses multi-sig validation with threshold consensus. All bridge operations are secured by post-quantum cryptographic signatures. Always verify destination addresses before confirming.
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 lg:mt-24"
        >
          <h2 className="font-display font-bold text-2xl lg:text-3xl tracking-tight mb-8 text-center" data-testid="heading-bridge-features">
            Bridge{" "}
            <span className="dark:text-gradient text-gradient-light">Infrastructure</span>
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {bridgeFeatures.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.5 }}
                className="p-6 rounded-md border border-border/50 bg-card/50 dark:bg-white/[0.02] hover-elevate"
                data-testid={`card-bridge-feature-${i}`}
              >
                <div className="w-10 h-10 rounded-md bg-orange-500/10 flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-orange-500" />
                </div>
                <h3 className="font-display font-semibold text-base mb-2 tracking-tight">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
