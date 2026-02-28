import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const TAG_LENGTH = 16;
const KEY = crypto.scryptSync(process.env.SESSION_SECRET || "orbit-protocol-default-key", "orbit-salt", 32);

export function encrypt(plaintext: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString("base64");
}

export function decrypt(ciphertext: string): string {
  const buf = Buffer.from(ciphertext, "base64");
  const iv = buf.subarray(0, IV_LENGTH);
  const tag = buf.subarray(IV_LENGTH, IV_LENGTH + TAG_LENGTH);
  const encrypted = buf.subarray(IV_LENGTH + TAG_LENGTH);
  const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf8");
}

const SIGN_KEY_PAIR = (() => {
  const seed = crypto.createHash("sha256").update(KEY).digest().subarray(0, 32);
  return crypto.generateKeyPairSync("ed25519", {
    privateKeyEncoding: { type: "pkcs8", format: "der" },
    publicKeyEncoding: { type: "spki", format: "der" },
  });
})();

export function signData(data: string): string {
  const privateKey = crypto.createPrivateKey({
    key: SIGN_KEY_PAIR.privateKey,
    format: "der",
    type: "pkcs8",
  });
  const signature = crypto.sign(null, Buffer.from(data), privateKey);
  return signature.toString("base64");
}

export function verifySignature(data: string, signature: string): boolean {
  const publicKey = crypto.createPublicKey({
    key: SIGN_KEY_PAIR.publicKey,
    format: "der",
    type: "spki",
  });
  return crypto.verify(null, Buffer.from(data), publicKey, Buffer.from(signature, "base64"));
}

export function generateIdentityProof(walletAddress: string, entityType: string, capabilities: string[]): {
  proof: string;
  signature: string;
  publicKey: string;
  timestamp: number;
} {
  const timestamp = Date.now();
  const payload = JSON.stringify({ walletAddress, entityType, capabilities, timestamp });
  const signature = signData(payload);
  const publicKey = SIGN_KEY_PAIR.publicKey.toString("base64");
  return { proof: payload, signature, publicKey, timestamp };
}

export function generateCapabilityAttestation(agentId: string, name: string, capabilities: string[]): {
  attestation: string;
  signature: string;
  issuedAt: number;
  expiresAt: number;
} {
  const issuedAt = Date.now();
  const expiresAt = issuedAt + 86400000;
  const attestation = JSON.stringify({ agentId, name, capabilities, issuedAt, expiresAt, issuer: "orbit-protocol" });
  const signature = signData(attestation);
  return { attestation, signature, issuedAt, expiresAt };
}

export const PERMISSION_HIERARCHIES: Record<string, {
  level: number;
  maxSpendPerTx: number;
  canDeployAgents: boolean;
  canAccessClassified: boolean;
  canGovern: boolean;
  dataAccess: string[];
}> = {
  "Human": { level: 1, maxSpendPerTx: 1000, canDeployAgents: false, canAccessClassified: false, canGovern: true, dataAccess: ["public"] },
  "AI Agent": { level: 2, maxSpendPerTx: 500, canDeployAgents: false, canAccessClassified: false, canGovern: false, dataAccess: ["public", "agent-network"] },
  "Robot": { level: 2, maxSpendPerTx: 2000, canDeployAgents: false, canAccessClassified: false, canGovern: false, dataAccess: ["public", "agent-network", "industrial"] },
  "Enterprise": { level: 3, maxSpendPerTx: 100000, canDeployAgents: true, canAccessClassified: false, canGovern: true, dataAccess: ["public", "agent-network", "enterprise"] },
  "Military": { level: 4, maxSpendPerTx: 1000000, canDeployAgents: true, canAccessClassified: true, canGovern: false, dataAccess: ["public", "agent-network", "enterprise", "classified"] },
  "Government": { level: 5, maxSpendPerTx: 10000000, canDeployAgents: true, canAccessClassified: true, canGovern: true, dataAccess: ["public", "agent-network", "enterprise", "classified", "sovereign"] },
};

export function getPermissions(entityType: string) {
  return PERMISSION_HIERARCHIES[entityType] || PERMISSION_HIERARCHIES["Human"];
}

export function checkPermission(entityType: string, requiredLevel: number): boolean {
  const perms = getPermissions(entityType);
  return perms.level >= requiredLevel;
}
