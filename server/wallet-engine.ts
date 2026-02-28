import { ethers } from "ethers";
import { encrypt, decrypt, signData, verifySignature } from "./crypto";

const NETWORKS: Record<string, { name: string; rpcUrl: string; chainId: number; explorer: string; symbol: string; status: string }> = {
  base: {
    name: "Base",
    rpcUrl: "https://mainnet.base.org",
    chainId: 8453,
    explorer: "https://basescan.org",
    symbol: "ETH",
    status: "active",
  },
  "base-sepolia": {
    name: "Base Sepolia",
    rpcUrl: "https://sepolia.base.org",
    chainId: 84532,
    explorer: "https://sepolia.basescan.org",
    symbol: "ETH",
    status: "active",
  },
  ethereum: {
    name: "Ethereum",
    rpcUrl: "https://eth.llamarpc.com",
    chainId: 1,
    explorer: "https://etherscan.io",
    symbol: "ETH",
    status: "active",
  },
  polygon: {
    name: "Polygon",
    rpcUrl: "https://polygon-rpc.com",
    chainId: 137,
    explorer: "https://polygonscan.com",
    symbol: "MATIC",
    status: "active",
  },
};

export function generateWallet(entityType: string, name: string): {
  address: string;
  publicKey: string;
  encryptedPrivateKey: string;
  network: string;
  chainId: number;
} {
  const wallet = ethers.Wallet.createRandom();
  const encryptedPrivateKey = encrypt(wallet.privateKey);

  return {
    address: wallet.address,
    publicKey: wallet.publicKey,
    encryptedPrivateKey,
    network: "base",
    chainId: 8453,
  };
}

export async function getWalletBalance(address: string, network: string = "base"): Promise<{
  balance: string;
  balanceFormatted: string;
  network: string;
  chainId: number;
  symbol: string;
}> {
  const net = NETWORKS[network];
  if (!net) {
    return { balance: "0", balanceFormatted: "0.0000", network, chainId: 0, symbol: "ETH" };
  }

  try {
    const provider = new ethers.JsonRpcProvider(net.rpcUrl);
    const balance = await provider.getBalance(address);
    return {
      balance: balance.toString(),
      balanceFormatted: ethers.formatEther(balance),
      network: net.name,
      chainId: net.chainId,
      symbol: net.symbol,
    };
  } catch {
    return {
      balance: "0",
      balanceFormatted: "0.0000",
      network: net.name,
      chainId: net.chainId,
      symbol: net.symbol,
    };
  }
}

export async function getMultiChainBalances(address: string): Promise<Array<{
  balance: string;
  balanceFormatted: string;
  network: string;
  chainId: number;
  symbol: string;
}>> {
  const networks = ["base", "ethereum", "polygon"];
  const results = await Promise.allSettled(
    networks.map((net) => getWalletBalance(address, net))
  );

  return results.map((result, i) => {
    if (result.status === "fulfilled") return result.value;
    const net = NETWORKS[networks[i]];
    return {
      balance: "0",
      balanceFormatted: "0.0000",
      network: net?.name || networks[i],
      chainId: net?.chainId || 0,
      symbol: net?.symbol || "ETH",
    };
  });
}

export function signMessage(encryptedPrivateKey: string, message: string): {
  signature: string;
  address: string;
} {
  const privateKey = decrypt(encryptedPrivateKey);
  const wallet = new ethers.Wallet(privateKey);
  const messageHash = ethers.hashMessage(message);
  const signingKey = new ethers.SigningKey(privateKey);
  const sig = signingKey.sign(messageHash);

  return {
    signature: ethers.Signature.from(sig).serialized,
    address: wallet.address,
  };
}

export function createTransferSignature(
  encryptedPrivateKey: string,
  from: string,
  to: string,
  amount: string,
  currency: string,
  nonce: number
): string {
  const payload = JSON.stringify({ from, to, amount, currency, nonce, timestamp: Date.now() });
  const privateKey = decrypt(encryptedPrivateKey);
  const wallet = new ethers.Wallet(privateKey);
  const messageHash = ethers.hashMessage(payload);
  const signingKey = new ethers.SigningKey(privateKey);
  const sig = signingKey.sign(messageHash);
  return ethers.Signature.from(sig).serialized;
}

