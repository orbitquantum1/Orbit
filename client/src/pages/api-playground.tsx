import { motion } from "framer-motion";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSEO } from "@/hooks/use-seo";
import {
  Play,
  ChevronDown,
  Copy,
  Check,
  Loader2,
  Terminal,
  Clock,
  Globe,
} from "lucide-react";

interface Endpoint {
  id: string;
  method: "GET" | "POST";
  path: string;
  label: string;
  description: string;
  exampleBody?: string;
  category: string;
}

const endpoints: Endpoint[] = [
  {
    id: "wallet-generate",
    method: "POST",
    path: "/api/wallet/generate",
    label: "Generate Wallet",
    description: "Create a new multi-chain wallet with ERC-8004 identity support",
    category: "Wallet",
    exampleBody: JSON.stringify({ entityType: "AI Agent", name: "My Agent" }, null, 2),
  },
  {
    id: "wallet-balances",
    method: "GET",
    path: "/api/wallet/{address}/balances",
    label: "Get Wallet Balances",
    description: "Retrieve multi-chain balances for a wallet address",
    category: "Wallet",
  },
  {
    id: "wallet-transfer",
    method: "POST",
    path: "/api/wallet/transfer",
    label: "Transfer Funds",
    description: "Create and sign a transfer transaction between wallets",
    category: "Wallet",
    exampleBody: JSON.stringify({
      from: "0x7a3B1c9E4d2F8a6b0C1d3E5f7A9b2C4D6e8F0a1",
      to: "0x2b4D6f8A0c2E4g6I8k0M2o4Q6s8U0w2Y4a6C8e0",
      amount: "1.5",
      network: "base",
    }, null, 2),
  },
  {
    id: "wallet-estimate-gas",
    method: "POST",
    path: "/api/wallet/estimate-gas",
    label: "Estimate Gas",
    description: "Estimate gas costs for a transaction",
    category: "Wallet",
    exampleBody: JSON.stringify({
      from: "0x7a3B1c9E4d2F8a6b0C1d3E5f7A9b2C4D6e8F0a1",
      to: "0x2b4D6f8A0c2E4g6I8k0M2o4Q6s8U0w2Y4a6C8e0",
      value: "1000000000000000000",
    }, null, 2),
  },
  {
    id: "identity-issue",
    method: "POST",
    path: "/api/identity/issue",
    label: "Issue Identity",
    description: "Issue an ERC-8004 identity document for a wallet address",
    category: "Identity",
    exampleBody: JSON.stringify({
      walletAddress: "0x7a3B1c9E4d2F8a6b0C1d3E5f7A9b2C4D6e8F0a1",
      entityType: "AI Agent",
      name: "GPT-4o Agent",
    }, null, 2),
  },
  {
    id: "identity-resolve",
    method: "GET",
    path: "/api/identity/resolve/{walletAddress}",
    label: "Resolve Identity",
    description: "Look up identity information for a wallet address",
    category: "Identity",
  },
  {
    id: "identity-verify",
    method: "POST",
    path: "/api/identity/verify",
    label: "Verify Identity",
    description: "Verify an entity's identity with proof validation",
    category: "Identity",
    exampleBody: JSON.stringify({
      walletAddress: "0x7a3B1c9E4d2F8a6b0C1d3E5f7A9b2C4D6e8F0a1",
      entityType: "AI Agent",
    }, null, 2),
  },
  {
    id: "registry-list",
    method: "GET",
    path: "/api/registry",
    label: "List Registry Entries",
    description: "Get all registered entities in the ORBIT registry",
    category: "Registry",
  },
  {
    id: "registry-stats",
    method: "GET",
    path: "/api/registry/stats",
    label: "Registry Stats",
    description: "Get aggregate statistics about registered entities",
    category: "Registry",
  },
  {
    id: "registry-register",
    method: "POST",
    path: "/api/registry",
    label: "Register Entity",
    description: "Register a new entity (AI Agent, Robot, Human, Enterprise) in the registry",
    category: "Registry",
    exampleBody: JSON.stringify({
      entityType: "AI Agent",
      name: "My Custom Agent",
      walletAddress: "0xYourWalletAddress",
      description: "A custom AI agent for data analysis",
      capabilities: ["Natural Language Processing", "Data Analysis"],
    }, null, 2),
  },
  {
    id: "x402-request",
    method: "POST",
    path: "/api/x402/request",
    label: "x402 Payment Request",
    description: "Create an x402 machine-to-machine payment request",
    category: "x402 Payments",
    exampleBody: JSON.stringify({
      amount: "0.001",
      currency: "ETH",
      network: "base",
      recipient: "0x7a3B1c9E4d2F8a6b0C1d3E5f7A9b2C4D6e8F0a1",
      description: "API access fee",
    }, null, 2),
  },
  {
    id: "x402-verify",
    method: "POST",
    path: "/api/x402/verify",
    label: "Verify x402 Payment",
    description: "Verify a payment proof for an x402 transaction",
    category: "x402 Payments",
    exampleBody: JSON.stringify({
      txId: "tx_example_id",
      proof: "0xPaymentProofSignature",
    }, null, 2),
  },
  {
    id: "x402-status",
    method: "GET",
    path: "/api/x402/status/{txId}",
    label: "Payment Status",
    description: "Check the status of an x402 payment transaction",
    category: "x402 Payments",
  },
  {
    id: "settlement-initiate",
    method: "POST",
    path: "/api/settlement/initiate",
    label: "Initiate Settlement",
    description: "Start a cross-chain settlement between two parties",
    category: "Settlement",
    exampleBody: JSON.stringify({
      from: "0x7a3B1c9E4d2F8a6b0C1d3E5f7A9b2C4D6e8F0a1",
      to: "0x2b4D6f8A0c2E4g6I8k0M2o4Q6s8U0w2Y4a6C8e0",
      amount: "100",
      currency: "USDC",
      network: "base",
    }, null, 2),
  },
  {
    id: "settlement-networks",
    method: "GET",
    path: "/api/settlement/networks",
    label: "Settlement Networks",
    description: "List all supported settlement networks",
    category: "Settlement",
  },
  {
    id: "protocol-stats",
    method: "GET",
    path: "/api/protocol/stats",
    label: "Protocol Stats",
    description: "Get overall protocol statistics including TVL, transactions, and active entities",
    category: "Protocol",
  },
  {
    id: "chain-status",
    method: "GET",
    path: "/api/chain/status",
    label: "Chain Status",
    description: "Get the current status of supported blockchain networks",
    category: "Protocol",
  },
  {
    id: "chain-gas",
    method: "GET",
    path: "/api/chain/gas",
    label: "Gas Prices",
    description: "Get current gas prices across supported networks",
    category: "Protocol",
  },
  {
    id: "networks",
    method: "GET",
    path: "/api/networks",
    label: "Supported Networks",
    description: "List all blockchain networks supported by ORBIT Protocol",
    category: "Protocol",
  },
];

