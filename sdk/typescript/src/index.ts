export interface OrbitConfig {
  baseUrl: string;
  apiKey?: string;
  timeout?: number;
}

export interface RegistryEntry {
  id: string;
  entityType: string;
  name: string;
  walletAddress: string;
  description: string | null;
  capabilities: string[] | null;
  manufacturer: string | null;
  model: string | null;
  operationalDomain: string | null;
  trustScore: number | null;
  totalTransactions: number | null;
  uptime: number | null;
  verified: boolean | null;
  visibility: string | null;
  status: string | null;
  hourlyRate: number | null;
  rating: number | null;
  totalReviews: number | null;
  completedTasks: number | null;
  responseTime: string | null;
  location: string | null;
  languages: string[] | null;
  tags: string[] | null;
  availableForHire: boolean | null;
  featured: boolean | null;
  createdAt: string | null;
}

export interface RegisterAgentParams {
  entityType: string;
  name: string;
  walletAddress: string;
  description?: string;
  capabilities?: string[];
  manufacturer?: string;
  model?: string;
  operationalDomain?: string;
  visibility?: string;
  status?: string;
  hourlyRate?: number;
  responseTime?: string;
  location?: string;
  languages?: string[];
  tags?: string[];
  availableForHire?: boolean;
}

export interface Wallet {
  id: string;
  entityType: string;
  name: string;
  address: string;
  publicKey: string;
  network: string;
  chainId: number;
  balance: string | null;
  nonce: number | null;
  status: string;
  createdAt: string | null;
  lastActivity: string | null;
}

export interface GenerateWalletParams {
  entityType: string;
  name: string;
  network?: string;
  chainId?: number;
}

export interface IdentityDocument {
  id: string;
  walletAddress: string;
  did: string;
  entityType: string;
  document: string;
  signature: string;
  publicKey: string;
  issuedAt: string | null;
  expiresAt: string | null;
  status: string;
  revokedAt: string | null;
}

export interface MintIdentityParams {
  walletAddress: string;
  entityType: string;
  capabilities?: string[];
  name?: string;
}

export interface PaymentParams {
  fromAddress: string;
  toAddress: string;
  amount: string;
  currency?: string;
  network?: string;
  chainId?: number;
  type?: string;
  description?: string;
}

export interface Transaction {
  id: string;
  fromAddress: string;
  toAddress: string;
  amount: string;
  currency: string;
  network: string;
  chainId: number | null;
  txHash: string | null;
  status: string;
  type: string;
  x402TxId: string | null;
  description: string | null;
  signature: string | null;
  createdAt: string | null;
  confirmedAt: string | null;
}

export interface SearchAgentsParams {
  query?: string;
  entityType?: string;
  capabilities?: string[];
  domain?: string;
  verified?: boolean;
  availableForHire?: boolean;
  minTrustScore?: number;
  tags?: string[];
  limit?: number;
  offset?: number;
}

export interface BalanceResult {
  address: string;
  balance: string;
  network: string;
  chainId: number;
}

export interface SignMessageParams {
  walletAddress: string;
  message: string;
}

export interface SignMessageResult {
  signature: string;
  message: string;
  address: string;
}

export interface OnboardParams {
  name: string;
  entityType: string;
  description?: string;
  capabilities?: string[];
  manufacturer?: string;
  model?: string;
  operationalDomain?: string;
  network?: string;
}

export interface OnboardResult {
  wallet: Wallet;
  identity: IdentityDocument;
  registry: RegistryEntry;
}

export interface RegistryStats {
  total: number;
  byType: Record<string, number>;
  recent: number;
}

export interface FeaturedAgent {
  id: string;
  name: string;
  entityType: string;
  description: string | null;
  trustScore: number | null;
  rating: number | null;
  walletAddress: string;
}

export class OrbitError extends Error {
  public status: number;
  public body: unknown;

  constructor(message: string, status: number, body?: unknown) {
    super(message);
    this.name = "OrbitError";
    this.status = status;
    this.body = body;
  }
}

export class OrbitClient {
  private baseUrl: string;
  private apiKey?: string;
  private timeout: number;

