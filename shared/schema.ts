import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const registryEntries = pgTable("registry_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  entityType: text("entity_type").notNull(),
  name: text("name").notNull(),
  walletAddress: text("wallet_address").notNull(),
  description: text("description"),
  capabilities: text("capabilities").array(),
  manufacturer: text("manufacturer"),
  model: text("model"),
  operationalDomain: text("operational_domain"),
  trustScore: integer("trust_score").default(0),
  totalTransactions: integer("total_transactions").default(0),
  uptime: integer("uptime").default(100),
  verified: boolean("verified").default(false),
  visibility: text("visibility").default("public"),
  status: text("status").default("available"),
  hourlyRate: real("hourly_rate"),
  rating: real("rating").default(0),
  totalReviews: integer("total_reviews").default(0),
  completedTasks: integer("completed_tasks").default(0),
  responseTime: text("response_time"),
  location: text("location"),
  languages: text("languages").array(),
  tags: text("tags").array(),
  availableForHire: boolean("available_for_hire").default(true),
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const wallets = pgTable("wallets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  entityType: text("entity_type").notNull(),
  name: text("name").notNull(),
  address: text("address").notNull().unique(),
  encryptedPrivateKey: text("encrypted_private_key").notNull(),
  publicKey: text("public_key").notNull(),
  network: text("network").default("base").notNull(),
  chainId: integer("chain_id").default(8453).notNull(),
  balance: text("balance").default("0"),
  nonce: integer("nonce").default(0),
  status: text("status").default("active").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  lastActivity: timestamp("last_activity").defaultNow(),
});

export const transactions = pgTable("transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fromAddress: text("from_address").notNull(),
  toAddress: text("to_address").notNull(),
  amount: text("amount").notNull(),
  currency: text("currency").default("ORB").notNull(),
  network: text("network").notNull(),
  chainId: integer("chain_id"),
  txHash: text("tx_hash"),
  status: text("status").default("pending").notNull(),
  type: text("type").notNull(),
  x402TxId: text("x402_tx_id"),
  description: text("description"),
  signature: text("signature"),
  createdAt: timestamp("created_at").defaultNow(),
  confirmedAt: timestamp("confirmed_at"),
});

export const tasks = pgTable("tasks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  requesterAddress: text("requester_address").notNull(),
  assigneeAddress: text("assignee_address"),
  reward: text("reward").notNull(),
  currency: text("currency").default("ORB").notNull(),
  status: text("status").default("open").notNull(),
  category: text("category").notNull(),
  requirements: text("requirements").array(),
  proofOfCompletion: text("proof_of_completion"),
  verificationSignature: text("verification_signature"),
  createdAt: timestamp("created_at").defaultNow(),
  deadline: timestamp("deadline"),
  completedAt: timestamp("completed_at"),
});

export const identityDocuments = pgTable("identity_documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  walletAddress: text("wallet_address").notNull(),
  did: text("did").notNull().unique(),
  entityType: text("entity_type").notNull(),
  document: text("document").notNull(),
  signature: text("signature").notNull(),
  publicKey: text("public_key").notNull(),
  issuedAt: timestamp("issued_at").defaultNow(),
  expiresAt: timestamp("expires_at"),
  status: text("status").default("active").notNull(),
  revokedAt: timestamp("revoked_at"),
});

export const capabilityTokens = pgTable("capability_tokens", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  identityDocumentId: text("identity_document_id").notNull(),
  walletAddress: text("wallet_address").notNull(),
  capability: text("capability").notNull(),
  permissions: text("permissions").array(),
  token: text("token").notNull(),
  signature: text("signature").notNull(),
  issuedAt: timestamp("issued_at").defaultNow(),
  expiresAt: timestamp("expires_at"),
  status: text("status").default("active").notNull(),
  revokedAt: timestamp("revoked_at"),
});

export const waitlist = pgTable("waitlist", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  role: text("role").default("builder"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertWaitlistSchema = createInsertSchema(waitlist).omit({
  id: true,
  createdAt: true,
});

export type InsertWaitlist = z.infer<typeof insertWaitlistSchema>;
export type Waitlist = typeof waitlist.$inferSelect;

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertRegistrySchema = createInsertSchema(registryEntries).omit({
  id: true,
  trustScore: true,
  totalTransactions: true,
  uptime: true,
  verified: true,
  rating: true,
  totalReviews: true,
  completedTasks: true,
  featured: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertRegistryEntry = z.infer<typeof insertRegistrySchema>;
export type RegistryEntry = typeof registryEntries.$inferSelect;

export const insertWalletSchema = createInsertSchema(wallets).omit({
  id: true,
  balance: true,
  nonce: true,
  createdAt: true,
  lastActivity: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  txHash: true,
  status: true,
  confirmedAt: true,
  createdAt: true,
});

export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
  assigneeAddress: true,
  status: true,
  proofOfCompletion: true,
  verificationSignature: true,
  createdAt: true,
  completedAt: true,
});

export type InsertWallet = z.infer<typeof insertWalletSchema>;
export type Wallet = typeof wallets.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = typeof tasks.$inferSelect;

export const insertIdentityDocumentSchema = createInsertSchema(identityDocuments).omit({
  id: true,
  issuedAt: true,
  revokedAt: true,
});

export const insertCapabilityTokenSchema = createInsertSchema(capabilityTokens).omit({
  id: true,
  issuedAt: true,
  revokedAt: true,
});

export type InsertIdentityDocument = z.infer<typeof insertIdentityDocumentSchema>;
export type IdentityDocument = typeof identityDocuments.$inferSelect;
export type InsertCapabilityToken = z.infer<typeof insertCapabilityTokenSchema>;
export type CapabilityToken = typeof capabilityTokens.$inferSelect;