const categories = Array.from(new Set(endpoints.map((e) => e.category)));

function getMethodColor(method: string) {
  return method === "GET" ? "text-green-400" : "text-orange-400";
}

function getMethodBg(method: string) {
  return method === "GET" ? "bg-green-500/10 border-green-500/20" : "bg-orange-500/10 border-orange-500/20";
}

export default function ApiPlayground() {
  useSEO({
    title: "API Playground",
    description: "Interactive API console for testing ORBIT Protocol endpoints. Try wallet generation, identity verification, registry operations, x402 payments, and more.",
  });

  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint>(endpoints[0]);
  const [showEndpointDropdown, setShowEndpointDropdown] = useState(false);
  const [requestBody, setRequestBody] = useState(endpoints[0].exampleBody || "");
  const [response, setResponse] = useState<string | null>(null);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const selectEndpoint = useCallback((endpoint: Endpoint) => {
    setSelectedEndpoint(endpoint);
    setRequestBody(endpoint.exampleBody || "");
    setShowEndpointDropdown(false);
    setResponse(null);
    setResponseStatus(null);
    setResponseTime(null);
  }, []);

  const resolvedPath = selectedEndpoint.path
    .replace("{address}", "0x7a3B1c9E4d2F8a6b0C1d3E5f7A9b2C4D6e8F0a1")
    .replace("{walletAddress}", "0x7a3B1c9E4d2F8a6b0C1d3E5f7A9b2C4D6e8F0a1")
    .replace("{txId}", "tx_example_id")
    .replace("{id}", "1");

  const sendRequest = async () => {
    setLoading(true);
    setResponse(null);
    setResponseStatus(null);
    setResponseTime(null);
    const startTime = performance.now();

    try {
      const options: RequestInit = {
        method: selectedEndpoint.method,
        headers: { "Content-Type": "application/json" },
      };

      if (selectedEndpoint.method === "POST" && requestBody.trim()) {
        options.body = requestBody;
      }

      const res = await fetch(resolvedPath, options);
      const elapsed = Math.round(performance.now() - startTime);
      setResponseTime(elapsed);
      setResponseStatus(res.status);

      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        const data = await res.json();
        setResponse(JSON.stringify(data, null, 2));
      } else {
        const text = await res.text();
        setResponse(text);
      }
    } catch (err: any) {
      const elapsed = Math.round(performance.now() - startTime);
      setResponseTime(elapsed);
      setResponseStatus(0);
      setResponse(JSON.stringify({ error: err.message || "Network error" }, null, 2));
    } finally {
      setLoading(false);
    }
  };

  const copyResponse = () => {
    if (response) {
      navigator.clipboard.writeText(response);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const filteredEndpoints = activeCategory
    ? endpoints.filter((e) => e.category === activeCategory)
    : endpoints;

  return (
    <div className="min-h-screen pt-20 lg:pt-32 pb-16 lg:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <span className="font-mono text-xs tracking-widest text-orange-500/80 uppercase mb-3 block" data-testid="label-playground">
            Developer Tools
          </span>
          <h1 className="font-display font-bold text-3xl lg:text-5xl tracking-tight mb-4" data-testid="heading-playground">
            API{" "}
            <span className="dark:text-gradient text-gradient-light">Playground</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base lg:text-lg leading-relaxed" data-testid="desc-playground">
            Test ORBIT Protocol endpoints directly from your browser. Select an endpoint, edit the request body, send the request, and inspect the real response.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-6 items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <Card className="p-4 bg-card/50 dark:bg-white/[0.02] border-border/50" data-testid="card-endpoint-list">
              <h3 className="font-mono text-xs tracking-widest text-orange-500/80 uppercase mb-3">Endpoints</h3>
              <div className="flex flex-wrap gap-1.5 mb-3">
                <button
                  onClick={() => setActiveCategory(null)}
                  className={`px-2 py-1 rounded-md text-xs font-medium transition-colors ${
                    activeCategory === null
                      ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                      : "text-muted-foreground border border-border/30"
                  }`}
                  data-testid="filter-category-all"
                >
                  All
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat === activeCategory ? null : cat)}
                    className={`px-2 py-1 rounded-md text-xs font-medium transition-colors ${
                      activeCategory === cat
                        ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                        : "text-muted-foreground border border-border/30"
                    }`}
                    data-testid={`filter-category-${cat.toLowerCase().replace(/\s/g, "-")}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <div className="space-y-1 max-h-[60vh] overflow-y-auto">
                {filteredEndpoints.map((ep) => (
                  <button
                    key={ep.id}
                    onClick={() => selectEndpoint(ep)}
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                      selectedEndpoint.id === ep.id
                        ? "bg-orange-500/10 border border-orange-500/20"
                        : "border border-transparent hover:bg-white/[0.03]"
                    }`}
                    data-testid={`button-endpoint-${ep.id}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`font-mono text-[10px] font-bold ${getMethodColor(ep.method)}`}>
                        {ep.method}
                      </span>
                      <span className="text-xs font-medium truncate">{ep.label}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground font-mono truncate block mt-0.5">
                      {ep.path}
                    </span>
                  </button>
                ))}
              </div>
            </Card>
          </motion.div>

          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <Card className="p-5 lg:p-6 bg-card/50 dark:bg-white/[0.02] border-border/50" data-testid="card-request">
                <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-orange-500" />
                    <h2 className="font-display font-semibold text-lg tracking-tight">Request</h2>
                  </div>
                  <Badge variant="outline" className="font-mono text-[10px]" data-testid="badge-category">
                    {selectedEndpoint.category}
                  </Badge>
                </div>

                <div className="relative mb-4">
                  <button
                    onClick={() => setShowEndpointDropdown(!showEndpointDropdown)}
                    className="flex items-center justify-between w-full px-4 py-3 rounded-md bg-black/20 border border-border/30 transition-colors"
                    data-testid="select-endpoint"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded-md border ${getMethodBg(selectedEndpoint.method)} ${getMethodColor(selectedEndpoint.method)}`}>
                        {selectedEndpoint.method}
                      </span>
                      <span className="font-mono text-sm">{selectedEndpoint.path}</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${showEndpointDropdown ? "rotate-180" : ""}`} />
                  </button>
                  {showEndpointDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 rounded-md bg-background border border-border/50 shadow-2xl z-50 max-h-80 overflow-y-auto">
                      {endpoints.map((ep) => (
                        <button
                          key={ep.id}
                          onClick={() => selectEndpoint(ep)}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-left hover:bg-white/[0.04] transition-colors first:rounded-t-md last:rounded-b-md"
                          data-testid={`option-endpoint-${ep.id}`}
                        >
                          <span className={`font-mono text-[10px] font-bold w-10 ${getMethodColor(ep.method)}`}>
                            {ep.method}
                          </span>
                          <div className="flex-1 min-w-0">
                            <span className="text-sm font-medium block">{ep.label}</span>
                            <span className="text-[10px] text-muted-foreground font-mono block truncate">{ep.path}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <p className="text-sm text-muted-foreground mb-4" data-testid="text-endpoint-desc">
                  {selectedEndpoint.description}
                </p>

                {selectedEndpoint.method === "GET" && selectedEndpoint.path.includes("{") && (
                  <div className="mb-4 p-3 rounded-md bg-black/20 border border-border/30">
                    <span className="font-mono text-xs text-muted-foreground block mb-1">Resolved URL</span>
                    <span className="font-mono text-sm text-foreground" data-testid="text-resolved-url">{resolvedPath}</span>
                  </div>
                )}

                {selectedEndpoint.method === "POST" && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs text-muted-foreground uppercase tracking-wider">Request Body (JSON)</span>
                      {selectedEndpoint.exampleBody && requestBody !== selectedEndpoint.exampleBody && (
                        <button
                          onClick={() => setRequestBody(selectedEndpoint.exampleBody || "")}
                          className="text-xs text-orange-500/70 hover:text-orange-500 transition-colors"
                          data-testid="button-reset-body"
                        >
                          Reset to example
                        </button>
                      )}
                    </div>
                    <textarea
                      value={requestBody}
                      onChange={(e) => setRequestBody(e.target.value)}
                      className="w-full font-mono text-sm bg-black/30 border border-border/30 rounded-md resize-y focus:outline-none focus:border-orange-500/40 text-foreground"
                      rows={Math.max(6, requestBody.split("\n").length + 1)}
                      spellCheck={false}
                      data-testid="input-request-body"
                    />
                  </div>
                )}

                <Button
                  onClick={sendRequest}
                  disabled={loading}
                  size="lg"
                  className="w-full font-display font-semibold"
                  data-testid="button-send-request"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Send Request
                    </>
                  )}
                </Button>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-5 lg:p-6 bg-card/50 dark:bg-white/[0.02] border-border/50" data-testid="card-response">
                <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-orange-500" />
                    <h2 className="font-display font-semibold text-lg tracking-tight">Response</h2>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    {responseStatus !== null && (
                      <Badge
                        variant="outline"
                        className={`font-mono text-[10px] ${
                          responseStatus >= 200 && responseStatus < 300
                            ? "text-green-400 border-green-500/30"
                            : responseStatus === 0
                              ? "text-red-400 border-red-500/30"
                              : "text-orange-400 border-orange-500/30"
                        }`}
                        data-testid="badge-status-code"
                      >
                        {responseStatus === 0 ? "Error" : responseStatus}
                      </Badge>
                    )}
                    {responseTime !== null && (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span className="font-mono text-xs" data-testid="text-response-time">{responseTime}ms</span>
                      </div>
                    )}
                    {response && (
                      <button
                        onClick={copyResponse}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        data-testid="button-copy-response"
                      >
                        {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    )}
                  </div>
                </div>

                {response ? (
                  <pre
                    className="font-mono text-xs leading-relaxed bg-black/30 border border-border/30 rounded-md p-4 overflow-auto max-h-[500px] whitespace-pre-wrap break-all text-foreground"
                    data-testid="text-response-body"
                  >
                    {response}
                  </pre>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-muted-foreground" data-testid="text-response-placeholder">
                    <Terminal className="w-8 h-8 mb-3 opacity-30" />
                    <p className="text-sm">Send a request to see the response</p>
                    <p className="text-xs mt-1 opacity-60">
                      Select an endpoint and click "Send Request"
                    </p>
                  </div>
                )}
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
