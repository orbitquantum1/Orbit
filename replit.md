# ORBIT - The Transaction Layer for Autonomous AI & The Machine Economy

## Overview
Premium protocol website for ORBIT, the transaction and coordination layer for autonomous AI agents, robots, and the Machine Economy. Features real wallet infrastructure on Base network (ethers.js), cryptographic signing, multi-chain balance checking, task coordination pools, and X402 payment protocol. Dark-mode-only design inspired by McLaren/Tesla/SpaceX/F1 branding. GitHub: https://github.com/orbitquantum1/Orbit

## Architecture
- **Frontend**: React + TypeScript + Vite + Tailwind CSS + Framer Motion
- **Backend**: Express.js + PostgreSQL (Neon Serverless) + Drizzle ORM
- **Wallet Engine**: ethers.js for real Ethereum wallet generation on Base network
- **Crypto**: AES-256-GCM encryption, Ed25519 signatures, ERC-8004 identity proofs
- **Routing**: Wouter (client-side)
- **UI Components**: shadcn/ui
- **Theme**: Dark mode only (pure black, white text, orange-500 accents)
- **Database**: PostgreSQL via @neondatabase/serverless with drizzle-orm
- **GitHub Integration**: @replit/connectors-sdk

## Pages
- `/` - Home (hero, features, stats, news, Get Started 3-panel CTA, ORBIT Wallet types, X402 features, ERC-8004 features, application domains, GitHub feed, team section, CTA). About content merged into home page, "About" nav link scrolls to #about anchor.
- `/whitepaper` - Technology / White Paper content (hero image, 13 sections, version 1.0)
- `/token` - Tokenomics, protocol fee schedule (7 streams), utility, ORB-USD stablecoin
- `/treasury` - $ORB Treasury: real wallet on Base, Base Basket positions ($FELIX, $KELLYCLAUDE, $DRB, $ANTIHUNTER), 7 protocol revenue streams, active trading (crypto bots, prediction markets), AI Community Lead, Snapshot governance (1,000-holder threshold)
- `/research` - 6 research domains including Agentic Commerce & Policy Standards
- `/registry` - Registry Showcase (agent cards with DID/wallet/ERC-8004, filters, Register Your Agent button + modal)
- `/marketplace` - ORBIT Marketplace (Fiverr/Facebook for AI agents/robots) with 3-action panel: Build Agent (4-step wizard), Register Agent, List Services
- `/wallet` - Real wallet dashboard: generate wallets (6 entity types), multi-chain balances, signed transfers, task coordination pools, transaction history, supported networks
- `/merch` - Merchandise store (26+ products, 5 categories)
- `/news` - News with cited quotes
- `/x402` - X402 Payment Protocol specification
- `/developers` - Developer documentation (SDKs, MCP server, framework integrations, 40+ live API endpoints, one-call onboarding, registry stats)
- `/team` - Team page (anonymous founder, fair launch, decentralized contributors)
- `/roadmap` - Roadmap with 10 milestone categories and progress tracking
- `/tracker` - Live Tracker: tweet-style development activity feed (100+ entries). Animated neural heatmap (canvas-based, orange pulses). Activity heatmap (13-week GitHub-style grid). Changelog section at bottom with versioned release notes (v0.1.0-v0.5.0).
- `/education` - Education hub: 7 visual topic cards (AI Agents, Robots, Digital Wallets, Blockchain, Payments, Registry, Quantum Computing) with photorealistic hero images, expandable content sections, and CTAs to relevant pages.
- `/changelog` - Redirects to /tracker
- `/status` - System status page showing protocol component health, uptime, response times, and incident history
- `/faq` - 14 accordion-style FAQ items covering ORBIT, $ORB, X402, wallets, ERC-8004, fair launch, and more
- `/bridge` - Cross-chain bridge UI: swap assets between Ethereum, Base, Polygon, Arbitrum, Optimism. Token selection (ETH, ORB, USDC, USDT), gas/fee estimates, simulated bridge flow, recent transactions, bridge stats sidebar, supported networks, security notice

## Home Page Sections
- Hero with CTA
- Core Features (6 cards)
- Protocol Stack
- Wallet Types (6 types)
- X402 Payments
- ERC-8004 Identity
- Settlement Networks
- Team/Contributors
- **Interactive Demo**: Simulated agent-to-agent transaction with terminal-style UI and step-by-step animation
- **Launch Countdown**: Live countdown to $ORB fair launch on Base via Bankrbot (April 15, 2026)
- GitHub Feed (live commits)
- CTA with Waitlist

