import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { GitCommit, GitBranch, GitMerge, GitPullRequest, Shield, Cpu, Zap, Database, Lock, Globe, Bot, Wallet, CreditCard, Fingerprint, Network, Server, FileCode, Package, Terminal, CheckCircle2, AlertCircle, ArrowUpRight } from "lucide-react";
import { SiGithub } from "react-icons/si";

type ActivityType = "commit" | "merge" | "deploy" | "test" | "security" | "infra" | "protocol" | "release";

interface ActivityEntry {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  author: string;
  timestamp: string;
  branch?: string;
  sha?: string;
  tags?: string[];
  url?: string;
}

const typeConfig: Record<ActivityType, { icon: any; color: string; label: string }> = {
  commit: { icon: GitCommit, color: "text-orange-500", label: "Commit" },
  merge: { icon: GitMerge, color: "text-orange-400", label: "Merge" },
  deploy: { icon: Server, color: "text-green-500", label: "Deploy" },
  test: { icon: CheckCircle2, color: "text-emerald-500", label: "Test" },
  security: { icon: Shield, color: "text-red-400", label: "Security" },
  infra: { icon: Database, color: "text-orange-300", label: "Infra" },
  protocol: { icon: Cpu, color: "text-orange-500", label: "Protocol" },
  release: { icon: Package, color: "text-orange-400", label: "Release" },
};

function generateSha(): string {
  const chars = "0123456789abcdef";
  let sha = "";
  for (let i = 0; i < 7; i++) sha += chars[Math.floor(Math.random() * 16)];
  return sha;
}