  constructor(config: OrbitConfig) {
    this.baseUrl = config.baseUrl.replace(/\/+$/, "");
    this.apiKey = config.apiKey;
    this.timeout = config.timeout ?? 30_000;
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
    query?: Record<string, string | number | boolean | undefined>,
  ): Promise<T> {
    let url = `${this.baseUrl}${path}`;

    if (query) {
      const params = new URLSearchParams();
      for (const [k, v] of Object.entries(query)) {
        if (v !== undefined) params.append(k, String(v));
      }
      const qs = params.toString();
      if (qs) url += `?${qs}`;
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (this.apiKey) {
      headers["Authorization"] = `Bearer ${this.apiKey}`;
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeout);

    try {
      const res = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new OrbitError(
          (data as any)?.message ?? `HTTP ${res.status}`,
          res.status,
          data,
        );
      }

      return data as T;
    } finally {
      clearTimeout(timer);
    }
  }

  async registerAgent(params: RegisterAgentParams): Promise<RegistryEntry> {
    return this.request<RegistryEntry>("POST", "/api/registry", params);
  }

  async generateWallet(params: GenerateWalletParams): Promise<Wallet> {
    return this.request<Wallet>("POST", "/api/wallet/generate", params);
  }

  async mintIdentity(params: MintIdentityParams): Promise<IdentityDocument> {
    return this.request<IdentityDocument>("POST", "/api/identity/issue", params);
  }

  async pay(params: PaymentParams): Promise<Transaction> {
    return this.request<Transaction>("POST", "/api/wallet/transfer", params);
  }

  async searchAgents(params?: SearchAgentsParams): Promise<RegistryEntry[]> {
    const query: Record<string, string | number | boolean | undefined> = {};
    if (params) {
      if (params.query) query.search = params.query;
      if (params.entityType) query.type = params.entityType;
      if (params.domain) query.domain = params.domain;
      if (params.verified !== undefined) query.verified = params.verified;
      if (params.availableForHire !== undefined) query.available = params.availableForHire;
      if (params.minTrustScore !== undefined) query.minTrust = params.minTrustScore;
      if (params.limit !== undefined) query.limit = params.limit;
      if (params.offset !== undefined) query.offset = params.offset;
    }
    return this.request<RegistryEntry[]>("GET", "/api/registry", undefined, query);
  }

  async getAgent(id: string): Promise<RegistryEntry> {
    return this.request<RegistryEntry>("GET", `/api/registry/${encodeURIComponent(id)}`);
  }

  async getBalance(address: string): Promise<BalanceResult> {
    return this.request<BalanceResult>(
      "GET",
      `/api/wallet/${encodeURIComponent(address)}/balances`,
    );
  }

  async getWallet(address: string): Promise<Wallet> {
    return this.request<Wallet>(
      "GET",
      `/api/wallet/${encodeURIComponent(address)}`,
    );
  }

  async signMessage(params: SignMessageParams): Promise<SignMessageResult> {
    return this.request<SignMessageResult>(
      "POST",
      "/api/wallet/sign-message",
      { walletAddress: params.walletAddress, message: params.message },
    );
  }

  async onboard(params: OnboardParams): Promise<OnboardResult> {
    return this.request<OnboardResult>("POST", "/api/registry/onboard", params);
  }

  async getRegistryStats(): Promise<RegistryStats> {
    return this.request<RegistryStats>("GET", "/api/registry/stats");
  }

  async getFeaturedAgents(): Promise<FeaturedAgent[]> {
    return this.request<FeaturedAgent[]>("GET", "/api/registry/featured");
  }

  async getTransactions(address: string): Promise<Transaction[]> {
    return this.request<Transaction[]>(
      "GET",
      `/api/wallet/${encodeURIComponent(address)}/transactions`,
    );
  }

  async getIdentity(address: string): Promise<IdentityDocument> {
    return this.request<IdentityDocument>(
      "GET",
      `/api/identity/${encodeURIComponent(address)}/document`,
    );
  }

  async verifyIdentity(walletAddress: string, entityType: string, capabilities?: string[]): Promise<{ verified: boolean; identity: unknown }> {
    return this.request<{ verified: boolean; identity: unknown }>(
      "POST",
      "/api/identity/verify",
      { walletAddress, entityType, capabilities },
    );
  }
}

export default OrbitClient;