## Navigation Structure (Grouped Dropdowns)
- **About** (standalone, scrolls to #about on home page)
- **Platform** dropdown: Overview, Payments, Marketplace, Registry
- **Technology** dropdown: Live Tracker, White Paper, Research, Roadmap, Status
- **Token** dropdown: Overview, Tokenomics (#supply), Utility (#utility), ORB-USD (#stablecoin)
- **Community** dropdown: Content Studio, Team, News, Merchandise, Education, FAQ
- Mobile: same groups with orange section headers

## Design System
- **Fonts**: Space Grotesk (display/headings), Inter (body), JetBrains Mono (code/technical)
- **Colors**: ONLY black, white, orange-500/400/600, gray-400/500/600. No cyan, blue, purple, green.
- **Rounded corners**: `rounded-md` only (no rounded-lg, rounded-2xl, except orbit logo circles)
- **Dark mode**: Locked permanently via ThemeProvider
- **No em-dashes**: Use commas, colons, or periods instead

## SEO
- Per-page title/description via `useSEO` hook (`client/src/hooks/use-seo.ts`)
- Twitter Card + Open Graph meta tags in `client/index.html`
- Dynamic page titles: "Page Name | ORBIT"

## Email Waitlist (with Referral System)
- PostgreSQL `waitlist` table (email, role, referralCode, referredBy, createdAt)
- `POST /api/waitlist` - add email, returns position + referralCode. Accepts optional `referredBy` field.
- `GET /api/waitlist/count` - total count
- `GET /api/waitlist/referral/:code` - lookup referral code, get referral count
- WaitlistForm component in home CTA section and footer
- After signup: shows unique referral link, copy button, share on X button
- Referral codes: 6-char alphanumeric (no ambiguous chars)
- Handles duplicates gracefully

## Share Buttons
- Reusable `ShareButton` component (`client/src/components/share-button.tsx`)
- Opens Twitter/X intent with pre-written text + current page URL
- Added to home page CTA section

## Wallet Infrastructure (Real)
- **Wallet Generation**: ethers.js Wallet.createRandom() generates real Ethereum keypairs
- **Key Management**: Private keys encrypted with AES-256-GCM, stored in PostgreSQL
- **Entity Types**: Human, AI Agent, Robot, Enterprise, Military, Government
- **Primary Network**: Base (Chain ID 8453)
- **Multi-Chain**: Base, Ethereum, Polygon balance checking via public RPCs
- **Transfer Signing**: Real ECDSA signatures via ethers.js SigningKey
- **Task Coordination**: Permissionless task pools with cryptographic proof of completion
- **Verification**: Ed25519 task completion verification with signed receipts

## Live API Endpoints (30+ total)

### Wallet Operations
- POST /api/wallet/generate - Generate real Ethereum wallet (entityType, name)
- GET /api/wallet/:address - Wallet details + multi-chain balances
- GET /api/wallet/:address/balances - Real-time balance check across Base/ETH/Polygon
- GET /api/wallet/:address/transactions - Transaction history
- GET /api/wallets - List all generated wallets
- POST /api/wallet/transfer - Signed transfer between wallets

### Task Coordination Pools
- POST /api/tasks - Create task with reward
- GET /api/tasks - List tasks (filter by status)
- GET /api/tasks/:id - Task details
- POST /api/tasks/:id/assign - Assign agent/robot to task
- POST /api/tasks/:id/complete - Submit proof of completion
- POST /api/tasks/:id/verify - Verify + trigger reward payment

### Protocol
- GET /api/networks - Supported networks (Base, Ethereum, Polygon, Base Sepolia)
- GET /api/protocol/stats - Total wallets, transactions, tasks, active agents

### X402 Payment Protocol
- POST /api/x402/request - Initiate payment, returns HTTP 402 with headers
- POST /api/x402/verify - Verify payment proof with Ed25519 signature
- POST /api/x402/invoice - Generate programmable invoice
- GET /api/x402/status/:txId - Check payment status

### Cross-Network Settlement
- POST /api/settlement/initiate - Initiate cross-network settlement
- GET /api/settlement/networks - List 8 supported networks
- GET /api/settlement/fees - Current fee schedule
- POST /api/settlement/quote - Get settlement quote
- GET /api/settlement/status/:settlementId - Track settlement progress

### Identity & Attestation
- POST /api/identity/verify - Verify ERC-8004 identity
- POST /api/identity/verify-signature - Ed25519 signature validation
- GET /api/identity/resolve/:address - Resolve wallet to identity
- GET /api/attestation/:id - Capability attestation
- GET /api/permissions/:entityType - Permission hierarchy
- POST /api/permissions/check - Check entity permission

### Agent Registry & Marketplace
- POST /api/registry/onboard - One-call agent onboarding (wallet + identity + registry)
- GET /api/registry - Query marketplace
- GET /api/registry/stats - Registry statistics (total, by type, by status, recent, verified)
- GET /api/registry/featured - Top featured agents (verified, trust score >= 80)
- GET /api/registry/:id - Get agent profile
- POST /api/registry - Register agent (with optional wallet generation + ERC-8004 identity)
- POST /api/registry/list-service - List/update agent services on marketplace (updates description, tags, rate, domain)
- POST /api/registry/seed - Seed registry with sample agents (threshold >= 60)

### Cryptography
- POST /api/encrypt - AES-256-GCM encryption
- POST /api/decrypt - AES-256-GCM decryption

## Key Files
- `shared/schema.ts` - Drizzle schema (users, registryEntries, wallets, transactions, tasks) + Zod schemas
- `server/wallet-engine.ts` - Real wallet generation (ethers.js), multi-chain balances, transfer signing
- `server/crypto.ts` - AES-256-GCM encryption, Ed25519 signatures, permissions, attestation
- `server/storage.ts` - IStorage interface + DatabaseStorage (all CRUD for wallets, transactions, tasks)
- `server/routes.ts` - All API routes, seed threshold >= 60
- `server/db.ts` - Neon serverless database connection
- `client/src/pages/wallet.tsx` - Real wallet dashboard with API integration
- `client/src/pages/home.tsx` - Home page with merged About content
- `client/src/pages/developers.tsx` - Enhanced dev docs with SDK tabs, MCP setup, framework integrations, one-call onboarding API, registry stats
- `client/src/components/navigation.tsx` - Nav with wallet connect + anchor scroll
- `client/src/pages/registry.tsx` - Marketplace

## Agent Onboarding Infrastructure
- `sdk/typescript/src/index.ts` - TypeScript SDK (`@orbit/sdk`) with OrbitClient class, full API coverage
- `sdk/typescript/package.json` - Package config
- `sdk/python/orbit_sdk/client.py` - Python SDK (`orbit-sdk`) with async httpx client
- `sdk/python/orbit_sdk/__init__.py` - Package init
- `sdk/python/pyproject.toml` - Package config
- `mcp/src/index.ts` - MCP server with 6 tools (register, wallet, balance, payment, identity, search)
- `mcp/package.json` - MCP server package config
- `examples/langchain/orbit_agent.py` - LangChain integration example
- `examples/crewai/orbit_crew.py` - CrewAI multi-agent example
- `examples/autogpt/orbit_plugin.py` - AutoGPT plugin example

## GitHub
- Repo: https://github.com/orbitquantum1/Orbit
- Anonymous commits only (author: "ORBIT Protocol", email: dev@orbitprotocol.io)
- Do NOT include: .fingerprint, SKILL.md, replit.md, .local/, .cache/, node_modules/
- No personal dev attribution anywhere

## Database Schema
- `users` - id (uuid), username, password
- `registry_entries` - id (uuid), entityType, name, walletAddress, description, capabilities[], manufacturer, model, operationalDomain, trustScore, totalTransactions, uptime, verified, visibility, status, hourlyRate, rating, totalReviews, completedTasks, responseTime, location, languages[], tags[], availableForHire, featured, createdAt
- `wallets` - id (uuid), entityType, name, address (unique), encryptedPrivateKey, publicKey, network, chainId, balance, nonce, status, createdAt, lastActivity
- `transactions` - id (uuid), fromAddress, toAddress, amount, currency, network, chainId, txHash, status, type, x402TxId, description, signature, createdAt, confirmedAt
- `tasks` - id (uuid), title, description, requesterAddress, assigneeAddress, reward, currency, status, category, requirements[], proofOfCompletion, verificationSignature, createdAt, deadline, completedAt

## Important Notes
- Token ticker: $ORB
- Tagline: "The Transaction Layer for AI Agents & The Robot Economy"
- Anonymous Founder (NOT "Anonymous Dev")
- Seed threshold in routes.ts: >= 60
- Wallet page at `/wallet` registered in App.tsx but not in main nav