export function verifyTaskCompletion(
  taskId: string,
  walletAddress: string,
  proof: string
): { valid: boolean; signature: string; timestamp: number } {
  const timestamp = Date.now();
  const payload = JSON.stringify({ taskId, walletAddress, proof, timestamp });
  const signature = signData(payload);
  const valid = verifySignature(payload, signature);
  return { valid, signature, timestamp };
}

export function getSupportedNetworks() {
  return Object.entries(NETWORKS).map(([key, net]) => ({
    id: key,
    ...net,
  }));
}

export function recoverAddress(encryptedPrivateKey: string): string {
  const privateKey = decrypt(encryptedPrivateKey);
  const wallet = new ethers.Wallet(privateKey);
  return wallet.address;
}

const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function name() view returns (string)",
];

const BASE_ERC20_TOKENS: Record<string, { address: string; symbol: string; decimals: number }> = {
  USDC: { address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", symbol: "USDC", decimals: 6 },
  DAI: { address: "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb", symbol: "DAI", decimals: 18 },
  WETH: { address: "0x4200000000000000000000000000000000000006", symbol: "WETH", decimals: 18 },
};

export async function broadcastTransaction(
  encryptedPrivateKey: string,
  to: string,
  value: string,
  data?: string,
  gasLimit?: string
): Promise<{
  txHash: string;
  from: string;
  to: string;
  value: string;
  network: string;
  explorer: string;
}> {
  const net = NETWORKS["base"];
  const provider = new ethers.JsonRpcProvider(net.rpcUrl);
  const privateKey = decrypt(encryptedPrivateKey);
  const wallet = new ethers.Wallet(privateKey, provider);

  const tx: ethers.TransactionRequest = {
    to,
    value: ethers.parseEther(value),
    chainId: net.chainId,
  };

  if (data) tx.data = data;
  if (gasLimit) tx.gasLimit = BigInt(gasLimit);

  const sentTx = await wallet.sendTransaction(tx);

  return {
    txHash: sentTx.hash,
    from: wallet.address,
    to,
    value,
    network: net.name,
    explorer: `${net.explorer}/tx/${sentTx.hash}`,
  };
}

export async function resolveENS(ensName: string): Promise<{
  name: string;
  address: string | null;
  resolved: boolean;
}> {
  const provider = new ethers.JsonRpcProvider(NETWORKS["ethereum"].rpcUrl);
  try {
    const address = await provider.resolveName(ensName);
    return {
      name: ensName,
      address,
      resolved: address !== null,
    };
  } catch {
    return { name: ensName, address: null, resolved: false };
  }
}

export async function getERC20Balances(address: string): Promise<Array<{
  token: string;
  symbol: string;
  contractAddress: string;
  balance: string;
  balanceFormatted: string;
  decimals: number;
}>> {
  const net = NETWORKS["base"];
  const provider = new ethers.JsonRpcProvider(net.rpcUrl);

  const results = await Promise.allSettled(
    Object.entries(BASE_ERC20_TOKENS).map(async ([key, token]) => {
      const contract = new ethers.Contract(token.address, ERC20_ABI, provider);
      const balance: bigint = await contract.balanceOf(address);
      return {
        token: key,
        symbol: token.symbol,
        contractAddress: token.address,
        balance: balance.toString(),
        balanceFormatted: ethers.formatUnits(balance, token.decimals),
        decimals: token.decimals,
      };
    })
  );

  return results.map((result, i) => {
    if (result.status === "fulfilled") return result.value;
    const entries = Object.entries(BASE_ERC20_TOKENS);
    const [key, token] = entries[i];
    return {
      token: key,
      symbol: token.symbol,
      contractAddress: token.address,
      balance: "0",
      balanceFormatted: "0.0",
      decimals: token.decimals,
    };
  });
}

export async function estimateGas(
  from: string,
  to: string,
  value: string,
  data?: string
): Promise<{
  gasEstimate: string;
  gasEstimateFormatted: string;
  gasPriceWei: string;
  gasPriceGwei: string;
  estimatedCostWei: string;
  estimatedCostEth: string;
}> {
  const net = NETWORKS["base"];
  const provider = new ethers.JsonRpcProvider(net.rpcUrl);

  const tx: ethers.TransactionRequest = {
    from,
    to,
    value: ethers.parseEther(value),
  };
  if (data) tx.data = data;

  const [gasEstimate, feeData] = await Promise.all([
    provider.estimateGas(tx),
    provider.getFeeData(),
  ]);

  const gasPrice = feeData.gasPrice || BigInt(0);
  const estimatedCost = gasEstimate * gasPrice;

  return {
    gasEstimate: gasEstimate.toString(),
    gasEstimateFormatted: gasEstimate.toString(),
    gasPriceWei: gasPrice.toString(),
    gasPriceGwei: ethers.formatUnits(gasPrice, "gwei"),
    estimatedCostWei: estimatedCost.toString(),
    estimatedCostEth: ethers.formatEther(estimatedCost),
  };
}

export async function getChainStatus(network: string = "base"): Promise<{
  network: string;
  chainId: number;
  blockNumber: number;
  gasPriceWei: string;
  gasPriceGwei: string;
  maxFeePerGas: string | null;
  maxPriorityFeePerGas: string | null;
  status: string;
}> {
  const net = NETWORKS[network];
  if (!net) {
    throw new Error(`Unsupported network: ${network}`);
  }

  const provider = new ethers.JsonRpcProvider(net.rpcUrl);
  const [blockNumber, feeData] = await Promise.all([
    provider.getBlockNumber(),
    provider.getFeeData(),
  ]);

  const gasPrice = feeData.gasPrice || BigInt(0);

  return {
    network: net.name,
    chainId: net.chainId,
    blockNumber,
    gasPriceWei: gasPrice.toString(),
    gasPriceGwei: ethers.formatUnits(gasPrice, "gwei"),
    maxFeePerGas: feeData.maxFeePerGas ? ethers.formatUnits(feeData.maxFeePerGas, "gwei") : null,
    maxPriorityFeePerGas: feeData.maxPriorityFeePerGas ? ethers.formatUnits(feeData.maxPriorityFeePerGas, "gwei") : null,
    status: "active",
  };
}

export async function getGasPrice(network: string = "base"): Promise<{
  network: string;
  gasPriceWei: string;
  gasPriceGwei: string;
  maxFeePerGas: string | null;
  maxPriorityFeePerGas: string | null;
}> {
  const net = NETWORKS[network];
  if (!net) {
    throw new Error(`Unsupported network: ${network}`);
  }

  const provider = new ethers.JsonRpcProvider(net.rpcUrl);
  const feeData = await provider.getFeeData();
  const gasPrice = feeData.gasPrice || BigInt(0);

  return {
    network: net.name,
    gasPriceWei: gasPrice.toString(),
    gasPriceGwei: ethers.formatUnits(gasPrice, "gwei"),
    maxFeePerGas: feeData.maxFeePerGas ? ethers.formatUnits(feeData.maxFeePerGas, "gwei") : null,
    maxPriorityFeePerGas: feeData.maxPriorityFeePerGas ? ethers.formatUnits(feeData.maxPriorityFeePerGas, "gwei") : null,
  };
}

export function signMessageWithKey(encryptedPrivateKey: string, message: string): {
  message: string;
  signature: string;
  address: string;
} {
  const privateKey = decrypt(encryptedPrivateKey);
  const wallet = new ethers.Wallet(privateKey);
  const messageHash = ethers.hashMessage(message);
  const signingKey = new ethers.SigningKey(privateKey);
  const sig = signingKey.sign(messageHash);

  return {
    message,
    signature: ethers.Signature.from(sig).serialized,
    address: wallet.address,
  };
}

export function verifyMessageSignature(message: string, signature: string, expectedAddress: string): {
  valid: boolean;
  recoveredAddress: string;
  expectedAddress: string;
} {
  try {
    const recoveredAddress = ethers.verifyMessage(message, signature);
    return {
      valid: recoveredAddress.toLowerCase() === expectedAddress.toLowerCase(),
      recoveredAddress,
      expectedAddress,
    };
  } catch {
    return {
      valid: false,
      recoveredAddress: "",
      expectedAddress,
    };
  }
}
