import { type User, type InsertUser, type RegistryEntry, type InsertRegistryEntry, type Wallet, type InsertWallet, type Transaction, type InsertTransaction, type Task, type InsertTask, type IdentityDocument, type InsertIdentityDocument, type CapabilityToken, type InsertCapabilityToken, type Waitlist, type InsertWaitlist, type TreasuryPosition, type InsertTreasuryPosition, type TreasuryRevenue, type InsertTreasuryRevenue, type Webhook, type InsertWebhook, users, registryEntries, wallets, transactions, tasks, identityDocuments, capabilityTokens, waitlist, treasuryPositions, treasuryRevenue, webhooks } from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getRegistryEntries(): Promise<RegistryEntry[]>;
  getRegistryEntry(id: string): Promise<RegistryEntry | undefined>;
  getRegistryEntryByWallet(walletAddress: string): Promise<RegistryEntry | undefined>;
  createRegistryEntry(entry: InsertRegistryEntry): Promise<RegistryEntry>;
  seedRegistryEntry(entry: Partial<RegistryEntry> & InsertRegistryEntry): Promise<RegistryEntry>;
  updateRegistryEntry(id: string, updates: Partial<RegistryEntry>): Promise<RegistryEntry>;
  createWallet(data: InsertWallet): Promise<Wallet>;
  getWallet(id: string): Promise<Wallet | undefined>;
  getWalletByAddress(address: string): Promise<Wallet | undefined>;
  getWalletsByEntity(entityType: string): Promise<Wallet[]>;
  listWallets(): Promise<Wallet[]>;
  updateWalletActivity(id: string): Promise<void>;
  createTransaction(data: InsertTransaction): Promise<Transaction>;
  getTransaction(id: string): Promise<Transaction | undefined>;
  getTransactionsByWallet(address: string): Promise<Transaction[]>;
  updateTransactionStatus(id: string, status: string, txHash?: string): Promise<void>;
  createTask(data: InsertTask): Promise<Task>;
  getTask(id: string): Promise<Task | undefined>;
  getTasks(status?: string): Promise<Task[]>;
  assignTask(id: string, assigneeAddress: string): Promise<Task | undefined>;
  completeTask(id: string, proof: string, signature: string): Promise<Task | undefined>;
  verifyTask(id: string, verificationSig: string): Promise<Task | undefined>;
  getProtocolStats(): Promise<{ totalWallets: number; totalTransactions: number; totalTasks: number; activeAgents: number }>;
  createIdentityDocument(data: InsertIdentityDocument): Promise<IdentityDocument>;
  getIdentityDocument(id: string): Promise<IdentityDocument | undefined>;
  getIdentityDocumentByAddress(walletAddress: string): Promise<IdentityDocument | undefined>;
  getIdentityDocumentByDid(did: string): Promise<IdentityDocument | undefined>;
  updateIdentityDocumentStatus(id: string, status: string): Promise<void>;
  createCapabilityToken(data: InsertCapabilityToken): Promise<CapabilityToken>;
  getCapabilityToken(id: string): Promise<CapabilityToken | undefined>;
  getCapabilityTokensByAddress(walletAddress: string): Promise<CapabilityToken[]>;
  revokeCapabilityToken(id: string): Promise<void>;
  addToWaitlist(data: InsertWaitlist): Promise<Waitlist>;
  getWaitlistCount(): Promise<number>;
  getWaitlistByReferralCode(code: string): Promise<Waitlist | undefined>;
  getReferralCount(code: string): Promise<number>;
  createTreasuryPosition(data: InsertTreasuryPosition): Promise<TreasuryPosition>;
  getTreasuryPositions(): Promise<TreasuryPosition[]>;
  updateTreasuryPosition(id: string, updates: Partial<TreasuryPosition>): Promise<TreasuryPosition>;
  recordTreasuryRevenue(data: InsertTreasuryRevenue): Promise<TreasuryRevenue>;
  getTreasuryRevenue(): Promise<TreasuryRevenue[]>;
  getTreasuryWallet(): Promise<Wallet | undefined>;
  createWebhook(data: InsertWebhook): Promise<Webhook>;
  getWebhooksByAddress(walletAddress: string): Promise<Webhook[]>;
  deleteWebhook(id: string): Promise<void>;
  updateWebhookActive(id: string, active: boolean): Promise<Webhook>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getRegistryEntries(): Promise<RegistryEntry[]> {
    return db.select().from(registryEntries).orderBy(desc(registryEntries.createdAt));
  }

  async getRegistryEntry(id: string): Promise<RegistryEntry | undefined> {
    const [entry] = await db.select().from(registryEntries).where(eq(registryEntries.id, id));
    return entry;
  }

  async getRegistryEntryByWallet(walletAddress: string): Promise<RegistryEntry | undefined> {
    const [entry] = await db.select().from(registryEntries).where(eq(registryEntries.walletAddress, walletAddress));
    return entry;
  }

  async createRegistryEntry(entry: InsertRegistryEntry): Promise<RegistryEntry> {
    const [created] = await db.insert(registryEntries).values(entry).returning();
    return created;
  }

  async seedRegistryEntry(entry: Partial<RegistryEntry> & InsertRegistryEntry): Promise<RegistryEntry> {
    const [created] = await db.insert(registryEntries).values(entry as any).returning();
    return created;
  }

  async updateRegistryEntry(id: string, updates: Partial<RegistryEntry>): Promise<RegistryEntry> {
    const [updated] = await db.update(registryEntries).set(updates as any).where(eq(registryEntries.id, id)).returning();
    return updated;
  }

  async createWallet(data: InsertWallet): Promise<Wallet> {
    const [wallet] = await db.insert(wallets).values(data).returning();
    return wallet;
  }

  async getWallet(id: string): Promise<Wallet | undefined> {
    const [wallet] = await db.select().from(wallets).where(eq(wallets.id, id));
    return wallet;
  }

  async getWalletByAddress(address: string): Promise<Wallet | undefined> {
    const [wallet] = await db.select().from(wallets).where(eq(wallets.address, address));
    return wallet;
  }

  async getWalletsByEntity(entityType: string): Promise<Wallet[]> {
    return db.select().from(wallets).where(eq(wallets.entityType, entityType)).orderBy(desc(wallets.createdAt));
  }

  async listWallets(): Promise<Wallet[]> {
    return db.select().from(wallets).orderBy(desc(wallets.createdAt));
  }

  async updateWalletActivity(id: string): Promise<void> {
    await db.update(wallets).set({ lastActivity: new Date() }).where(eq(wallets.id, id));
  }

  async incrementWalletNonce(id: string): Promise<void> {
    await db.update(wallets).set({ nonce: sql`${wallets.nonce} + 1`, lastActivity: new Date() }).where(eq(wallets.id, id));
  }

  async createTransaction(data: InsertTransaction): Promise<Transaction> {
    const [tx] = await db.insert(transactions).values(data).returning();
    return tx;
  }

  async getTransaction(id: string): Promise<Transaction | undefined> {
    const [tx] = await db.select().from(transactions).where(eq(transactions.id, id));
    return tx;
  }

  async getTransactionsByWallet(address: string): Promise<Transaction[]> {
    return db.select().from(transactions)
      .where(sql`${transactions.fromAddress} = ${address} OR ${transactions.toAddress} = ${address}`)
      .orderBy(desc(transactions.createdAt));
  }

  async updateTransactionStatus(id: string, status: string, txHash?: string): Promise<void> {
    const updates: any = { status };
    if (txHash) updates.txHash = txHash;
    if (status === "confirmed") updates.confirmedAt = new Date();
    await db.update(transactions).set(updates).where(eq(transactions.id, id));
  }

  async createTask(data: InsertTask): Promise<Task> {
    const [task] = await db.insert(tasks).values(data).returning();
    return task;
  }

  async getTask(id: string): Promise<Task | undefined> {
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id));
    return task;
  }

  async getTasks(status?: string): Promise<Task[]> {
    if (status) {
      return db.select().from(tasks).where(eq(tasks.status, status)).orderBy(desc(tasks.createdAt));
    }
    return db.select().from(tasks).orderBy(desc(tasks.createdAt));
  }

  async assignTask(id: string, assigneeAddress: string): Promise<Task | undefined> {
    const [task] = await db.update(tasks).set({ assigneeAddress, status: "assigned" }).where(eq(tasks.id, id)).returning();
    return task;
  }

  async completeTask(id: string, proof: string, signature: string): Promise<Task | undefined> {
    const [task] = await db.update(tasks).set({
      proofOfCompletion: proof,
      verificationSignature: signature,
      status: "completed",
      completedAt: new Date(),
    }).where(eq(tasks.id, id)).returning();
    return task;
  }

  async verifyTask(id: string, verificationSig: string): Promise<Task | undefined> {
    const [task] = await db.update(tasks).set({
      verificationSignature: verificationSig,
      status: "verified",
    }).where(eq(tasks.id, id)).returning();
    return task;
  }

  async getProtocolStats(): Promise<{ totalWallets: number; totalTransactions: number; totalTasks: number; activeAgents: number }> {
    const [walletCount] = await db.select({ count: sql<number>`count(*)` }).from(wallets);
    const [txCount] = await db.select({ count: sql<number>`count(*)` }).from(transactions);
    const [taskCount] = await db.select({ count: sql<number>`count(*)` }).from(tasks);
    const [agentCount] = await db.select({ count: sql<number>`count(*)` }).from(wallets).where(sql`${wallets.entityType} IN ('AI Agent', 'Robot') AND ${wallets.status} = 'active'`);
    return {
      totalWallets: Number(walletCount.count),
      totalTransactions: Number(txCount.count),
      totalTasks: Number(taskCount.count),
      activeAgents: Number(agentCount.count),
    };
  }

  async createIdentityDocument(data: InsertIdentityDocument): Promise<IdentityDocument> {
    const [doc] = await db.insert(identityDocuments).values(data).returning();
    return doc;
  }

  async getIdentityDocument(id: string): Promise<IdentityDocument | undefined> {
    const [doc] = await db.select().from(identityDocuments).where(eq(identityDocuments.id, id));
    return doc;
  }

  async getIdentityDocumentByAddress(walletAddress: string): Promise<IdentityDocument | undefined> {
    const [doc] = await db.select().from(identityDocuments)
      .where(eq(identityDocuments.walletAddress, walletAddress))
      .orderBy(desc(identityDocuments.issuedAt));
    return doc;
  }

  async getIdentityDocumentByDid(did: string): Promise<IdentityDocument | undefined> {
    const [doc] = await db.select().from(identityDocuments).where(eq(identityDocuments.did, did));
    return doc;
  }

  async updateIdentityDocumentStatus(id: string, status: string): Promise<void> {
    const updates: any = { status };
    if (status === "revoked") updates.revokedAt = new Date();
    await db.update(identityDocuments).set(updates).where(eq(identityDocuments.id, id));
  }

  async createCapabilityToken(data: InsertCapabilityToken): Promise<CapabilityToken> {
    const [token] = await db.insert(capabilityTokens).values(data).returning();
    return token;
  }

  async getCapabilityToken(id: string): Promise<CapabilityToken | undefined> {
    const [token] = await db.select().from(capabilityTokens).where(eq(capabilityTokens.id, id));
    return token;
  }

  async getCapabilityTokensByAddress(walletAddress: string): Promise<CapabilityToken[]> {
    return db.select().from(capabilityTokens)
      .where(eq(capabilityTokens.walletAddress, walletAddress))
      .orderBy(desc(capabilityTokens.issuedAt));
  }

  async revokeCapabilityToken(id: string): Promise<void> {
    await db.update(capabilityTokens).set({ status: "revoked", revokedAt: new Date() }).where(eq(capabilityTokens.id, id));
  }

  async addToWaitlist(data: InsertWaitlist): Promise<Waitlist> {
    for (let attempt = 0; attempt < 5; attempt++) {
      const code = Array.from({ length: 6 }, () => "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[Math.floor(Math.random() * 31)]).join("");
      try {
        const [entry] = await db.insert(waitlist).values({ ...data, referralCode: code }).returning();
        return entry;
      } catch (err: any) {
        if (err.code === "23505" && err.constraint?.includes("referral_code") && attempt < 4) continue;
        throw err;
      }
    }
    throw new Error("Failed to generate unique referral code");
  }

  async getWaitlistCount(): Promise<number> {
    const [result] = await db.select({ count: sql<number>`count(*)` }).from(waitlist);
    return Number(result.count);
  }

  async getWaitlistByReferralCode(code: string): Promise<Waitlist | undefined> {
    const [entry] = await db.select().from(waitlist).where(eq(waitlist.referralCode, code));
    return entry;
  }

  async getReferralCount(code: string): Promise<number> {
    const [result] = await db.select({ count: sql<number>`count(*)` }).from(waitlist).where(eq(waitlist.referredBy, code));
    return Number(result.count);
  }

  async createTreasuryPosition(data: InsertTreasuryPosition): Promise<TreasuryPosition> {
    const [position] = await db.insert(treasuryPositions).values(data).returning();
    return position;
  }

  async getTreasuryPositions(): Promise<TreasuryPosition[]> {
    return db.select().from(treasuryPositions).orderBy(desc(treasuryPositions.acquiredAt));
  }

  async updateTreasuryPosition(id: string, updates: Partial<TreasuryPosition>): Promise<TreasuryPosition> {
    const [position] = await db.update(treasuryPositions).set(updates).where(eq(treasuryPositions.id, id)).returning();
    return position;
  }

  async recordTreasuryRevenue(data: InsertTreasuryRevenue): Promise<TreasuryRevenue> {
    const [revenue] = await db.insert(treasuryRevenue).values(data).returning();
    return revenue;
  }

  async getTreasuryRevenue(): Promise<TreasuryRevenue[]> {
    return db.select().from(treasuryRevenue).orderBy(desc(treasuryRevenue.recordedAt));
  }

  async getTreasuryWallet(): Promise<Wallet | undefined> {
    const [wallet] = await db.select().from(wallets).where(eq(wallets.name, "ORBIT Protocol Treasury"));
    return wallet;
  }

  async createWebhook(data: InsertWebhook): Promise<Webhook> {
    const [webhook] = await db.insert(webhooks).values(data).returning();
    return webhook;
  }

  async getWebhooksByAddress(walletAddress: string): Promise<Webhook[]> {
    return db.select().from(webhooks).where(eq(webhooks.walletAddress, walletAddress)).orderBy(desc(webhooks.createdAt));
  }

  async deleteWebhook(id: string): Promise<void> {
    await db.delete(webhooks).where(eq(webhooks.id, id));
  }

  async updateWebhookActive(id: string, active: boolean): Promise<Webhook> {
    const [webhook] = await db.update(webhooks).set({ active }).where(eq(webhooks.id, id)).returning();
    return webhook;
  }
}

export const storage = new DatabaseStorage();