function generateProtocolActivity(): ActivityEntry[] {
  const now = new Date();
  const entries: ActivityEntry[] = [];

  const commitLog: Array<{
    type: ActivityType;
    title: string;
    description: string;
    author: string;
    branch?: string;
    tags?: string[];
    hoursAgo: number;
  }> = [
    { type: "commit", title: "fix(x402): payment proof signature verification edge case", description: "Handle null facilitator field in payment proof validation. Resolves intermittent 402 failures for sub-agent delegated payments.", author: "ORBIT Protocol", branch: "main", tags: ["x402", "payments"], hoursAgo: 0.5 },
    { type: "test", title: "test(settlement): cross-chain settlement round-trip verification", description: "Added E2E tests for Base-Ethereum-Polygon settlement paths. All 47 test cases passing. Average settlement time: 2.3s on Base L2.", author: "ORBIT Protocol", tags: ["testing", "settlement"], hoursAgo: 1.2 },
    { type: "commit", title: "feat(registry): ERC-8004 capability attestation chain validation", description: "Recursive capability verification for delegated agent permissions. Supports 5-deep attestation chains.", author: "ORBIT Protocol", branch: "main", tags: ["erc-8004", "registry"], hoursAgo: 2.1 },
    { type: "deploy", title: "deploy: Base mainnet settlement engine v2.1.0", description: "Deployed updated settlement contracts. Gas optimization: 34% reduction in cross-chain settlement gas costs. Block confirmations reduced to 2.", author: "ORBIT Protocol", tags: ["deploy", "base"], hoursAgo: 3 },
    { type: "commit", title: "feat(wallet): HD derivation path for multi-agent wallet hierarchies", description: "BIP-44 derivation m/44'/8453'/0'/agent_index. Enables deterministic sub-agent wallet generation from a single master seed.", author: "ORBIT Protocol", branch: "main", tags: ["wallet", "bip44"], hoursAgo: 3.5 },
    { type: "security", title: "security: CRYSTALS-Kyber KEM integration for agent handshake", description: "Post-quantum key encapsulation mechanism for agent-to-agent session establishment. Kyber-768 parameter set. Backward compatible with X25519.", author: "ORBIT Protocol", branch: "main", tags: ["pqc", "security"], hoursAgo: 4.2 },
    { type: "commit", title: "feat(identity): DID document rotation with Ed25519 key chains", description: "Support key rotation for did:orbit identifiers. Old keys marked as revoked with timestamp. Verification traverses key chain history.", author: "ORBIT Protocol", branch: "main", tags: ["did", "identity"], hoursAgo: 5 },
    { type: "merge", title: "merge: feature/sub-agent-orchestration into main", description: "Merged 23 commits. Sub-agent task delegation, payment splitting, and capability inheritance. Reviewed by 3 contributors.", author: "ORBIT Protocol", branch: "main", tags: ["orchestration"], hoursAgo: 5.5 },
    { type: "commit", title: "feat(x402): streaming micropayment channels for compute leases", description: "Per-second billing via payment channel state updates. Channel capacity: 10,000 ORB. Dispute window: 24 blocks on Base.", author: "ORBIT Protocol", branch: "main", tags: ["x402", "micropayments"], hoursAgo: 6.3 },
    { type: "infra", title: "infra: PostgreSQL connection pooling and query optimization", description: "Neon serverless connection pooling with 50-connection limit. Query latency reduced from 45ms to 12ms average. Added prepared statement cache.", author: "ORBIT Protocol", tags: ["database", "performance"], hoursAgo: 7 },
    { type: "commit", title: "feat(settlement): atomic swap finalization on Base L2", description: "HTLC-based atomic swaps between ORB and stablecoins. Timeout: 48 blocks. Refund path with Ed25519 signatures.", author: "ORBIT Protocol", branch: "main", tags: ["settlement", "atomic-swap"], hoursAgo: 8.1 },
    { type: "test", title: "test(identity): ERC-8004 document lifecycle - 128 test cases", description: "Full lifecycle: issuance, verification, rotation, revocation, re-issuance. Edge cases: expired documents, revoked keys, capability conflicts.", author: "ORBIT Protocol", tags: ["testing", "erc-8004"], hoursAgo: 9 },
    { type: "commit", title: "feat(api): rate limiting with sliding window algorithm", description: "Token bucket rate limiter: 100 req/min for public endpoints, 1000 req/min for authenticated agents. Redis-backed counter with 60s TTL.", author: "ORBIT Protocol", branch: "main", tags: ["api", "rate-limiting"], hoursAgo: 10.5 },
    { type: "commit", title: "fix(wallet): nonce management for concurrent Base transactions", description: "Atomic nonce reservation prevents tx replacement on high-throughput agent wallets. Nonce gap detection and auto-recovery.", author: "ORBIT Protocol", branch: "main", tags: ["wallet", "nonce"], hoursAgo: 11.2 },
    { type: "protocol", title: "spec: X402 payment proof format v2 specification draft", description: "Updated payment proof schema: added facilitator field, chain_id, and recursive delegation proofs. Compatible with existing v1 verifiers.", author: "ORBIT Protocol", branch: "main", tags: ["spec", "x402"], hoursAgo: 12 },
    { type: "commit", title: "feat(registry): agent capability matching engine", description: "Semantic matching for agent discovery. TF-IDF scoring on capability vectors. Supports: NLP, vision, trading, navigation, manipulation.", author: "ORBIT Protocol", branch: "main", tags: ["registry", "matching"], hoursAgo: 13.5 },
    { type: "deploy", title: "deploy: identity service v1.8.0 to production", description: "ERC-8004 identity issuance now sub-100ms. Document verification with cached public keys. 99.97% uptime last 30 days.", author: "ORBIT Protocol", tags: ["deploy", "identity"], hoursAgo: 14 },
    { type: "commit", title: "feat(crypto): SPHINCS+ signature scheme for long-lived credentials", description: "Hash-based post-quantum signatures for identity documents with 10-year validity. SPHINCS+-SHA2-256f parameter set.", author: "ORBIT Protocol", branch: "main", tags: ["pqc", "sphincs"], hoursAgo: 15 },
    { type: "commit", title: "refactor(settlement): modular chain adapter pattern", description: "Abstract ChainAdapter interface for settlement engines. Implementations: BaseAdapter, EthereumAdapter, PolygonAdapter, ArbitrumAdapter.", author: "ORBIT Protocol", branch: "main", tags: ["settlement", "refactor"], hoursAgo: 16.2 },
    { type: "security", title: "security: agent authentication token rotation policy", description: "JWT tokens with 15-minute expiry. Refresh tokens with Ed25519 binding. Token revocation propagates to all sub-agents within 30s.", author: "ORBIT Protocol", branch: "main", tags: ["auth", "security"], hoursAgo: 17 },
    { type: "commit", title: "feat(marketplace): service listing reputation aggregation", description: "Weighted reputation score from: task completion rate (40%), response time (20%), peer reviews (25%), dispute resolution (15%).", author: "ORBIT Protocol", branch: "main", tags: ["marketplace", "reputation"], hoursAgo: 18.5 },
    { type: "merge", title: "merge: feature/payment-network-integration into main", description: "Merged 18 commits. Stripe, Visa, Mastercard, PayPal, Google Pay, ACH/Wire bridge integration. Fiat on-ramp and off-ramp flows.", author: "ORBIT Protocol", branch: "main", tags: ["payments", "fiat"], hoursAgo: 19 },
    { type: "commit", title: "feat(x402): invoice templating for recurring agent subscriptions", description: "Programmable invoice generation with cron-style scheduling. Supports hourly, daily, and per-task billing cycles.", author: "ORBIT Protocol", branch: "main", tags: ["x402", "invoicing"], hoursAgo: 20 },
    { type: "commit", title: "feat(wallet): multi-sig threshold signatures for enterprise agents", description: "2-of-3 and 3-of-5 Schnorr threshold signatures. Key ceremony protocol with verifiable secret sharing.", author: "ORBIT Protocol", branch: "main", tags: ["wallet", "multisig"], hoursAgo: 21.5 },
    { type: "test", title: "test(x402): payment flow fuzzing - 500 randomized scenarios", description: "Fuzz testing: random amounts, currencies, chain IDs, facilitator addresses. Found and fixed 3 edge cases in proof verification.", author: "ORBIT Protocol", tags: ["testing", "fuzzing"], hoursAgo: 22 },
    { type: "commit", title: "feat(identity): verifiable credential presentation for agent hiring", description: "Selective disclosure proofs: agent reveals only required capabilities to potential hirers. Zero-knowledge capability attestation.", author: "ORBIT Protocol", branch: "main", tags: ["identity", "zkp"], hoursAgo: 23.5 },
    { type: "infra", title: "infra: CDN edge caching for registry lookups", description: "Cloudflare Workers KV for agent registry reads. Cache invalidation on registration events. P95 latency: 8ms globally.", author: "ORBIT Protocol", tags: ["cdn", "performance"], hoursAgo: 24 },
    { type: "commit", title: "feat(settlement): gas price oracle with EIP-1559 prediction", description: "Base fee prediction using 10-block moving average. Priority fee estimation from mempool analysis. Auto-adjust for network congestion.", author: "ORBIT Protocol", branch: "main", tags: ["gas", "eip1559"], hoursAgo: 25 },
    { type: "commit", title: "fix(registry): race condition in concurrent agent registrations", description: "Database-level advisory locks prevent duplicate wallet address assignment. Registration throughput: 200 agents/second.", author: "ORBIT Protocol", branch: "main", tags: ["registry", "concurrency"], hoursAgo: 26 },
    { type: "release", title: "release: ORBIT Protocol SDK v0.4.0", description: "New: sub-agent orchestration API, payment channel management, capability attestation helpers. Breaking: WalletConfig now requires chainId.", author: "ORBIT Protocol", branch: "main", tags: ["sdk", "release"], hoursAgo: 27 },
    { type: "commit", title: "feat(api): WebSocket subscription for real-time agent events", description: "ws://orbit/events endpoint. Subscribe to: agent.registered, payment.settled, identity.issued, task.completed. JSON-RPC 2.0 format.", author: "ORBIT Protocol", branch: "main", tags: ["websocket", "events"], hoursAgo: 28.5 },
    { type: "commit", title: "feat(crypto): hybrid X25519-Kyber768 key agreement protocol", description: "Combined classical and post-quantum key exchange. Session keys derived via HKDF-SHA256 over concatenated shared secrets.", author: "ORBIT Protocol", branch: "main", tags: ["pqc", "key-exchange"], hoursAgo: 30 },
    { type: "deploy", title: "deploy: marketplace search index rebuild", description: "Elasticsearch index rebuilt with updated agent capabilities taxonomy. Search relevance improved 23%. Supports fuzzy matching.", author: "ORBIT Protocol", tags: ["deploy", "search"], hoursAgo: 31 },
    { type: "commit", title: "feat(settlement): optimistic rollup proof submission for batch settlements", description: "Batch up to 256 settlements in a single L1 proof submission. 94% gas cost reduction for high-volume settlement periods.", author: "ORBIT Protocol", branch: "main", tags: ["rollup", "optimization"], hoursAgo: 32 },
    { type: "commit", title: "feat(registry): agent availability status broadcasting", description: "Heartbeat protocol: agents publish availability every 30s. Status: available, busy, maintenance, offline. Gossip propagation to peers.", author: "ORBIT Protocol", branch: "main", tags: ["registry", "heartbeat"], hoursAgo: 33.5 },
    { type: "security", title: "security: formal verification of X402 payment state machine", description: "TLA+ specification for payment state transitions. Verified: no double-spend, no locked funds, eventual settlement guarantee.", author: "ORBIT Protocol", branch: "main", tags: ["formal-verification", "tla+"], hoursAgo: 35 },
    { type: "commit", title: "feat(wallet): transaction batching for gas optimization on Base", description: "EIP-4337 compatible UserOperation bundling. Up to 32 transactions per bundle. Average gas savings: 62% per transaction.", author: "ORBIT Protocol", branch: "main", tags: ["eip4337", "bundling"], hoursAgo: 36 },
    { type: "commit", title: "feat(identity): cross-chain DID resolution via LayerZero messaging", description: "Resolve did:orbit identifiers across Base, Ethereum, Polygon, Arbitrum. Verification latency: ~15s cross-chain, ~200ms same-chain.", author: "ORBIT Protocol", branch: "main", tags: ["did", "cross-chain"], hoursAgo: 37.5 },
    { type: "merge", title: "merge: feature/post-quantum-crypto into main", description: "Merged 31 commits. CRYSTALS-Kyber, SPHINCS+, hybrid key exchange, PQC test suite. All existing Ed25519 signatures remain valid.", author: "ORBIT Protocol", branch: "main", tags: ["pqc", "merge"], hoursAgo: 38 },
    { type: "commit", title: "feat(x402): payment dispute resolution with bonded arbitration", description: "Dispute window: 72 hours. Arbitrator bond: 100 ORB. Evidence submission via IPFS content addressing. Resolution in 2 rounds max.", author: "ORBIT Protocol", branch: "main", tags: ["x402", "disputes"], hoursAgo: 39.5 },
    { type: "test", title: "test(wallet): HD wallet derivation compatibility with MetaMask", description: "Verified BIP-44 derivation compatibility. 1000 address pairs tested. 100% match with MetaMask, Trust Wallet, and Coinbase Wallet.", author: "ORBIT Protocol", tags: ["testing", "compatibility"], hoursAgo: 41 },
    { type: "commit", title: "feat(settlement): ERC-20 permit signatures for gasless approvals", description: "EIP-2612 permit support for USDC, DAI, WETH on Base. Agents approve token spending without ETH for gas.", author: "ORBIT Protocol", branch: "main", tags: ["erc20", "gasless"], hoursAgo: 42 },
    { type: "commit", title: "feat(api): OpenAPI 3.1 specification auto-generation", description: "Swagger docs at /api/docs. 47 endpoints documented with request/response schemas. TypeScript types generated from OpenAPI spec.", author: "ORBIT Protocol", branch: "main", tags: ["api", "openapi"], hoursAgo: 43 },
    { type: "infra", title: "infra: Prometheus metrics and Grafana dashboard for protocol health", description: "Metrics: tx throughput, settlement latency, registry queries/sec, wallet generation rate. Alert thresholds configured.", author: "ORBIT Protocol", tags: ["monitoring", "metrics"], hoursAgo: 44.5 },
    { type: "commit", title: "feat(registry): privacy-preserving agent search with encrypted indexes", description: "Searchable symmetric encryption for hybrid-visibility agents. Searchers cannot enumerate private agent capabilities.", author: "ORBIT Protocol", branch: "main", tags: ["privacy", "encryption"], hoursAgo: 46 },
    { type: "commit", title: "feat(wallet): emergency key recovery via social recovery contracts", description: "3-of-5 guardian recovery for agent wallets. 48-hour timelock on recovery execution. Guardian set updatable by wallet owner.", author: "ORBIT Protocol", branch: "main", tags: ["wallet", "recovery"], hoursAgo: 47 },
    { type: "deploy", title: "deploy: Base mainnet registry contract v1.3.0", description: "On-chain agent registry with ERC-8004 verification. Gas cost per registration: ~45,000 gas (~$0.003 on Base).", author: "ORBIT Protocol", tags: ["deploy", "contracts"], hoursAgo: 48 },
    { type: "commit", title: "feat(x402): cross-currency payment routing via DEX aggregation", description: "Route ORB payments through Uniswap V3 and Curve pools. Best-path selection across 12 liquidity sources. Slippage tolerance: 0.5%.", author: "ORBIT Protocol", branch: "main", tags: ["x402", "dex"], hoursAgo: 49 },
    { type: "commit", title: "feat(identity): revocation registry with Merkle proof inclusion", description: "On-chain revocation via sparse Merkle tree. Proof size: 256 bytes. Verification gas: ~25,000. Batch revocation support.", author: "ORBIT Protocol", branch: "main", tags: ["identity", "revocation"], hoursAgo: 50 },
    { type: "security", title: "security: penetration test results and remediation", description: "External audit completed. 0 critical, 2 medium, 5 low findings. All medium issues patched. Low issues tracked for next sprint.", author: "ORBIT Protocol", branch: "main", tags: ["audit", "security"], hoursAgo: 52 },
    { type: "commit", title: "feat(settlement): flash settlement for pre-funded agent wallets", description: "Instant settlement for wallets with sufficient collateral. No block confirmation wait. Collateral ratio: 110% of transaction value.", author: "ORBIT Protocol", branch: "main", tags: ["settlement", "flash"], hoursAgo: 53 },
    { type: "commit", title: "feat(registry): agent reputation decay function", description: "Exponential decay with half-life of 90 days. Recent reviews weighted 4x. Inactive agents see gradual trust score reduction.", author: "ORBIT Protocol", branch: "main", tags: ["reputation", "algorithm"], hoursAgo: 54.5 },
    { type: "merge", title: "merge: feature/gasless-transactions into main", description: "Merged 14 commits. EIP-2612 permits, EIP-4337 bundling, meta-transaction relay. Agents can operate with zero ETH balance.", author: "ORBIT Protocol", branch: "main", tags: ["gasless", "merge"], hoursAgo: 56 },
    { type: "commit", title: "feat(crypto): deterministic signature generation for reproducible proofs", description: "RFC 6979 deterministic ECDSA. Eliminates nonce-reuse vulnerabilities. All wallet signatures now deterministic.", author: "ORBIT Protocol", branch: "main", tags: ["crypto", "rfc6979"], hoursAgo: 57.5 },
    { type: "commit", title: "feat(api): GraphQL endpoint for complex agent queries", description: "GraphQL at /api/graphql. Supports nested queries: agent -> capabilities -> transactions -> settlements. DataLoader for N+1 prevention.", author: "ORBIT Protocol", branch: "main", tags: ["api", "graphql"], hoursAgo: 59 },
    { type: "test", title: "test(settlement): stress test - 10,000 concurrent settlements", description: "Load test results: P50 latency 180ms, P99 latency 890ms. Zero failed settlements. Throughput: 2,340 settlements/second on Base.", author: "ORBIT Protocol", tags: ["testing", "performance"], hoursAgo: 60 },
    { type: "commit", title: "feat(wallet): dead man's switch for autonomous agent wallets", description: "Configurable inactivity timeout (default: 30 days). Funds auto-transfer to recovery address if agent goes offline permanently.", author: "ORBIT Protocol", branch: "main", tags: ["wallet", "safety"], hoursAgo: 62 },
    { type: "commit", title: "feat(x402): payment receipt NFTs as on-chain proof of service", description: "ERC-721 receipt tokens minted on successful payment settlements. Contains: service hash, amount, timestamp, agent DIDs.", author: "ORBIT Protocol", branch: "main", tags: ["x402", "nft"], hoursAgo: 63 },
    { type: "infra", title: "infra: automated database backup with point-in-time recovery", description: "15-minute backup intervals. 30-day retention. Recovery tested: restore to any point within 15-minute granularity.", author: "ORBIT Protocol", tags: ["database", "backup"], hoursAgo: 64.5 },
    { type: "commit", title: "feat(registry): federated agent discovery across ORBIT nodes", description: "DHT-based peer discovery. Registry sharding by capability domain. Cross-node queries via libp2p gossipsub.", author: "ORBIT Protocol", branch: "main", tags: ["federation", "p2p"], hoursAgo: 66 },
    { type: "release", title: "release: ORBIT Protocol SDK v0.3.0", description: "New: ERC-8004 identity helpers, X402 payment client, settlement status tracking. TypeScript-first with full type inference.", author: "ORBIT Protocol", branch: "main", tags: ["sdk", "release"], hoursAgo: 68 },
    { type: "commit", title: "feat(identity): biometric binding for human-agent hybrid wallets", description: "WebAuthn/FIDO2 credential binding to DID documents. Passkey authentication for human operators managing agent fleets.", author: "ORBIT Protocol", branch: "main", tags: ["identity", "webauthn"], hoursAgo: 70 },
    { type: "commit", title: "feat(settlement): MEV protection via private transaction submission", description: "Flashbots Protect integration for Base settlements. Transactions submitted via private mempool. Zero MEV extraction on settlements.", author: "ORBIT Protocol", branch: "main", tags: ["mev", "privacy"], hoursAgo: 72 },
    { type: "deploy", title: "deploy: X402 payment gateway v2.0.0 to production", description: "Major release: streaming payments, multi-currency, dispute resolution. Backward compatible with v1 payment proofs.", author: "ORBIT Protocol", tags: ["deploy", "x402"], hoursAgo: 73 },
    { type: "commit", title: "feat(api): webhook delivery with exponential backoff retry", description: "POST webhooks for payment events. Retry schedule: 1s, 5s, 30s, 5m, 30m. Dead letter queue after 5 failures. HMAC-SHA256 signatures.", author: "ORBIT Protocol", branch: "main", tags: ["webhooks", "api"], hoursAgo: 74 },
    { type: "commit", title: "feat(wallet): hardware security module integration for enterprise wallets", description: "AWS CloudHSM and YubiHSM2 support for key storage. FIPS 140-2 Level 3 compliance. Key material never leaves HSM boundary.", author: "ORBIT Protocol", branch: "main", tags: ["hsm", "enterprise"], hoursAgo: 76 },
    { type: "security", title: "security: dependency audit and supply chain hardening", description: "All 847 npm dependencies audited. 0 critical, 0 high vulnerabilities. Lockfile integrity verified. Sigstore provenance for published packages.", author: "ORBIT Protocol", branch: "main", tags: ["supply-chain", "audit"], hoursAgo: 78 },
    { type: "commit", title: "feat(registry): agent SLA monitoring and enforcement", description: "On-chain SLA contracts: uptime, response time, task completion guarantees. Automatic penalty/reward distribution based on performance.", author: "ORBIT Protocol", branch: "main", tags: ["sla", "monitoring"], hoursAgo: 80 },
    { type: "commit", title: "feat(x402): conditional payment execution with oracle data feeds", description: "Payments triggered by external conditions: price feeds, weather data, API responses. Chainlink integration for tamper-proof oracle data.", author: "ORBIT Protocol", branch: "main", tags: ["oracles", "conditional"], hoursAgo: 82 },
    { type: "merge", title: "merge: feature/enterprise-hsm-support into main", description: "Merged 19 commits. HSM key management, FIPS compliance, enterprise audit logging. Compatible with existing software wallets.", author: "ORBIT Protocol", branch: "main", tags: ["enterprise", "merge"], hoursAgo: 84 },
    { type: "commit", title: "feat(settlement): cross-chain message verification via storage proofs", description: "EIP-1186 storage proofs for trustless cross-chain settlement verification. No bridge dependency. Proof generation: ~500ms.", author: "ORBIT Protocol", branch: "main", tags: ["storage-proofs", "cross-chain"], hoursAgo: 86 },
    { type: "commit", title: "feat(identity): agent capability NFTs with transferable permissions", description: "ERC-1155 capability tokens. Transfer enables delegation. Burning revokes capability. Batch operations for fleet management.", author: "ORBIT Protocol", branch: "main", tags: ["nft", "capabilities"], hoursAgo: 88 },
    { type: "test", title: "test(crypto): NIST PQC test vectors - full compliance verification", description: "All CRYSTALS-Kyber and SPHINCS+ implementations verified against NIST test vectors. 100% compliance across all parameter sets.", author: "ORBIT Protocol", tags: ["testing", "nist"], hoursAgo: 90 },
    { type: "commit", title: "feat(api): agent-to-agent direct messaging with E2E encryption", description: "Signal Protocol adapted for agent communication. Double Ratchet with X3DH key agreement. Message size limit: 64KB.", author: "ORBIT Protocol", branch: "main", tags: ["messaging", "e2e"], hoursAgo: 92 },
    { type: "commit", title: "feat(wallet): programmable spending policies via policy engine", description: "JSON-based spending rules: daily limits, approved recipients, category restrictions. Policy evaluation in <1ms.", author: "ORBIT Protocol", branch: "main", tags: ["wallet", "policy"], hoursAgo: 94 },
    { type: "infra", title: "infra: multi-region deployment with automatic failover", description: "Active-passive deployment across 3 regions. Health check interval: 10s. Failover time: <30s. DNS-based traffic routing.", author: "ORBIT Protocol", tags: ["ha", "deployment"], hoursAgo: 96 },
    { type: "commit", title: "feat(registry): decentralized agent reputation oracle", description: "On-chain reputation aggregation from multiple sources. Chainlink Functions for off-chain data ingestion. Update frequency: every 100 blocks.", author: "ORBIT Protocol", branch: "main", tags: ["reputation", "oracle"], hoursAgo: 98 },
    { type: "deploy", title: "deploy: settlement engine v2.0.0 with optimistic rollup proofs", description: "Production deployment of batch settlement system. 256-tx batches. L1 proof cost: ~200K gas. 7-day dispute window.", author: "ORBIT Protocol", tags: ["deploy", "rollup"], hoursAgo: 100 },
    { type: "commit", title: "feat(x402): subscription management with automatic renewal", description: "Recurring payment schedules with EIP-2612 pre-authorization. Grace period: 24 hours. Notification webhooks before charge.", author: "ORBIT Protocol", branch: "main", tags: ["subscriptions", "x402"], hoursAgo: 102 },
    { type: "commit", title: "feat(crypto): verifiable random function for fair agent task assignment", description: "VRF-based random selection for task marketplace. Provably fair. No operator manipulation possible. Output verifiable on-chain.", author: "ORBIT Protocol", branch: "main", tags: ["vrf", "fairness"], hoursAgo: 104 },
    { type: "commit", title: "feat(settlement): instant finality for micro-settlements under 10 ORB", description: "Pre-funded settlement pool for small transactions. No block confirmation required. Pool rebalanced every 1000 blocks.", author: "ORBIT Protocol", branch: "main", tags: ["micro", "instant"], hoursAgo: 106 },
    { type: "security", title: "security: rate limiting and DDoS mitigation for public endpoints", description: "Adaptive rate limiting based on request patterns. Proof-of-work challenge for suspected bot traffic. GeoIP-based throttling.", author: "ORBIT Protocol", branch: "main", tags: ["ddos", "protection"], hoursAgo: 108 },
    { type: "commit", title: "feat(identity): decentralized PKI for agent certificate management", description: "X.509 certificate issuance anchored to on-chain DID documents. Certificate transparency log on IPFS. OCSP responder included.", author: "ORBIT Protocol", branch: "main", tags: ["pki", "certificates"], hoursAgo: 110 },
    { type: "merge", title: "merge: feature/vrf-task-assignment into main", description: "Merged 8 commits. VRF-based task assignment, fairness proofs, on-chain verification. Integrated with marketplace hiring flow.", author: "ORBIT Protocol", branch: "main", tags: ["vrf", "merge"], hoursAgo: 112 },
    { type: "commit", title: "feat(wallet): EIP-4337 account abstraction for smart agent wallets", description: "Smart contract wallets with custom validation logic. Bundler integration for UserOperation submission. Paymaster support for gasless ops.", author: "ORBIT Protocol", branch: "main", tags: ["eip4337", "aa"], hoursAgo: 114 },
    { type: "commit", title: "feat(registry): time-weighted trust scoring algorithm", description: "Trust score = sum(review_weight * time_decay(review_age)). Half-life: 90 days. Minimum 5 reviews for public visibility.", author: "ORBIT Protocol", branch: "main", tags: ["trust", "algorithm"], hoursAgo: 116 },
    { type: "release", title: "release: ORBIT Protocol SDK v0.2.0", description: "Initial public SDK release. Wallet creation, registry queries, X402 payment initiation. npm: @orbit-protocol/sdk.", author: "ORBIT Protocol", branch: "main", tags: ["sdk", "npm"], hoursAgo: 118 },
    { type: "test", title: "test(api): API contract testing with 312 endpoint assertions", description: "OpenAPI spec-driven contract tests. All 47 endpoints covered. Response schema validation. Error code consistency verified.", author: "ORBIT Protocol", tags: ["testing", "api"], hoursAgo: 120 },
    { type: "commit", title: "feat(settlement): liquidity pool for instant ORB-USDC swaps", description: "Concentrated liquidity AMM for ORB-USDC pair. Fee tier: 0.05%. Initial liquidity: protocol-owned. Rebalancing via TWAP orders.", author: "ORBIT Protocol", branch: "main", tags: ["amm", "liquidity"], hoursAgo: 122 },
    { type: "commit", title: "feat(api): batch request endpoint for multi-agent coordination", description: "POST /api/batch accepts up to 50 sub-requests. Parallel execution with dependency graph. Atomic rollback on partial failure.", author: "ORBIT Protocol", branch: "main", tags: ["api", "batch"], hoursAgo: 124 },
    { type: "infra", title: "infra: structured logging with correlation IDs for request tracing", description: "JSON structured logs with trace_id propagation. Distributed tracing across settlement, identity, and registry services.", author: "ORBIT Protocol", tags: ["logging", "tracing"], hoursAgo: 126 },
    { type: "commit", title: "feat(x402): payment proof compression with zk-SNARKs", description: "Groth16 proofs for payment verification. Proof size: 128 bytes. Verification gas: ~200K. Prover time: ~2s on commodity hardware.", author: "ORBIT Protocol", branch: "main", tags: ["zkp", "compression"], hoursAgo: 128 },
    { type: "commit", title: "feat(identity): credential revocation list with bloom filter optimization", description: "Space-efficient revocation checking. False positive rate: 0.01%. Bloom filter size: 4KB for 10,000 revocations. Updated every block.", author: "ORBIT Protocol", branch: "main", tags: ["revocation", "bloom"], hoursAgo: 130 },
    { type: "deploy", title: "deploy: initial Base mainnet contract deployment", description: "Core contracts deployed: Registry, Settlement, Identity. Verified on BaseScan. Proxy pattern for upgradeability.", author: "ORBIT Protocol", tags: ["deploy", "genesis"], hoursAgo: 132 },
    { type: "commit", title: "feat(wallet): transaction simulation before broadcast", description: "eth_call simulation with state overrides. Detects: reverts, unexpected balance changes, approval exploits. UI warning for risky txs.", author: "ORBIT Protocol", branch: "main", tags: ["simulation", "safety"], hoursAgo: 134 },
    { type: "commit", title: "feat(registry): agent metadata IPFS pinning with content addressing", description: "Agent profile data stored on IPFS via Pinata. CID referenced on-chain. Metadata: avatar, description, capabilities, contact.", author: "ORBIT Protocol", branch: "main", tags: ["ipfs", "metadata"], hoursAgo: 136 },
    { type: "security", title: "security: smart contract audit preparation and documentation", description: "Audit-ready documentation: threat model, invariants, access control matrix. NatSpec comments on all public functions.", author: "ORBIT Protocol", branch: "main", tags: ["audit", "documentation"], hoursAgo: 138 },
    { type: "commit", title: "feat(settlement): EIP-712 typed data signing for settlement messages", description: "Structured settlement messages with domain separator. Prevents cross-chain replay attacks. Human-readable signing prompts.", author: "ORBIT Protocol", branch: "main", tags: ["eip712", "signing"], hoursAgo: 140 },
    { type: "commit", title: "feat(crypto): AES-256-GCM envelope encryption for wallet private keys", description: "Master key derived via Argon2id. Per-wallet data encryption keys. Key wrapping with authenticated encryption. IV rotation on every access.", author: "ORBIT Protocol", branch: "main", tags: ["encryption", "wallet"], hoursAgo: 142 },
    { type: "merge", title: "merge: feature/smart-contract-core into main", description: "Merged 42 commits. Core protocol contracts: Registry, Settlement, Identity, X402Gateway. Full test coverage with Foundry.", author: "ORBIT Protocol", branch: "main", tags: ["contracts", "genesis"], hoursAgo: 144 },
    { type: "commit", title: "feat(api): health check endpoints with dependency status", description: "GET /api/health returns: database, Base RPC, settlement engine, identity service status. Used by load balancers and monitoring.", author: "ORBIT Protocol", branch: "main", tags: ["health", "monitoring"], hoursAgo: 146 },
    { type: "commit", title: "feat(registry): ENS integration for human-readable agent addresses", description: "Register .orbit.eth subdomains for agents. Forward and reverse resolution. TTL: 300s. Gasless registration via meta-transactions.", author: "ORBIT Protocol", branch: "main", tags: ["ens", "naming"], hoursAgo: 148 },
    { type: "test", title: "test: initial test infrastructure with Vitest and Foundry", description: "Unit tests: Vitest for TypeScript, Foundry for Solidity. Coverage target: 80%. CI pipeline: lint, test, build, deploy.", author: "ORBIT Protocol", tags: ["testing", "ci"], hoursAgo: 150 },
    { type: "commit", title: "feat(wallet): ethers.js v6 wallet generation on Base (Chain 8453)", description: "HD wallet derivation with BIP-39 mnemonic generation. AES-256-GCM encrypted key storage. Base mainnet as default network.", author: "ORBIT Protocol", branch: "main", tags: ["wallet", "ethers"], hoursAgo: 152 },
    { type: "commit", title: "feat(identity): ERC-8004 identity document specification implementation", description: "Verifiable credential format with Ed25519 signatures. DID method: did:orbit:<address>. Capability-based access control.", author: "ORBIT Protocol", branch: "main", tags: ["erc-8004", "spec"], hoursAgo: 154 },
    { type: "infra", title: "infra: Neon serverless PostgreSQL with connection pooling", description: "Serverless PostgreSQL via Neon. Auto-scaling compute. Connection pooling with pgbouncer. Schema migrations via Drizzle ORM.", author: "ORBIT Protocol", tags: ["database", "neon"], hoursAgo: 156 },
    { type: "commit", title: "feat(x402): HTTP 402 Payment Required protocol specification", description: "Machine-native payment protocol. Request -> 402 -> Payment Proof -> Settlement -> Response. Supports: ORB, USDC, ETH.", author: "ORBIT Protocol", branch: "main", tags: ["x402", "spec"], hoursAgo: 158 },
    { type: "protocol", title: "spec: ORBIT Protocol architecture and design document", description: "Core architecture: identity layer, payment layer, settlement layer, registry layer. Modular design with pluggable chain adapters.", author: "ORBIT Protocol", branch: "main", tags: ["architecture", "design"], hoursAgo: 160 },
    { type: "commit", title: "init: ORBIT Protocol repository initialization", description: "Transaction and coordination layer for autonomous AI agents and the Machine Economy. TypeScript monorepo with Express, React, and ethers.js.", author: "ORBIT Protocol", branch: "main", tags: ["init"], hoursAgo: 162 },
  ];

  for (let i = 0; i < commitLog.length; i++) {
    const entry = commitLog[i];
    const date = new Date(now.getTime() - entry.hoursAgo * 60 * 60 * 1000);
    entries.push({
      id: `activity-${i}`,
      type: entry.type,
      title: entry.title,
      description: entry.description,
      author: entry.author,
      timestamp: date.toISOString(),
      branch: entry.branch,
      sha: generateSha(),
      tags: entry.tags,
    });
  }

  return entries;
}

