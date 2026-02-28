import crypto from "crypto";
import { signData, verifySignature } from "./crypto";
import { storage } from "./storage";
import type { IdentityDocument, CapabilityToken } from "@shared/schema";

const ED25519_KEY_PAIR = crypto.generateKeyPairSync("ed25519", {
  privateKeyEncoding: { type: "pkcs8", format: "der" },
  publicKeyEncoding: { type: "spki", format: "der" },
});

function ed25519Sign(data: string): string {
  const privateKey = crypto.createPrivateKey({
    key: ED25519_KEY_PAIR.privateKey,
    format: "der",
    type: "pkcs8",
  });
  return crypto.sign(null, Buffer.from(data), privateKey).toString("base64");
}

function ed25519Verify(data: string, signature: string, publicKeyBase64: string): boolean {
  try {
    const publicKeyDer = Buffer.from(publicKeyBase64, "base64");
    const publicKey = crypto.createPublicKey({
      key: publicKeyDer,
      format: "der",
      type: "spki",
    });
    return crypto.verify(null, Buffer.from(data), publicKey, Buffer.from(signature, "base64"));
  } catch {
    return false;
  }
}

export function createDID(walletAddress: string): string {
  return `did:orbit:${walletAddress.toLowerCase()}`;
}

export function getPublicKey(): string {
  return ED25519_KEY_PAIR.publicKey.toString("base64");
}

export interface ERC8004Document {
  "@context": string[];
  id: string;
  type: string[];
  issuer: string;
  issuanceDate: string;
  expirationDate: string;
  credentialSubject: {
    id: string;
    walletAddress: string;
    entityType: string;
    capabilities: string[];
    permissions: {
      level: number;
      maxSpendPerTx: number;
      canDeployAgents: boolean;
      canAccessClassified: boolean;
      canGovern: boolean;
      dataAccess: string[];
    };
  };
  proof: {
    type: string;
    created: string;
    verificationMethod: string;
    proofPurpose: string;
    signature: string;
    publicKey: string;
  };
}

export async function generateIdentityDocument(
  walletAddress: string,
  entityType: string,
  capabilities: string[] = [],
  expiresInMs: number = 365 * 24 * 60 * 60 * 1000
): Promise<{ document: ERC8004Document; record: IdentityDocument }> {
  const did = createDID(walletAddress);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + expiresInMs);
  const publicKey = getPublicKey();

  const { PERMISSION_HIERARCHIES } = await import("./crypto");
  const permissions = PERMISSION_HIERARCHIES[entityType] || PERMISSION_HIERARCHIES["Human"];

  const documentBody: Omit<ERC8004Document, "proof"> = {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      "https://orbitprotocol.io/erc-8004/v1"
    ],
    id: did,
    type: ["VerifiableCredential", "ERC8004IdentityDocument"],
    issuer: "did:orbit:protocol",
    issuanceDate: now.toISOString(),
    expirationDate: expiresAt.toISOString(),
    credentialSubject: {
      id: did,
      walletAddress,
      entityType,
      capabilities,
      permissions,
    },
  };

  const dataToSign = JSON.stringify(documentBody);
  const signature = ed25519Sign(dataToSign);

  const fullDocument: ERC8004Document = {
    ...documentBody,
    proof: {
      type: "Ed25519Signature2020",
      created: now.toISOString(),
      verificationMethod: `${did}#key-1`,
      proofPurpose: "assertionMethod",
      signature,
      publicKey,
    },
  };

  const record = await storage.createIdentityDocument({
    walletAddress,
    did,
    entityType,
    document: JSON.stringify(fullDocument),
    signature,
    publicKey,
    expiresAt,
    status: "active",
  });

  return { document: fullDocument, record };
}

export async function verifyIdentityDocument(documentJson: string): Promise<{
  valid: boolean;
  did?: string;
  entityType?: string;
  error?: string;
}> {
  try {
    const doc: ERC8004Document = JSON.parse(documentJson);

    if (!doc.proof || !doc.proof.signature || !doc.proof.publicKey) {
      return { valid: false, error: "Missing proof section" };
    }

    const expDate = new Date(doc.expirationDate);
    if (expDate < new Date()) {
      return { valid: false, error: "Document has expired", did: doc.id, entityType: doc.credentialSubject?.entityType };
    }

    const { proof, ...bodyWithoutProof } = doc;
    const dataToVerify = JSON.stringify(bodyWithoutProof);
    const isValid = ed25519Verify(dataToVerify, proof.signature, proof.publicKey);

    if (!isValid) {
      return { valid: false, error: "Invalid signature", did: doc.id };
    }

    return {
      valid: true,
      did: doc.id,
      entityType: doc.credentialSubject?.entityType,
    };
  } catch (err: any) {
    return { valid: false, error: `Parse error: ${err.message}` };
  }
}

export async function issueCapabilityToken(
  walletAddress: string,
  capability: string,
  permissions: string[] = [],
  expiresInMs: number = 24 * 60 * 60 * 1000
): Promise<CapabilityToken> {
  const identityDoc = await storage.getIdentityDocumentByAddress(walletAddress);
  if (!identityDoc) {
    throw new Error("No identity document found for this wallet address");
  }

  if (identityDoc.status !== "active") {
    throw new Error("Identity document is not active");
  }

  const now = new Date();
  const expiresAt = new Date(now.getTime() + expiresInMs);

  const tokenPayload = {
    identityDocumentId: identityDoc.id,
    walletAddress,
    did: identityDoc.did,
    capability,
    permissions,
    issuedAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
    nonce: crypto.randomBytes(16).toString("hex"),
  };

  const tokenString = JSON.stringify(tokenPayload);
  const signature = ed25519Sign(tokenString);

  const record = await storage.createCapabilityToken({
    identityDocumentId: identityDoc.id,
    walletAddress,
    capability,
    permissions,
    token: tokenString,
    signature,
    expiresAt,
    status: "active",
  });

  return record;
}

export async function revokeCapabilityToken(tokenId: string): Promise<void> {
  const token = await storage.getCapabilityToken(tokenId);
  if (!token) {
    throw new Error("Capability token not found");
  }
  if (token.status === "revoked") {
    throw new Error("Capability token is already revoked");
  }
  await storage.revokeCapabilityToken(tokenId);
}

export async function getIdentityByAddress(walletAddress: string): Promise<IdentityDocument | undefined> {
  return storage.getIdentityDocumentByAddress(walletAddress);
}

export async function resolveDID(walletAddress: string): Promise<string | null> {
  const doc = await storage.getIdentityDocumentByAddress(walletAddress);
  return doc ? doc.did : null;
}