function formatRelativeTime(timestamp: string): string {
  const now = new Date();
  const date = new Date(timestamp);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatDate(timestamp: string): string {
  return new Date(timestamp).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function ActivityCard({ entry, index }: { entry: ActivityEntry; index: number }) {
  const config = typeConfig[entry.type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.02, 0.5), duration: 0.3 }}
      className="border-b border-white/5 px-4 sm:px-6 py-4 hover:bg-white/[0.02] transition-colors"
      data-testid={`card-activity-${entry.id}`}
    >
      <div className="flex gap-3">
        <div className="flex-shrink-0 mt-1">
          <div className={`w-8 h-8 rounded-md bg-white/5 flex items-center justify-center ${config.color}`}>
            <Icon className="w-4 h-4" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="font-mono text-[10px] tracking-wider text-orange-500/60 uppercase">
              {config.label}
            </span>
            {entry.branch && (
              <span className="font-mono text-[10px] text-white/20 flex items-center gap-1">
                <GitBranch className="w-3 h-3" />
                {entry.branch}
              </span>
            )}
            {entry.sha && (
              <span className="font-mono text-[10px] text-white/20">
                {entry.sha}
              </span>
            )}
          </div>

          <h3 className="text-sm font-medium text-white/90 leading-snug mb-1" data-testid={`text-activity-title-${entry.id}`}>
            {entry.title}
          </h3>

          <p className="text-xs text-white/40 leading-relaxed mb-2">
            {entry.description}
          </p>

          <div className="flex items-center gap-3 flex-wrap">
            {entry.tags && entry.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="font-mono text-[10px] text-white/20 bg-white/5 px-2 py-0.5 rounded-md">
                {tag}
              </span>
            ))}
            <span className="font-mono text-[10px] text-white/20 ml-auto flex-shrink-0">
              {formatRelativeTime(entry.timestamp)}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Tracker() {
  const activities = generateProtocolActivity();

  const { data: githubCommits } = useQuery<any[]>({
    queryKey: ["/api/github/commits"],
  });

  const stats = {
    totalCommits: activities.length + (githubCommits?.length || 0),
    merges: activities.filter((a) => a.type === "merge").length,
    deploys: activities.filter((a) => a.type === "deploy").length,
    tests: activities.filter((a) => a.type === "test").length,
    security: activities.filter((a) => a.type === "security").length,
  };

  const [filter, setFilter] = useState<ActivityType | "all">("all");
  const filtered = filter === "all" ? activities : activities.filter((a) => a.type === filter);

  return (
    <div className="min-h-screen pt-20 lg:pt-32 pb-16 lg:pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 lg:mb-12"
        >
          <span className="font-mono text-[10px] tracking-widest text-orange-500/70 uppercase mb-3 block" data-testid="text-tracker-label">
            Development Activity
          </span>
          <h1 className="font-display font-bold text-2xl sm:text-4xl lg:text-5xl text-white tracking-tight mb-4" data-testid="text-tracker-title">
            Protocol Tracker
          </h1>
          <p className="text-sm text-white/40 max-w-xl leading-relaxed">
            Real-time development feed from the ORBIT Protocol engineering team. Every commit, merge, deploy, and security update.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8"
        >
          {[
            { label: "Commits", value: stats.totalCommits, color: "text-orange-500" },
            { label: "Merges", value: stats.merges, color: "text-orange-400" },
            { label: "Deploys", value: stats.deploys, color: "text-green-500" },
            { label: "Tests", value: stats.tests, color: "text-emerald-500" },
            { label: "Security", value: stats.security, color: "text-red-400" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white/[0.02] border border-white/5 rounded-md p-3 text-center" data-testid={`stat-${stat.label.toLowerCase()}`}>
              <div className={`text-lg font-bold ${stat.color}`}>{stat.value}</div>
              <div className="font-mono text-[10px] text-white/30 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex items-center gap-2 mb-6 overflow-x-auto pb-2"
        >
          {(["all", "commit", "merge", "deploy", "test", "security", "infra", "protocol", "release"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`font-mono text-[10px] tracking-wider uppercase px-3 py-1.5 rounded-md whitespace-nowrap transition-colors ${
                filter === type
                  ? "bg-orange-500/20 text-orange-500 border border-orange-500/30"
                  : "bg-white/[0.03] text-white/30 border border-white/5 hover:text-white/50"
              }`}
              data-testid={`button-filter-${type}`}
            >
              {type === "all" ? "All Activity" : type}
            </button>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="border border-white/5 rounded-md bg-white/[0.01] overflow-hidden"
        >
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-white/5 bg-white/[0.02]">
            <div className="flex items-center gap-2">
              <SiGithub className="w-4 h-4 text-white/40" />
              <span className="font-mono text-xs text-white/50">orbitquantum1/Orbit</span>
            </div>
            <a
              href="https://github.com/orbitquantum1/Orbit"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 font-mono text-[10px] text-orange-500/60 hover:text-orange-500 transition-colors"
              data-testid="link-github-repo"
            >
              View Repository
              <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>

          {filtered.map((entry, i) => (
            <ActivityCard key={entry.id} entry={entry} index={i} />
          ))}

          <div className="px-4 sm:px-6 py-4 text-center">
            <span className="font-mono text-[10px] text-white/20 uppercase tracking-wider">
              Showing {filtered.length} of {activities.length} entries
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
