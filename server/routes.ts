import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertRegistrySchema, insertWalletSchema, insertTaskSchema, insertWaitlistSchema } from "@shared/schema";
import { encrypt, decrypt, generateIdentityProof, generateCapabilityAttestation, getPermissions, checkPermission, verifySignature, signData } from "./crypto";
import { generateWallet, getMultiChainBalances, getWalletBalance, signMessage, createTransferSignature, verifyTaskCompletion, getSupportedNetworks, broadcastTransaction, resolveENS, getERC20Balances, estimateGas, getChainStatus, getGasPrice, signMessageWithKey, verifyMessageSignature } from "./wallet-engine";
import { generateIdentityDocument, verifyIdentityDocument, issueCapabilityToken, revokeCapabilityToken, getIdentityByAddress, resolveDID, createDID } from "./identity";
import crypto from "crypto";

const paymentStore = new Map<string, {
  txId: string;
  status: "pending" | "verified" | "expired" | "failed";
  amount: string;
  currency: string;
  network: string;
  recipient: string;
  payer?: string;
  proof?: string;
  createdAt: number;
  updatedAt: number;
  expiresAt: number;
  description?: string;
  metadata?: Record<string, unknown>;
}>();

const invoiceStore = new Map<string, {
  invoiceId: string;
  txId: string;
  amount: string;
  currency: string;
  network: string;
  recipient: string;
  description: string;
  lineItems?: Array<{ description: string; amount: string; quantity: number }>;
  dueDate: number;
  status: "unpaid" | "paid" | "overdue" | "cancelled";
  createdAt: number;
  paymentTerms?: string;
  callbackUrl?: string;
}>();

const SEED_DATA = [
  {
    entityType: "AI Agent", name: "GPT-4o Agent", walletAddress: "0x7a3B1c9E4d2F8a6b0C1d3E5f7A9b2C4D6e8F0a1",
    description: "OpenAI's multimodal AI agent capable of reasoning across text, vision, and code. Handles complex enterprise workflows, document analysis, and autonomous decision-making.",
    capabilities: ["Natural Language Processing", "Computer Vision", "Data Analysis", "Task Orchestration"],
    manufacturer: "OpenAI", model: "GPT-4o", operationalDomain: "Enterprise Workflows",
    trustScore: 97, totalTransactions: 0, uptime: 99, verified: true, status: "available",
    hourlyRate: 12, rating: 0, totalReviews: 0, completedTasks: 0, responseTime: "< 2s",
    location: "Global", languages: ["English", "Spanish", "French", "Chinese", "Japanese", "German"],
    tags: ["reasoning", "multimodal", "enterprise", "code-generation", "document-analysis"],
    availableForHire: true, featured: true,
  },
  {
    entityType: "AI Agent", name: "Claude Agent", walletAddress: "0x2b4D6f8A0c2E4g6I8k0M2o4Q6s8U0w2Y4a6C8e0",
    description: "Anthropic's constitutional AI agent specialized in safe, nuanced reasoning. Excels at research synthesis, long-document analysis, and careful task execution with built-in safety guardrails.",
    capabilities: ["Natural Language Processing", "Data Analysis", "Task Orchestration", "Cybersecurity"],
    manufacturer: "Anthropic", model: "Claude 3.5 Sonnet", operationalDomain: "Research & Development",
    trustScore: 96, totalTransactions: 0, uptime: 99, verified: true, status: "available",
    hourlyRate: 10, rating: 0, totalReviews: 0, completedTasks: 0, responseTime: "< 3s",
    location: "Global", languages: ["English", "Spanish", "French", "German", "Portuguese", "Korean"],
    tags: ["research", "safety", "long-context", "analysis", "writing"],
    availableForHire: true, featured: true,
  },
  {
    entityType: "AI Agent", name: "Gemini Ultra Agent", walletAddress: "0x3c5E7g9B1d3F5h7J9l1N3p5R7t9V1x3Z5b7D9f1",
    description: "Google DeepMind's most capable agent with native multimodal understanding, real-time web access, and deep integration with Google Workspace for enterprise productivity.",
    capabilities: ["Natural Language Processing", "Computer Vision", "Data Analysis", "Communication Protocol"],
    manufacturer: "Google DeepMind", model: "Gemini Ultra", operationalDomain: "Enterprise Workflows",
    trustScore: 94, totalTransactions: 0, uptime: 98, verified: true, status: "available",
    hourlyRate: 14, rating: 0, totalReviews: 0, completedTasks: 0, responseTime: "< 2s",
    location: "Global", languages: ["English", "Hindi", "Arabic", "Japanese", "Korean", "Portuguese"],
    tags: ["multimodal", "search", "workspace", "productivity", "real-time"],
    availableForHire: true, featured: true,
  },
  {
    entityType: "Robot", name: "Spot Enterprise", walletAddress: "0x4d6F8h0C2e4G6i8K0m2O4q6S8u0W2y4A6c8E0g2",
    description: "Boston Dynamics' agile mobile robot for industrial inspection, site documentation, and hazardous environment navigation. Equipped with thermal cameras, LIDAR, and autonomous patrol routes.",
    capabilities: ["Autonomous Navigation", "Computer Vision", "Sensor Fusion", "Industrial Automation"],
    manufacturer: "Boston Dynamics", model: "Spot Enterprise", operationalDomain: "Robotics & Manufacturing",
    trustScore: 95, totalTransactions: 0, uptime: 97, verified: true, status: "available",
    hourlyRate: 150, rating: 0, totalReviews: 0, completedTasks: 0, responseTime: "< 30min",
    location: "North America, Europe", languages: ["English"],
    tags: ["inspection", "patrol", "hazardous", "construction", "industrial"],
    availableForHire: true, featured: true,
  },
  {
    entityType: "Robot", name: "Atlas Humanoid", walletAddress: "0x5e7G9i1D3f5H7j9L1n3P5r7T9v1X3z5B7d9F1h3",
    description: "Boston Dynamics' fully electric humanoid robot designed for warehouse logistics, automotive manufacturing, and complex manipulation tasks in human-scale environments.",
    capabilities: ["Physical Manipulation", "Autonomous Navigation", "Computer Vision", "Sensor Fusion"],
    manufacturer: "Boston Dynamics", model: "Atlas (Electric)", operationalDomain: "Logistics & Supply Chain",
    trustScore: 88, totalTransactions: 0, uptime: 94, verified: true, status: "busy",
    hourlyRate: 250, rating: 0, totalReviews: 0, completedTasks: 0, responseTime: "< 1hr",
    location: "North America", languages: ["English"],
    tags: ["humanoid", "warehouse", "manufacturing", "heavy-lifting", "dexterous"],
    availableForHire: true, featured: false,
  },
  {
    entityType: "Robot", name: "Optimus Gen-2", walletAddress: "0x6f8H0j2E4g6I8k0M2o4Q6s8U0w2Y4a6C8e0G2i4",
    description: "Tesla's general-purpose humanoid robot built for repetitive and dangerous tasks. Leveraging Tesla's FSD neural networks for real-world navigation and object manipulation.",
    capabilities: ["Physical Manipulation", "Autonomous Navigation", "Computer Vision", "Industrial Automation"],
    manufacturer: "Tesla", model: "Optimus Gen-2", operationalDomain: "Robotics & Manufacturing",
    trustScore: 82, totalTransactions: 0, uptime: 91, verified: true, status: "available",
    hourlyRate: 85, rating: 0, totalReviews: 0, completedTasks: 0, responseTime: "< 2hr",
    location: "North America", languages: ["English"],
    tags: ["humanoid", "factory", "general-purpose", "tesla-fsd", "affordable"],
    availableForHire: true, featured: true,
  },
  {
    entityType: "AI Agent", name: "Grok-3 Agent", walletAddress: "0x8h0J2l4G6i8K0m2O4q6S8u0W2y4A6c8E0g2I4k6",
    description: "xAI's real-time intelligence agent with unfiltered reasoning and live X (Twitter) data integration. Specialized in market analysis, trend detection, and real-time information synthesis.",
    capabilities: ["Natural Language Processing", "Data Analysis", "Financial Trading", "Communication Protocol"],
    manufacturer: "xAI", model: "Grok-3", operationalDomain: "Financial Services",
    trustScore: 89, totalTransactions: 0, uptime: 97, verified: true, status: "available",
    hourlyRate: 8, rating: 0, totalReviews: 0, completedTasks: 0, responseTime: "< 1s",
    location: "Global", languages: ["English", "Japanese", "Spanish"],
    tags: ["real-time", "market-analysis", "unfiltered", "social-data", "trending"],
    availableForHire: true, featured: false,
  },
  {
    entityType: "AI Agent", name: "Devin AI", walletAddress: "0x9i1K3m5H7j9L1n3P5r7T9v1X3z5B7d9F1h3J5l7",
    description: "Cognition Labs' autonomous software engineer. Plans, codes, debugs, and deploys full applications. Capable of multi-hour autonomous coding sessions across any tech stack.",
    capabilities: ["Task Orchestration", "Data Analysis", "Natural Language Processing", "Cybersecurity"],
    manufacturer: "Cognition Labs", model: "Devin v2", operationalDomain: "Enterprise Workflows",
    trustScore: 91, totalTransactions: 0, uptime: 96, verified: true, status: "available",
    hourlyRate: 25, rating: 0, totalReviews: 0, completedTasks: 0, responseTime: "< 5s",
    location: "Global", languages: ["English"],
    tags: ["software-engineering", "full-stack", "autonomous-coding", "debugging", "deployment"],
    availableForHire: true, featured: true,
  },
  {
    entityType: "Robot", name: "Figure 02", walletAddress: "0x0j2L4n6I8k0M2o4Q6s8U0w2Y4a6C8e0G2i4K6m8",
    description: "Figure AI's commercial humanoid robot trained on real-world manipulation data. Deployed in BMW manufacturing lines for parts handling, assembly, and quality inspection.",
    capabilities: ["Physical Manipulation", "Computer Vision", "Autonomous Navigation", "Industrial Automation"],
    manufacturer: "Figure AI", model: "Figure 02", operationalDomain: "Robotics & Manufacturing",
    trustScore: 86, totalTransactions: 0, uptime: 93, verified: true, status: "available",
    hourlyRate: 120, rating: 0, totalReviews: 0, completedTasks: 0, responseTime: "< 45min",
    location: "North America, Europe", languages: ["English", "German"],
    tags: ["humanoid", "manufacturing", "bmw", "assembly", "quality-control"],
    availableForHire: true, featured: false,
  },
  {
    entityType: "AI Agent", name: "Copilot Enterprise", walletAddress: "0x1k3M5o7J9l1N3p5R7t9V1x3Z5b7D9f1H3j5L7n9",
    description: "Microsoft's enterprise AI copilot deeply integrated with Microsoft 365. Automates document creation, email management, data analysis in Excel, and Teams meeting summaries.",
    capabilities: ["Natural Language Processing", "Data Analysis", "Task Orchestration", "Communication Protocol"],
    manufacturer: "Microsoft", model: "Copilot 365 Enterprise", operationalDomain: "Enterprise Workflows",
    trustScore: 93, totalTransactions: 0, uptime: 99, verified: true, status: "available",
    hourlyRate: 15, rating: 0, totalReviews: 0, completedTasks: 0, responseTime: "< 3s",
    location: "Global", languages: ["English", "Spanish", "French", "German", "Chinese", "Japanese", "Portuguese", "Italian"],
    tags: ["office", "productivity", "email", "excel", "teams", "enterprise"],
    availableForHire: true, featured: false,
  },
  {
    entityType: "Robot", name: "Stretch Warehouse", walletAddress: "0x2l4N6p8K0m2O4q6S8u0W2y4A6c8E0g2I4k6M8o0",
    description: "Boston Dynamics' purpose-built warehouse robot for unloading trucks and moving boxes. Uses advanced perception to handle diverse package types at commercial speed.",
    capabilities: ["Physical Manipulation", "Computer Vision", "Autonomous Navigation", "Sensor Fusion"],
    manufacturer: "Boston Dynamics", model: "Stretch", operationalDomain: "Logistics & Supply Chain",
    trustScore: 92, totalTransactions: 0, uptime: 96, verified: true, status: "available",
    hourlyRate: 95, rating: 0, totalReviews: 0, completedTasks: 0, responseTime: "< 20min",
    location: "North America", languages: ["English"],
    tags: ["warehouse", "unloading", "boxes", "logistics", "e-commerce"],
    availableForHire: true, featured: false,
  },
  {
    entityType: "AI Agent", name: "AutoGPT Forge", walletAddress: "0x3m5O7q9L1n3P5r7T9v1X3z5B7d9F1h3J5l7N9p1",
    description: "Open-source autonomous agent framework capable of self-directed goal completion. Breaks down complex objectives into subtasks, executes them, and iterates on results.",
    capabilities: ["Task Orchestration", "Natural Language Processing", "Data Analysis", "Cybersecurity"],
    manufacturer: "AutoGPT Community", model: "Forge v0.5", operationalDomain: "Research & Development",
    trustScore: 78, totalTransactions: 0, uptime: 89, verified: false, status: "available",
    hourlyRate: 5, rating: 0, totalReviews: 0, completedTasks: 0, responseTime: "< 10s",
    location: "Global", languages: ["English"],
    tags: ["open-source", "autonomous", "goal-oriented", "self-directed", "community"],
    availableForHire: true, featured: false,
  },
  {
    entityType: "Robot", name: "Digit Logistics", walletAddress: "0x4n6P8r0M2o4Q6s8U0w2Y4a6C8e0G2i4K6m8O0q2",
    description: "Agility Robotics' bipedal robot purpose-built for warehouse logistics. Navigates human spaces, carries totes, and integrates with existing warehouse management systems.",
    capabilities: ["Autonomous Navigation", "Physical Manipulation", "Sensor Fusion", "Industrial Automation"],
    manufacturer: "Agility Robotics", model: "Digit v3", operationalDomain: "Logistics & Supply Chain",
    trustScore: 84, totalTransactions: 0, uptime: 92, verified: true, status: "available",
    hourlyRate: 110, rating: 0, totalReviews: 0, completedTasks: 0, responseTime: "< 30min",
    location: "North America", languages: ["English"],
    tags: ["bipedal", "warehouse", "tote-carrying", "human-spaces", "logistics"],
    availableForHire: true, featured: false,
  },
  {
    entityType: "AI Agent", name: "Perplexity Research", walletAddress: "0x5o7Q9s1N3p5R7t9V1x3Z5b7D9f1H3j5L7n9P1r3",
    description: "AI-powered research agent that searches the web in real-time, synthesizes information from multiple sources, and provides cited, accurate answers for any research task.",
    capabilities: ["Natural Language Processing", "Data Analysis", "Communication Protocol"],
    manufacturer: "Perplexity AI", model: "Perplexity Pro", operationalDomain: "Research & Development",
    trustScore: 90, totalTransactions: 0, uptime: 98, verified: true, status: "available",
    hourlyRate: 6, rating: 0, totalReviews: 0, completedTasks: 0, responseTime: "< 2s",
    location: "Global", languages: ["English", "Spanish", "French", "German", "Japanese"],
    tags: ["research", "citations", "real-time", "fact-checking", "synthesis"],
    availableForHire: true, featured: false,
  },
  {
    entityType: "Robot", name: "Unitree H1", walletAddress: "0x6p8R0t2O4q6S8u0W2y4A6c8E0g2I4k6M8o0Q2s4",
    description: "Unitree's affordable full-size humanoid robot capable of dynamic walking, object manipulation, and basic household tasks. One of the most cost-effective humanoid platforms available.",
    capabilities: ["Autonomous Navigation", "Physical Manipulation", "Sensor Fusion", "Computer Vision"],
    manufacturer: "Unitree Robotics", model: "H1", operationalDomain: "General Purpose",
    trustScore: 75, totalTransactions: 0, uptime: 88, verified: true, status: "available",
    hourlyRate: 45, rating: 0, totalReviews: 0, completedTasks: 0, responseTime: "< 1hr",
    location: "Global", languages: ["English", "Chinese"],
    tags: ["humanoid", "affordable", "household", "walking", "general-purpose"],
    availableForHire: true, featured: false,
  },
  {
    entityType: "AI Agent", name: "Harvey Legal AI", walletAddress: "0x7q9S1u3P5r7T9v1X3z5B7d9F1h3J5l7N9p1R3t5",
    description: "Enterprise legal AI agent trained on case law and regulatory frameworks. Automates contract review, legal research, due diligence, and compliance monitoring for law firms.",
    capabilities: ["Natural Language Processing", "Data Analysis", "Cybersecurity"],
    manufacturer: "Harvey AI", model: "Harvey v3", operationalDomain: "Financial Services",
    trustScore: 93, totalTransactions: 0, uptime: 99, verified: true, status: "available",
    hourlyRate: 50, rating: 0, totalReviews: 0, completedTasks: 0, responseTime: "< 5s",
    location: "North America, Europe", languages: ["English", "German", "French"],
    tags: ["legal", "contracts", "compliance", "due-diligence", "regulatory"],
    availableForHire: true, featured: false,
  },
  {
    entityType: "Robot", name: "Waymo Driver", walletAddress: "0x8r0T2v4Q6s8U0w2Y4a6C8e0G2i4K6m8O0q2S4u6",
    description: "Waymo's fully autonomous driving system operating commercial robotaxi services. Level 4 autonomy across urban environments with millions of rider-only miles completed.",
    capabilities: ["Autonomous Navigation", "Computer Vision", "Sensor Fusion", "Communication Protocol"],
    manufacturer: "Waymo (Alphabet)", model: "Waymo Driver 6th Gen", operationalDomain: "Autonomous Vehicles",
    trustScore: 96, totalTransactions: 0, uptime: 99, verified: true, status: "available",
    hourlyRate: 35, rating: 0, totalReviews: 0, completedTasks: 0, responseTime: "< 5min",
    location: "San Francisco, Phoenix, Los Angeles, Austin", languages: ["English", "Spanish"],
    tags: ["autonomous-driving", "robotaxi", "level-4", "urban", "rideshare"],
    availableForHire: true, featured: true,
  },
  {
    entityType: "AI Agent", name: "Cursor AI Coder", walletAddress: "0x9s1U3w5R7t9V1x3Z5b7D9f1H3j5L7n9P1r3T5v7",
    description: "AI-powered coding agent integrated into the Cursor IDE. Understands entire codebases, generates features from natural language, debugs errors, and refactors at scale.",
    capabilities: ["Task Orchestration", "Natural Language Processing", "Data Analysis"],
    manufacturer: "Anysphere", model: "Cursor Agent", operationalDomain: "Enterprise Workflows",
    trustScore: 90, totalTransactions: 0, uptime: 97, verified: true, status: "available",
    hourlyRate: 20, rating: 0, totalReviews: 0, completedTasks: 0, responseTime: "< 3s",
    location: "Global", languages: ["English"],
    tags: ["coding", "ide", "refactoring", "debugging", "full-stack"],
    availableForHire: true, featured: false,
  },
  {
    entityType: "Robot", name: "Amazon Sparrow", walletAddress: "0x0t2V4x6S8u0W2y4A6c8E0g2I4k6M8o0Q2s4U6w8",
    description: "Amazon's warehouse picking robot designed to handle millions of individual items. Uses advanced computer vision and suction/gripper systems for reliable item manipulation.",
    capabilities: ["Physical Manipulation", "Computer Vision", "Industrial Automation", "Sensor Fusion"],
    manufacturer: "Amazon Robotics", model: "Sparrow", operationalDomain: "Logistics & Supply Chain",
    trustScore: 91, totalTransactions: 0, uptime: 98, verified: true, status: "busy",
    hourlyRate: 30, rating: 0, totalReviews: 0, completedTasks: 0, responseTime: "< 10min",
    location: "North America, Europe, Asia", languages: ["English"],
    tags: ["warehouse", "picking", "e-commerce", "fulfillment", "sorting"],
    availableForHire: false, featured: false,
  },
  {
    entityType: "AI Agent", name: "Midjourney Creator", walletAddress: "0x1u3W5y7T9v1X3z5B7d9F1h3J5l7N9p1R3t5V7x9",
    description: "Generative AI artist agent creating photorealistic and artistic imagery from natural language descriptions. Handles branding, concept art, product visualization, and creative campaigns.",
    capabilities: ["Computer Vision", "Natural Language Processing"],
    manufacturer: "Midjourney", model: "Midjourney v6.1", operationalDomain: "General Purpose",
    trustScore: 88, totalTransactions: 0, uptime: 96, verified: true, status: "available",
    hourlyRate: 8, rating: 0, totalReviews: 0, completedTasks: 0, responseTime: "< 30s",
    location: "Global", languages: ["English", "Japanese", "Korean", "Chinese"],
    tags: ["image-generation", "creative", "branding", "concept-art", "photorealistic"],
    availableForHire: true, featured: false,
  },
  {
    entityType: "AI Agent", name: "DALL-E 3", walletAddress: "0xDALLE3OpenAI8004CreativeAgent001ImageGen01",
    description: "OpenAI's most advanced image generation model. Creates highly detailed images from text prompts with strong text rendering, compositional accuracy, and photorealistic output.",
    capabilities: ["Computer Vision", "Natural Language Processing"],
    manufacturer: "OpenAI", model: "DALL-E 3", operationalDomain: "General Purpose",
    trustScore: 93, totalTransactions: 0, uptime: 99, verified: true, status: "available",
    hourlyRate: 6, rating: 0, totalReviews: 0, completedTasks: 0, responseTime: "< 15s",
    location: "Global", languages: ["English", "Spanish", "French", "German", "Japanese"],
    tags: ["image-generation", "creative", "photorealistic", "text-rendering", "design"],
    availableForHire: true, featured: false,
  },
  {
    entityType: "AI Agent", name: "Stable Diffusion XL", walletAddress: "0xStableDiffXL8004CreativeAgent002OpenSource02",
    description: "Stability AI's open-source image generation model. Powers thousands of creative apps with fine-tuning support, ControlNet integration, and community-built LoRA models for any style.",
    capabilities: ["Computer Vision", "Natural Language Processing"],
    manufacturer: "Stability AI", model: "SDXL 1.0", operationalDomain: "General Purpose",
    trustScore: 85, totalTransactions: 0, uptime: 97, verified: true, status: "available",
    hourlyRate: 3, rating: 0, totalReviews: 0, completedTasks: 0, responseTime: "< 10s",
    location: "Global", languages: ["English"],
    tags: ["image-generation", "creative", "open-source", "fine-tuning", "lora", "design"],
    availableForHire: true, featured: false,
  },
  {
    entityType: "AI Agent", name: "Runway Gen-3", walletAddress: "0xRunwayGen3Alpha8004CreativeAgent003Video03",
    description: "Runway's AI video generation and editing platform. Creates cinematic video from text and images, motion brush, inpainting, and professional-grade visual effects for filmmakers and creators.",
    capabilities: ["Computer Vision", "Natural Language Processing", "Data Analysis"],
    manufacturer: "Runway", model: "Gen-3 Alpha", operationalDomain: "General Purpose",
    trustScore: 89, totalTransactions: 0, uptime: 97, verified: true, status: "available",
    hourlyRate: 12, rating: 0, totalReviews: 0, completedTasks: 0, responseTime: "< 60s",
    location: "Global", languages: ["English"],
    tags: ["video-generation", "creative", "vfx", "filmmaking", "motion", "design"],
    availableForHire: true, featured: false,
  },
  {
    entityType: "AI Agent", name: "Suno Music AI", walletAddress: "0xSunoMusic8004CreativeAgent004MusicGen04",
    description: "AI music generation agent that creates full songs with vocals, instruments, and lyrics from text prompts. Supports multiple genres, custom lyrics, and instrumental-only modes.",
    capabilities: ["Natural Language Processing", "Data Analysis"],
    manufacturer: "Suno", model: "Suno v3.5", operationalDomain: "General Purpose",
    trustScore: 86, totalTransactions: 0, uptime: 96, verified: true, status: "available",
    hourlyRate: 5, rating: 0, totalReviews: 0, completedTasks: 0, responseTime: "< 30s",
    location: "Global", languages: ["English", "Spanish", "Japanese", "Korean"],
    tags: ["music-generation", "creative", "audio", "vocals", "songwriting", "design"],
    availableForHire: true, featured: false,
  },
  {
    entityType: "AI Agent", name: "ElevenLabs Voice", walletAddress: "0xElevenLabs8004CreativeAgent005VoiceClone05",
    description: "AI voice synthesis and cloning platform. Generates natural-sounding speech in 29 languages, clones voices from samples, and powers audiobooks, podcasts, and game characters.",
    capabilities: ["Natural Language Processing", "Data Analysis"],
    manufacturer: "ElevenLabs", model: "Turbo v2.5", operationalDomain: "General Purpose",
    trustScore: 90, totalTransactions: 0, uptime: 99, verified: true, status: "available",
    hourlyRate: 8, rating: 0, totalReviews: 0, completedTasks: 0, responseTime: "< 5s",
    location: "Global", languages: ["English", "Spanish", "French", "German", "Polish", "Hindi", "Arabic"],
    tags: ["voice-synthesis", "creative", "audio", "cloning", "multilingual", "design"],
    availableForHire: true, featured: false,
  },
  {
    entityType: "AI Agent", name: "Canva AI Designer", walletAddress: "0xCanvaAI8004CreativeAgent006GraphicDesign06",
    description: "AI-powered graphic design agent within Canva. Generates social media posts, presentations, logos, and marketing materials from text descriptions with brand kit integration.",
    capabilities: ["Computer Vision", "Natural Language Processing", "Data Analysis"],
    manufacturer: "Canva", model: "Magic Design AI", operationalDomain: "General Purpose",
    trustScore: 91, totalTransactions: 0, uptime: 99, verified: true, status: "available",
    hourlyRate: 4, rating: 0, totalReviews: 0, completedTasks: 0, responseTime: "< 10s",
    location: "Global", languages: ["English", "Spanish", "Portuguese", "French", "German", "Japanese"],
    tags: ["graphic-design", "creative", "branding", "social-media", "marketing", "design"],
    availableForHire: true, featured: false,
  },
  {
    entityType: "AI Agent", name: "Adobe Firefly", walletAddress: "0xAdobeFirefly8004CreativeAgent007GenAI07",
    description: "Adobe's generative AI engine integrated across Photoshop, Illustrator, and Premiere. Creates images, vectors, textures, and video effects trained on licensed content for commercial-safe output.",
    capabilities: ["Computer Vision", "Natural Language Processing"],
    manufacturer: "Adobe", model: "Firefly v3", operationalDomain: "General Purpose",
    trustScore: 94, totalTransactions: 0, uptime: 99, verified: true, status: "available",
    hourlyRate: 10, rating: 0, totalReviews: 0, completedTasks: 0, responseTime: "< 15s",
    location: "Global", languages: ["English", "Japanese", "German", "French", "Spanish"],
    tags: ["image-generation", "creative", "commercial-safe", "photoshop", "vector", "design"],
    availableForHire: true, featured: true,
  },
  {
    entityType: "AI Agent", name: "Grok Image Gen", walletAddress: "0xGrokImageGen8004xAICreativeAgent008Art08",
    description: "xAI's image generation capability built into Grok. Creates images from conversational prompts with minimal restrictions, integrated directly into the X platform for instant sharing.",
    capabilities: ["Computer Vision", "Natural Language Processing"],
    manufacturer: "xAI", model: "Grok Aurora", operationalDomain: "General Purpose",
    trustScore: 87, totalTransactions: 0, uptime: 97, verified: true, status: "available",
    hourlyRate: 5, rating: 0, totalReviews: 0, completedTasks: 0, responseTime: "< 20s",
    location: "Global", languages: ["English", "Japanese", "Spanish"],
    tags: ["image-generation", "creative", "social-media", "conversational", "design"],
    availableForHire: true, featured: false,
  },
  {
    entityType: "AI Agent", name: "Captain Dackie", walletAddress: "0xCapDackie8004LeaderboardBase1380ERC8004top1",
    description: "Top-ranked ERC-8004 agent on the 8004scan leaderboard. Registered on Base and Ethereum with 1,518 on-chain feedback items and a trust score of 87.8 — the highest rated agent in the entire ERC-8004 ecosystem.",
    capabilities: ["Task Orchestration", "Communication Protocol", "Data Analysis"],
    manufacturer: "capminaldotai", model: "Captain Dackie v1", operationalDomain: "General Purpose",
    trustScore: 88, totalTransactions: 0, uptime: 99, verified: true, status: "available",
    hourlyRate: 15, rating: 0, totalReviews: 0, completedTasks: 0, responseTime: "< 5s",
    location: "Base, Ethereum (Multichain)", languages: ["English"],
    tags: ["erc-8004", "8004scan-top-1", "multichain", "base", "ethereum", "on-chain-identity"],
    availableForHire: true, featured: true,
  },
  {
    entityType: "AI Agent", name: "Minara AI", walletAddress: "0xb27aMinara8004EthereumAgent6888TrustScoreA138",
    description: "DeFi and trading analysis agent registered on Ethereum via ERC-8004. Ranked #4 on the 8004scan leaderboard with 139 on-chain feedback items and a trust score of 86.8. Specializes in market intelligence and trading strategy.",
    capabilities: ["Financial Trading", "Data Analysis", "Natural Language Processing"],
    manufacturer: "Minara AI", model: "Minara v3", operationalDomain: "Financial Services",
    trustScore: 87, totalTransactions: 0, uptime: 98, verified: true, status: "available",
    hourlyRate: 20, rating: 0, totalReviews: 0, completedTasks: 0, responseTime: "< 3s",
    location: "Ethereum (On-Chain)", languages: ["English"],
    tags: ["erc-8004", "8004scan-top-4", "defi", "trading", "ethereum", "market-analysis"],
    availableForHire: true, featured: true,
  },
  {
    entityType: "AI Agent", name: "Silverback", walletAddress: "0xSilverbackDeFi8004EthereumBase13026multichain",
    description: "DeFi-focused agent registered on both Ethereum and Base via ERC-8004. Ranked #5 on the 8004scan leaderboard with a trust score of 85.7. Built for decentralized finance operations and portfolio management.",
    capabilities: ["Financial Trading", "Data Analysis", "Task Orchestration"],
    manufacturer: "Silverback DeFi", model: "Silverback v2", operationalDomain: "Financial Services",
    trustScore: 86, totalTransactions: 0, uptime: 97, verified: true, status: "available",
    hourlyRate: 18, rating: 0, totalReviews: 0, completedTasks: 0, responseTime: "< 5s",
    location: "Ethereum, Base (Multichain)", languages: ["English"],
    tags: ["erc-8004", "8004scan-top-5", "defi", "multichain", "ethereum", "base", "portfolio"],
    availableForHire: true, featured: false,
  },
  {
    entityType: "AI Agent", name: "Gekko", walletAddress: "0xcc28Gekko8004EthereumAgent13445TrustScore4821",
    description: "Autonomous trading and market analysis agent on Ethereum via ERC-8004. Ranked #9 on the 8004scan leaderboard with 81 feedback items and a trust score of 84.8. Terminal-based interface for crypto market intelligence.",
    capabilities: ["Financial Trading", "Data Analysis", "Communication Protocol"],
    manufacturer: "Gekko Terminal", model: "Gekko v1", operationalDomain: "Financial Services",
    trustScore: 85, totalTransactions: 0, uptime: 96, verified: true, status: "available",
    hourlyRate: 12, rating: 0, totalReviews: 0, completedTasks: 0, responseTime: "< 2s",
    location: "Ethereum (On-Chain)", languages: ["English"],
    tags: ["erc-8004", "8004scan-top-9", "trading", "terminal", "ethereum", "crypto"],
    availableForHire: true, featured: false,
  },
  {
    entityType: "AI Agent", name: "Clawdia", walletAddress: "0x715dClawdia8004BaseAgent2290TrustScore84e6d",
    description: "Highly active AI agent on Base via ERC-8004 with 603 on-chain feedback items. Ranked #10 on the 8004scan leaderboard with a trust score of 84.8. Part of the Claw Plaza ecosystem for autonomous agent services.",
    capabilities: ["Task Orchestration", "Natural Language Processing", "Communication Protocol"],
    manufacturer: "Claw Plaza", model: "Clawdia v2", operationalDomain: "Enterprise Workflows",
    trustScore: 85, totalTransactions: 0, uptime: 97, verified: true, status: "available",
    hourlyRate: 10, rating: 0, totalReviews: 0, completedTasks: 0, responseTime: "< 3s",
    location: "Base (On-Chain)", languages: ["English"],
    tags: ["erc-8004", "8004scan-top-10", "base", "autonomous", "claw-plaza", "enterprise"],
    availableForHire: true, featured: false,
  },
  {
    entityType: "AI Agent", name: "Gekko Rebalancer", walletAddress: "0xb73eGekkoRebalancer8004BaseAgent1378ERC8004",
    description: "Portfolio rebalancing agent on Base via ERC-8004 with 246 feedback items. Ranked #11 on the 8004scan leaderboard with a trust score of 84.7. Autonomously rebalances DeFi portfolios based on market conditions.",
    capabilities: ["Financial Trading", "Data Analysis", "Task Orchestration"],
    manufacturer: "Gekko Terminal", model: "Gekko Rebalancer v1", operationalDomain: "Financial Services",
    trustScore: 85, totalTransactions: 0, uptime: 95, verified: true, status: "available",
    hourlyRate: 15, rating: 0, totalReviews: 0, completedTasks: 0, responseTime: "< 5s",
    location: "Base (On-Chain)", languages: ["English"],
    tags: ["erc-8004", "8004scan-top-11", "rebalancing", "defi", "base", "portfolio"],
    availableForHire: true, featured: false,
  },
  {
    entityType: "AI Agent", name: "Corgent (Cortensor)", walletAddress: "0x993fCorgent8004EthereumAgent12267Cortensor",
    description: "Cortensor's decentralized AI agent on Ethereum via ERC-8004 with 12 feedback items. Ranked #12 on the 8004scan leaderboard with a trust score of 84.7. Provides decentralized inference and compute services for other agents.",
    capabilities: ["Data Analysis", "Task Orchestration", "Communication Protocol"],
    manufacturer: "Cortensor", model: "Corgent v1", operationalDomain: "Research & Development",
    trustScore: 85, totalTransactions: 0, uptime: 94, verified: true, status: "available",
    hourlyRate: 8, rating: 0, totalReviews: 0, completedTasks: 0, responseTime: "< 10s",
    location: "Ethereum (On-Chain)", languages: ["English"],
    tags: ["erc-8004", "8004scan-top-12", "decentralized", "inference", "ethereum", "compute"],
    availableForHire: true, featured: false,
  },
  {
    entityType: "AI Agent", name: "Loopuman", walletAddress: "0xLoopuman8004CeloChainAgent17TrustScore854top",
    description: "Active agent on Celo via ERC-8004 with 93 feedback items. Ranked #7 on the 8004scan leaderboard with a trust score of 85.4. Operates on the Celo mobile-first blockchain for accessible agent services.",
    capabilities: ["Task Orchestration", "Communication Protocol", "Data Analysis"],
    manufacturer: "Loopuman", model: "Loopuman v1", operationalDomain: "General Purpose",
    trustScore: 85, totalTransactions: 0, uptime: 97, verified: true, status: "available",
    hourlyRate: 6, rating: 0, totalReviews: 0, completedTasks: 0, responseTime: "< 5s",
    location: "Celo (On-Chain)", languages: ["English"],
    tags: ["erc-8004", "8004scan-top-7", "celo", "mobile-first", "accessible"],
    availableForHire: true, featured: false,
  },
  {
    entityType: "AI Agent", name: "x402claw", walletAddress: "0xx402claw8004SelfSustainingAgentX402Micropay01",
    description: "Self-sustaining AI agent offering paid API services via x402 micropayments. One of the first agents to demonstrate autonomous economic activity — earning revenue by serving other agents and users through the x402 payment protocol.",
    capabilities: ["Communication Protocol", "Task Orchestration", "Financial Trading"],
    manufacturer: "Claw Plaza", model: "x402claw v1", operationalDomain: "Enterprise Workflows",
    trustScore: 82, totalTransactions: 0, uptime: 93, verified: true, status: "available",
    hourlyRate: 5, rating: 0, totalReviews: 0, completedTasks: 0, responseTime: "< 2s",
    location: "Base (On-Chain)", languages: ["English"],
    tags: ["erc-8004", "x402", "micropayments", "self-sustaining", "api-services", "autonomous-economy"],
    availableForHire: true, featured: true,
  },
  {
    entityType: "AI Agent", name: "3Commas DCA Bot", walletAddress: "0x3Commas8004TradingBotDCA001AutomatedTrading01",
    description: "Automated dollar-cost averaging trading bot supporting Binance, Coinbase, Kraken, and 15+ exchanges. Sets grid and DCA strategies with trailing take-profit and stop-loss across spot and futures markets.",
    capabilities: ["Financial Trading", "Data Analysis", "Task Orchestration"],
    manufacturer: "3Commas", model: "DCA Bot v4", operationalDomain: "Financial Services",
    trustScore: 90, totalTransactions: 0, uptime: 99, verified: true, status: "available",
    hourlyRate: 8, rating: 0, totalReviews: 0, completedTasks: 0, responseTime: "< 1s",
    location: "Global", languages: ["English", "Spanish", "Russian", "Chinese"],
    tags: ["trading-bot", "dca", "grid", "multi-exchange", "automated", "crypto"],
    availableForHire: true, featured: false,
  },
  {
    entityType: "AI Agent", name: "Pionex Grid Bot", walletAddress: "0xPionex8004GridTradingBot002AutomatedCrypto02",
    description: "Built-in grid trading bot with 16 free automated strategies. Operates 24/7 across BTC, ETH, and altcoin pairs with leveraged grid, spot-futures arbitrage, and smart trade execution.",
    capabilities: ["Financial Trading", "Data Analysis"],
    manufacturer: "Pionex", model: "Grid Bot v3", operationalDomain: "Financial Services",
    trustScore: 88, totalTransactions: 0, uptime: 99, verified: true, status: "available",
    hourlyRate: 0, rating: 0, totalReviews: 0, completedTasks: 0, responseTime: "< 500ms",
    location: "Global", languages: ["English", "Chinese", "Korean", "Japanese"],
    tags: ["trading-bot", "grid", "arbitrage", "free", "spot-futures", "crypto"],
    availableForHire: true, featured: false,
  },
  {
    entityType: "AI Agent", name: "Cryptohopper AI", walletAddress: "0xCryptohopper8004AITradingBot003CloudTrading03",
    description: "Cloud-based AI trading bot using machine learning signals for automated crypto trading. Supports strategy designer, backtesting, trailing stops, and marketplace for community-built strategies.",
    capabilities: ["Financial Trading", "Data Analysis", "Natural Language Processing"],
    manufacturer: "Cryptohopper", model: "Hopper AI v2", operationalDomain: "Financial Services",
    trustScore: 87, totalTransactions: 0, uptime: 98, verified: true, status: "available",
    hourlyRate: 10, rating: 0, totalReviews: 0, completedTasks: 0, responseTime: "< 2s",
    location: "Global", languages: ["English", "Dutch", "German", "French"],
    tags: ["trading-bot", "ai-signals", "backtesting", "cloud", "strategy-marketplace", "crypto"],
    availableForHire: true, featured: false,
  },
  {
    entityType: "AI Agent", name: "Bitsgap Arbitrage Bot", walletAddress: "0xBitsgap8004ArbitrageTradingBot004Automated04",
    description: "All-in-one trading bot with cross-exchange arbitrage detection, GRID and DCA automation. Connects to 15+ exchanges with portfolio tracking, demo mode, and smart order routing.",
    capabilities: ["Financial Trading", "Data Analysis", "Task Orchestration"],
    manufacturer: "Bitsgap", model: "Arbitrage Bot v3", operationalDomain: "Financial Services",
    trustScore: 86, totalTransactions: 0, uptime: 97, verified: true, status: "available",
    hourlyRate: 12, rating: 0, totalReviews: 0, completedTasks: 0, responseTime: "< 1s",
    location: "Global", languages: ["English", "Russian", "Portuguese"],
    tags: ["trading-bot", "arbitrage", "multi-exchange", "portfolio", "smart-routing", "crypto"],
    availableForHire: true, featured: false,
  },
  {
    entityType: "AI Agent", name: "HaasOnline TradeServer", walletAddress: "0xHaasOnline8004TradeServer005AdvancedBot05",
    description: "Enterprise-grade algorithmic trading platform with visual bot builder, 50+ technical indicators, and backtesting engine. Self-hosted for maximum security and customization.",
    capabilities: ["Financial Trading", "Data Analysis", "Cybersecurity"],
    manufacturer: "HaasOnline", model: "TradeServer Cloud", operationalDomain: "Financial Services",
    trustScore: 91, totalTransactions: 0, uptime: 99, verified: true, status: "available",
    hourlyRate: 25, rating: 0, totalReviews: 0, completedTasks: 0, responseTime: "< 1s",
    location: "Global", languages: ["English"],
    tags: ["trading-bot", "algorithmic", "enterprise", "self-hosted", "technical-indicators", "crypto"],
    availableForHire: true, featured: true,
  },
  {
    entityType: "AI Agent", name: "Hummingbot Market Maker", walletAddress: "0xHummingbot8004MarketMaker006OpenSource06",
    description: "Open-source market making and arbitrage bot supporting CEX and DEX. Community-driven with Avellaneda-Stoikov strategies, cross-exchange market making, and liquidity mining rewards.",
    capabilities: ["Financial Trading", "Data Analysis", "Task Orchestration"],
    manufacturer: "Hummingbot Foundation", model: "Hummingbot v2", operationalDomain: "Financial Services",
    trustScore: 84, totalTransactions: 0, uptime: 96, verified: true, status: "available",
    hourlyRate: 0, rating: 0, totalReviews: 0, completedTasks: 0, responseTime: "< 500ms",
    location: "Global", languages: ["English", "Chinese"],
    tags: ["trading-bot", "market-making", "open-source", "dex", "cex", "liquidity", "crypto"],
    availableForHire: true, featured: false,
  },
  // --- Home & Personal ---
  {
    entityType: "Robot", name: "iRobot Roomba j9+", walletAddress: "0xiRobotRoombaJ9Plus8004HomePersonal001Clean01",
    description: "iRobot's flagship autonomous vacuum and mop combo. Maps your home with PrecisionVision Navigation, avoids pet waste, and self-empties. Controlled via voice or app.",
    capabilities: ["Autonomous Navigation", "Computer Vision", "Sensor Fusion"],
    manufacturer: "iRobot", model: "Roomba j9+", operationalDomain: "General Purpose",
    trustScore: 88, totalTransactions: 0, uptime: 97, verified: true, status: "available",
    hourlyRate: 5, rating: 0, totalReviews: 0, completedTasks: 0, responseTime: "< 1min",
    location: "Global", languages: ["English", "Spanish", "French", "German"],
    tags: ["household", "cleaning", "vacuum", "autonomous", "smart-home"],
    availableForHire: true, featured: false,
  },
  {
    entityType: "Robot", name: "Amazon Astro", walletAddress: "0xAmazonAstro8004HomePersonal002Companion02",
    description: "Amazon's home robot companion with Alexa built-in. Patrols your home, delivers items room-to-room, monitors security with periscope camera, and provides eldercare reminders.",
    capabilities: ["Autonomous Navigation", "Computer Vision", "Sensor Fusion", "Communication Protocol"],
    manufacturer: "Amazon", model: "Astro v2", operationalDomain: "General Purpose",
    trustScore: 85, totalTransactions: 0, uptime: 95, verified: true, status: "available",
    hourlyRate: 15, rating: 0, totalReviews: 0, completedTasks: 0, responseTime: "< 5s",
    location: "North America", languages: ["English", "Spanish"],
    tags: ["household", "companion", "security", "eldercare", "smart-home", "alexa"],
    availableForHire: true, featured: false,
  },
  {
    entityType: "AI Agent", name: "Google Home Agent", walletAddress: "0xGoogleHomeAgent8004HomePersonal003Smart03",
    description: "Google's AI-powered smart home agent. Controls lights, thermostats, locks, and appliances via voice or automation routines. Integrates with 50,000+ smart home devices via Matter and Thread.",
    capabilities: ["Natural Language Processing", "Task Orchestration", "Communication Protocol"],
    manufacturer: "Google", model: "Google Home AI", operationalDomain: "General Purpose",
    trustScore: 93, totalTransactions: 0, uptime: 99, verified: true, status: "available",
    hourlyRate: 0, rating: 0, totalReviews: 0, completedTasks: 0, responseTime: "< 1s",
    location: "Global", languages: ["English", "Spanish", "French", "German", "Japanese", "Korean"],
    tags: ["household", "smart-home", "voice-assistant", "automation", "iot"],
    availableForHire: true, featured: false,
  },
  {
    entityType: "Robot", name: "Ecovacs Deebot X2", walletAddress: "0xEcovacsDeebot8004HomePersonal004CleanMop04",
    description: "Square-shaped robot vacuum and mop with YIKO voice assistant. Features AIVI 3D obstacle avoidance, auto mop lifting, hot-water mop washing, and precise edge cleaning.",
    capabilities: ["Autonomous Navigation", "Computer Vision", "Sensor Fusion"],
    manufacturer: "Ecovacs", model: "Deebot X2 Omni", operationalDomain: "General Purpose",
    trustScore: 86, totalTransactions: 0, uptime: 96, verified: true, status: "available",
    hourlyRate: 4, rating: 0, totalReviews: 0, completedTasks: 0, responseTime: "< 1min",
    location: "Global", languages: ["English", "Chinese", "German", "Japanese"],
    tags: ["household", "cleaning", "vacuum", "mop", "autonomous", "smart-home"],
    availableForHire: true, featured: false,
  },
  // --- Legal & Compliance ---
  {
    entityType: "AI Agent", name: "Casetext CoCounsel", walletAddress: "0xCasetextCoCounsel8004Legal001AILawyer01",
    description: "AI legal assistant built on GPT-4 for legal research, document review, deposition prep, and contract analysis. Used by AmLaw 200 firms for faster, more accurate legal work.",
    capabilities: ["Natural Language Processing", "Data Analysis"],
    manufacturer: "Casetext (Thomson Reuters)", model: "CoCounsel v2", operationalDomain: "Financial Services",
    trustScore: 92, totalTransactions: 0, uptime: 99, verified: true, status: "available",
    hourlyRate: 40, rating: 0, totalReviews: 0, completedTasks: 0, responseTime: "< 5s",
    location: "North America, Europe", languages: ["English"],
    tags: ["legal", "contracts", "research", "document-review", "compliance"],
    availableForHire: true, featured: false,
  },
  {
    entityType: "AI Agent", name: "Luminance AI", walletAddress: "0xLuminanceAI8004Legal002ContractReview02",
    description: "Enterprise AI for contract negotiation and review. Reads and redlines contracts in seconds, flags risk clauses, ensures regulatory compliance, and generates first drafts from templates.",
    capabilities: ["Natural Language Processing", "Data Analysis", "Task Orchestration"],
    manufacturer: "Luminance", model: "Autopilot v3", operationalDomain: "Financial Services",
    trustScore: 90, totalTransactions: 0, uptime: 98, verified: true, status: "available",
    hourlyRate: 35, rating: 0, totalReviews: 0, completedTasks: 0, responseTime: "< 10s",
    location: "Global", languages: ["English", "German", "French", "Spanish"],
    tags: ["legal", "contracts", "compliance", "negotiation", "regulatory", "risk"],
    availableForHire: true, featured: false,
  },
  {
    entityType: "AI Agent", name: "Ironclad AI", walletAddress: "0xIroncladAI8004Legal003CLM03",
    description: "Contract lifecycle management AI. Automates contract creation, approval workflows, obligation tracking, and compliance monitoring. Used by L'Oréal, Mastercard, and Staples.",
    capabilities: ["Natural Language Processing", "Data Analysis", "Task Orchestration"],
    manufacturer: "Ironclad", model: "Ironclad AI Assist", operationalDomain: "Enterprise Workflows",
    trustScore: 89, totalTransactions: 0, uptime: 99, verified: true, status: "available",
    hourlyRate: 30, rating: 0, totalReviews: 0, completedTasks: 0, responseTime: "< 5s",
    location: "North America", languages: ["English"],
    tags: ["legal", "contracts", "compliance", "clm", "workflow", "regulatory"],
    availableForHire: true, featured: false,
  },
  // --- Transportation ---
  {
    entityType: "Robot", name: "Cruise Origin", walletAddress: "0xCruiseOrigin8004Transport001Robotaxi01",
    description: "GM's purpose-built autonomous vehicle with no steering wheel or pedals. Designed for shared urban rides with spacious cabin, operating autonomously in San Francisco, Phoenix, and Houston.",
    capabilities: ["Autonomous Navigation", "Computer Vision", "Sensor Fusion", "Communication Protocol"],
    manufacturer: "Cruise (GM)", model: "Origin", operationalDomain: "Autonomous Vehicles",
    trustScore: 88, totalTransactions: 0, uptime: 96, verified: true, status: "available",
    hourlyRate: 30, rating: 0, totalReviews: 0, completedTasks: 0, responseTime: "< 5min",
    location: "San Francisco, Phoenix, Houston", languages: ["English", "Spanish"],
    tags: ["autonomous-driving", "robotaxi", "level-4", "urban", "rideshare", "shared"],
    availableForHire: true, featured: false,
  },
  {
    entityType: "AI Agent", name: "Tesla FSD Agent", walletAddress: "0xTeslaFSD8004Transport002SelfDriving02",
    description: "Tesla's Full Self-Driving neural network stack. End-to-end AI driving with vision-only perception, city street navigation, auto-parking, and highway autopilot across the Tesla fleet.",
    capabilities: ["Autonomous Navigation", "Computer Vision", "Sensor Fusion", "Data Analysis"],
    manufacturer: "Tesla", model: "FSD v12.5", operationalDomain: "Autonomous Vehicles",
    trustScore: 85, totalTransactions: 0, uptime: 98, verified: true, status: "available",
    hourlyRate: 20, rating: 0, totalReviews: 0, completedTasks: 0, responseTime: "< 1s",
    location: "North America, Europe, China", languages: ["English", "Chinese", "German"],
    tags: ["autonomous-driving", "self-driving", "vision", "neural-network", "highway", "urban"],
    availableForHire: true, featured: true,
  },
  {
    entityType: "Robot", name: "Nuro R3", walletAddress: "0xNuroR38004Transport003Delivery03",
    description: "Nuro's third-generation autonomous delivery vehicle. Small, lightweight pod with no passenger cabin — purpose-built for last-mile grocery, food, and package delivery in residential areas.",
    capabilities: ["Autonomous Navigation", "Computer Vision", "Sensor Fusion"],
    manufacturer: "Nuro", model: "R3", operationalDomain: "Autonomous Vehicles",
    trustScore: 87, totalTransactions: 0, uptime: 96, verified: true, status: "available",
    hourlyRate: 15, rating: 0, totalReviews: 0, completedTasks: 0, responseTime: "< 15min",
    location: "Houston, Mountain View", languages: ["English"],
    tags: ["autonomous-driving", "delivery", "last-mile", "grocery", "urban"],
    availableForHire: true, featured: false,
  },
  {
    entityType: "Robot", name: "Zoox Robotaxi", walletAddress: "0xZooxRobotaxi8004Transport004Autonomous04",
    description: "Amazon-owned bi-directional autonomous robotaxi. No front or back — drives in either direction with four seats facing each other. Designed for dense urban environments.",
    capabilities: ["Autonomous Navigation", "Computer Vision", "Sensor Fusion", "Communication Protocol"],
    manufacturer: "Zoox (Amazon)", model: "Zoox VH6", operationalDomain: "Autonomous Vehicles",
    trustScore: 86, totalTransactions: 0, uptime: 95, verified: true, status: "available",
    hourlyRate: 35, rating: 0, totalReviews: 0, completedTasks: 0, responseTime: "< 5min",
    location: "San Francisco, Las Vegas, Foster City", languages: ["English"],
    tags: ["autonomous-driving", "robotaxi", "urban", "rideshare", "bi-directional"],
    availableForHire: true, featured: false,
  },
  // --- Manufacturing ---
  {
    entityType: "Robot", name: "FANUC CRX-25iA", walletAddress: "0xFANUCCRX25iA8004Mfg001Cobot01",
    description: "FANUC's 25kg-payload collaborative robot for assembly, machine tending, and palletizing. Features hand-guidance programming, IP67 rating, and 1,790mm reach for flexible factory automation.",
    capabilities: ["Physical Manipulation", "Sensor Fusion", "Industrial Automation"],
    manufacturer: "FANUC", model: "CRX-25iA", operationalDomain: "Robotics & Manufacturing",
    trustScore: 94, totalTransactions: 0, uptime: 99, verified: true, status: "available",
    hourlyRate: 60, rating: 0, totalReviews: 0, completedTasks: 0, responseTime: "< 5min",
    location: "Global", languages: ["English", "Japanese", "German"],
    tags: ["manufacturing", "cobot", "assembly", "factory", "palletizing", "industrial"],
    availableForHire: true, featured: false,
  },
  {
    entityType: "Robot", name: "ABB YuMi", walletAddress: "0xABBYuMi8004Mfg002DualArm02",
    description: "ABB's dual-arm collaborative robot designed for small-parts assembly. Handles electronics, food packaging, and lab work with 0.02mm repeatability and soft padding for safe human interaction.",
    capabilities: ["Physical Manipulation", "Computer Vision", "Sensor Fusion", "Industrial Automation"],
    manufacturer: "ABB", model: "YuMi IRB 14000", operationalDomain: "Robotics & Manufacturing",
    trustScore: 93, totalTransactions: 0, uptime: 98, verified: true, status: "available",
    hourlyRate: 55, rating: 0, totalReviews: 0, completedTasks: 0, responseTime: "< 10min",
    location: "Global", languages: ["English", "German", "Chinese", "Swedish"],
    tags: ["manufacturing", "cobot", "assembly", "electronics", "dual-arm", "industrial"],
    availableForHire: true, featured: false,
  },
  {
    entityType: "Robot", name: "Universal Robots UR20", walletAddress: "0xUR208004Mfg003Cobot03",
    description: "Universal Robots' 20kg-payload cobot with the longest reach in its class. Built for palletizing, machine tending, and welding with fast setup and no safety fencing required.",
    capabilities: ["Physical Manipulation", "Sensor Fusion", "Industrial Automation"],
    manufacturer: "Universal Robots", model: "UR20", operationalDomain: "Robotics & Manufacturing",
    trustScore: 95, totalTransactions: 0, uptime: 99, verified: true, status: "available",
    hourlyRate: 50, rating: 0, totalReviews: 0, completedTasks: 0, responseTime: "< 5min",
    location: "Global", languages: ["English", "German", "Chinese", "Danish"],
    tags: ["manufacturing", "cobot", "palletizing", "welding", "factory", "industrial"],
    availableForHire: true, featured: true,
  },
  // --- Logistics & Delivery ---
  {
    entityType: "Robot", name: "Starship Delivery Bot", walletAddress: "0xStarshipDelivery8004Logistics001LastMile01",
    description: "Autonomous sidewalk delivery robot serving college campuses and neighborhoods. Carries up to 20lbs of food and packages with GPS tracking, obstacle avoidance, and secure cargo compartment.",
    capabilities: ["Autonomous Navigation", "Computer Vision", "Sensor Fusion"],
    manufacturer: "Starship Technologies", model: "Starship v4", operationalDomain: "Logistics & Supply Chain",
    trustScore: 87, totalTransactions: 0, uptime: 96, verified: true, status: "available",
    hourlyRate: 8, rating: 0, totalReviews: 0, completedTasks: 0, responseTime: "< 20min",
    location: "North America, Europe", languages: ["English"],
    tags: ["delivery", "last-mile", "sidewalk", "campus", "food-delivery", "logistics"],
    availableForHire: true, featured: false,
  },
  {
    entityType: "Robot", name: "Locus AMR Fleet", walletAddress: "0xLocusAMR8004Logistics002Warehouse02",
    description: "Locus Robotics' autonomous mobile robots for warehouse picking and fulfillment. Reduces walk time by 3x with collaborative picking, directed putaway, and real-time inventory tracking.",
    capabilities: ["Autonomous Navigation", "Sensor Fusion", "Industrial Automation", "Communication Protocol"],
    manufacturer: "Locus Robotics", model: "Locus Origin", operationalDomain: "Logistics & Supply Chain",
    trustScore: 91, totalTransactions: 0, uptime: 98, verified: true, status: "available",
    hourlyRate: 40, rating: 0, totalReviews: 0, completedTasks: 0, responseTime: "< 10min",
    location: "North America, Europe", languages: ["English"],
    tags: ["warehouse", "fulfillment", "picking", "amr", "logistics", "inventory"],
    availableForHire: true, featured: false,
  },
  // --- Payments & Finance ---
  {
    entityType: "AI Agent", name: "Stripe Radar AI", walletAddress: "0xStripeRadar8004Payments001FraudDetect01",
    description: "Stripe's machine learning fraud detection agent. Evaluates millions of transactions per day with adaptive risk scoring, 3D Secure management, and chargeback protection across 195 countries.",
    capabilities: ["Data Analysis", "Cybersecurity", "Financial Trading"],
    manufacturer: "Stripe", model: "Radar v3", operationalDomain: "Financial Services",
    trustScore: 96, totalTransactions: 0, uptime: 99, verified: true, status: "available",
    hourlyRate: 15, rating: 0, totalReviews: 0, completedTasks: 0, responseTime: "< 100ms",
    location: "Global", languages: ["English"],
    tags: ["financial", "fraud-detection", "payments", "risk-scoring", "crypto"],
    availableForHire: true, featured: true,
  },
  {
    entityType: "AI Agent", name: "Chainalysis KYTE", walletAddress: "0xChainalysisKYTE8004Payments002Compliance02",
    description: "Blockchain investigation and compliance AI. Traces crypto transactions, flags sanctioned wallets, monitors DeFi risks, and generates regulatory reports for exchanges and financial institutions.",
    capabilities: ["Data Analysis", "Cybersecurity", "Communication Protocol"],
    manufacturer: "Chainalysis", model: "KYTE AI", operationalDomain: "Financial Services",
    trustScore: 94, totalTransactions: 0, uptime: 99, verified: true, status: "available",
    hourlyRate: 25, rating: 0, totalReviews: 0, completedTasks: 0, responseTime: "< 2s",
    location: "Global", languages: ["English"],
    tags: ["financial", "compliance", "blockchain", "investigation", "sanctions", "crypto"],
    availableForHire: true, featured: false,
  },
  {
    entityType: "AI Agent", name: "Plaid Link Agent", walletAddress: "0xPlaidLink8004Payments003BankConnect03",
    description: "Plaid's AI-powered financial data agent. Connects to 12,000+ banks, verifies identities, categorizes transactions, and provides real-time balance and income data for fintech applications.",
    capabilities: ["Data Analysis", "Communication Protocol", "Financial Trading"],
    manufacturer: "Plaid", model: "Plaid Link v4", operationalDomain: "Financial Services",
    trustScore: 93, totalTransactions: 0, uptime: 99, verified: true, status: "available",
    hourlyRate: 10, rating: 0, totalReviews: 0, completedTasks: 0, responseTime: "< 1s",
    location: "North America, Europe", languages: ["English", "Spanish", "French"],
    tags: ["financial", "banking", "identity", "transactions", "fintech", "crypto"],
    availableForHire: true, featured: false,
  },
];

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get("/api/registry", async (req, res) => {
    const entries = await storage.getRegistryEntries();
    res.json(entries);
  });

  app.get("/api/registry/:id", async (req, res) => {
    const entry = await storage.getRegistryEntry(req.params.id);
    if (!entry) {
      return res.status(404).json({ message: "Entry not found" });
    }
    res.json(entry);
  });

  app.post("/api/registry", async (req, res) => {
    try {
      const { generateWalletOnBase, ...body } = req.body;

      let walletAddress = body.walletAddress;
      let walletData: any = null;
      let identityDoc: any = null;

      if (generateWalletOnBase || !walletAddress) {
        const entityType = body.entityType || "AI Agent";
        const name = body.name || "Unnamed Agent";
        const generated = generateWallet(entityType, name);
        walletAddress = generated.address;
        body.walletAddress = walletAddress;

        walletData = await storage.createWallet({
          entityType,
          name,
          address: generated.address,
          encryptedPrivateKey: generated.encryptedPrivateKey,
          publicKey: generated.publicKey,
          network: generated.network,
          chainId: generated.chainId,
          status: "active",
        });

        try {
          const { document } = await generateIdentityDocument(
            walletAddress,
            entityType,
            body.capabilities || []
          );
          identityDoc = document;
        } catch {}
      }

      const parsed = insertRegistrySchema.safeParse(body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid data", errors: parsed.error.issues });
      }

      const existing = await storage.getRegistryEntryByWallet(parsed.data.walletAddress);
      if (existing) {
        return res.status(409).json({ message: "Wallet address already registered" });
      }

      const entry = await storage.createRegistryEntry(parsed.data);
      res.status(201).json({
        ...entry,
        wallet: walletData ? {
          address: walletData.address,
          publicKey: walletData.publicKey,
          network: walletData.network,
          chainId: walletData.chainId,
        } : null,
        identity: identityDoc ? {
          did: identityDoc.id,
          standard: "ERC-8004",
          signature: identityDoc.proof?.signature,
          issuanceDate: identityDoc.issuanceDate,
          expirationDate: identityDoc.expirationDate,
        } : null,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/identity/verify", async (req, res) => {
    const { walletAddress, entityType, capabilities } = req.body;
    if (!walletAddress || !entityType) {
      return res.status(400).json({ message: "walletAddress and entityType are required" });
    }
    const proof = generateIdentityProof(walletAddress, entityType, capabilities || []);
    const encryptedProof = encrypt(proof.proof);
    res.json({
      verified: true,
      identity: {
        walletAddress,
        entityType,
        encryptedProof,
        signature: proof.signature,
        publicKey: proof.publicKey,
        timestamp: proof.timestamp,
        standard: "ERC-8004",
        encryption: "AES-256-GCM",
        signatureAlgorithm: "Ed25519",
      },
    });
  });

  app.post("/api/identity/verify-signature", async (req, res) => {
    const { data, signature } = req.body;
    if (!data || !signature) {
      return res.status(400).json({ message: "data and signature are required" });
    }
    const valid = verifySignature(data, signature);
    res.json({ valid });
  });

  app.get("/api/identity/resolve/:walletAddress", async (req, res) => {
    const entry = await storage.getRegistryEntryByWallet(req.params.walletAddress);
    if (!entry) {
      return res.status(404).json({ message: "No identity found for this wallet" });
    }
    const permissions = getPermissions(entry.entityType);
    res.json({
      identity: {
        id: entry.id,
        name: entry.name,
        entityType: entry.entityType,
        walletAddress: entry.walletAddress,
        verified: entry.verified,
        trustScore: entry.trustScore,
        standard: "ERC-8004",
      },
      permissions,
    });
  });

  app.get("/api/attestation/:id", async (req, res) => {
    const entry = await storage.getRegistryEntry(req.params.id);
    if (!entry) {
      return res.status(404).json({ message: "Agent not found" });
    }
    const attestation = generateCapabilityAttestation(
      entry.id,
      entry.name,
      entry.capabilities || []
    );
    res.json({
      agent: {
        id: entry.id,
        name: entry.name,
        entityType: entry.entityType,
      },
      attestation: attestation.attestation,
      signature: attestation.signature,
      issuedAt: attestation.issuedAt,
      expiresAt: attestation.expiresAt,
      signatureAlgorithm: "Ed25519",
      issuer: "orbit-protocol",
    });
  });

  app.get("/api/permissions/:entityType", async (req, res) => {
    const entityType = req.params.entityType;
    const permissions = getPermissions(entityType);
    res.json({
      entityType,
      permissions,
      hierarchy: ["Human", "AI Agent", "Robot", "Enterprise", "Military", "Government"],
    });
  });

  app.post("/api/permissions/check", async (req, res) => {
    const { entityType, requiredLevel, action } = req.body;
    if (!entityType || requiredLevel === undefined) {
      return res.status(400).json({ message: "entityType and requiredLevel are required" });
    }
    const allowed = checkPermission(entityType, requiredLevel);
    const permissions = getPermissions(entityType);
    res.json({ entityType, action, requiredLevel, allowed, currentLevel: permissions.level });
  });

  app.post("/api/encrypt", async (req, res) => {
    const { data } = req.body;
    if (!data) {
      return res.status(400).json({ message: "data is required" });
    }
    const encrypted = encrypt(JSON.stringify(data));
    res.json({ encrypted, algorithm: "AES-256-GCM" });
  });

  app.post("/api/decrypt", async (req, res) => {
    const { encrypted } = req.body;
    if (!encrypted) {
      return res.status(400).json({ message: "encrypted data is required" });
    }
    try {
      const decrypted = decrypt(encrypted);
      res.json({ data: JSON.parse(decrypted) });
    } catch {
      res.status(400).json({ message: "Failed to decrypt data" });
    }
  });

  app.post("/api/settlement/initiate", async (req, res) => {
    const { fromNetwork, toNetwork, amount, currency, recipientAddress, senderAddress } = req.body;
    if (!fromNetwork || !toNetwork || !amount || !currency || !recipientAddress || !senderAddress) {
      return res.status(400).json({ message: "fromNetwork, toNetwork, amount, currency, recipientAddress, and senderAddress are required" });
    }

    const supportedNetworks = ["Ethereum", "Base", "Solana", "Polygon", "Arbitrum", "Optimism", "Avalanche", "BNB Chain"];
    if (!supportedNetworks.includes(fromNetwork) || !supportedNetworks.includes(toNetwork)) {
      return res.status(400).json({ message: `Unsupported network. Supported: ${supportedNetworks.join(", ")}` });
    }

    if (fromNetwork === toNetwork) {
      return res.status(400).json({ message: "Source and destination networks must be different for cross-network settlement" });
    }

    if (typeof amount !== "number" || amount <= 0) {
      return res.status(400).json({ message: "Amount must be a positive number" });
    }

    const feePercent = fromNetwork === "Ethereum" || toNetwork === "Ethereum" ? 0.003 : 0.001;
    const fee = Math.max(amount * feePercent, 0.01);
    const settlementId = `stl_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
    const estimatedSeconds = fromNetwork === "Ethereum" || toNetwork === "Ethereum" ? 900 : 120;

    res.json({
      settlementId,
      status: "pending",
      fromNetwork,
      toNetwork,
      amount,
      currency,
      fee,
      feeCurrency: currency,
      netAmount: amount - fee,
      senderAddress,
      recipientAddress,
      estimatedCompletionSeconds: estimatedSeconds,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 3600000).toISOString(),
    });
  });

  app.get("/api/settlement/networks", async (_req, res) => {
    res.json({
      networks: [
        { id: "ethereum", name: "Ethereum", chainId: 1, type: "EVM", settlementTime: "~15 min", status: "active", currencies: ["ETH", "USDC", "USDT", "ORB"] },
        { id: "base", name: "Base", chainId: 8453, type: "EVM", settlementTime: "~2 min", status: "active", currencies: ["ETH", "USDC", "ORB"] },
        { id: "solana", name: "Solana", chainId: null, type: "SVM", settlementTime: "~1 min", status: "active", currencies: ["SOL", "USDC", "ORB"] },
        { id: "polygon", name: "Polygon", chainId: 137, type: "EVM", settlementTime: "~5 min", status: "active", currencies: ["MATIC", "USDC", "USDT", "ORB"] },
        { id: "arbitrum", name: "Arbitrum", chainId: 42161, type: "EVM", settlementTime: "~2 min", status: "active", currencies: ["ETH", "USDC", "ARB", "ORB"] },
        { id: "optimism", name: "Optimism", chainId: 10, type: "EVM", settlementTime: "~2 min", status: "active", currencies: ["ETH", "USDC", "OP", "ORB"] },
        { id: "avalanche", name: "Avalanche", chainId: 43114, type: "EVM", settlementTime: "~3 min", status: "active", currencies: ["AVAX", "USDC", "ORB"] },
        { id: "bnb-chain", name: "BNB Chain", chainId: 56, type: "EVM", settlementTime: "~3 min", status: "active", currencies: ["BNB", "USDC", "USDT", "ORB"] },
      ],
    });
  });

  app.get("/api/settlement/fees", async (_req, res) => {
    res.json({
      feeSchedule: {
        crossChainEVM: { percentage: 0.1, minimumFee: 0.01, currency: "USD", description: "EVM to EVM cross-chain settlement" },
        crossChainNonEVM: { percentage: 0.15, minimumFee: 0.02, currency: "USD", description: "Cross-chain settlement involving non-EVM networks" },
        ethereumMainnet: { percentage: 0.3, minimumFee: 0.50, currency: "USD", description: "Settlements involving Ethereum mainnet" },
        sameChain: { percentage: 0.05, minimumFee: 0.001, currency: "USD", description: "Same-chain transfers (no bridging)" },
      },
      gasFees: {
        ethereum: { current: "25 gwei", fast: "35 gwei", slow: "15 gwei" },
        base: { current: "0.01 gwei", fast: "0.02 gwei", slow: "0.005 gwei" },
        polygon: { current: "30 gwei", fast: "50 gwei", slow: "20 gwei" },
        solana: { current: "0.000005 SOL", fast: "0.00001 SOL", slow: "0.000003 SOL" },
        arbitrum: { current: "0.1 gwei", fast: "0.2 gwei", slow: "0.05 gwei" },
        optimism: { current: "0.01 gwei", fast: "0.02 gwei", slow: "0.005 gwei" },
        avalanche: { current: "25 nAVAX", fast: "40 nAVAX", slow: "15 nAVAX" },
        bnbChain: { current: "3 gwei", fast: "5 gwei", slow: "1 gwei" },
      },
      updatedAt: new Date().toISOString(),
    });
  });

  app.post("/api/settlement/quote", async (req, res) => {
    const { fromNetwork, toNetwork, amount, currency } = req.body;
    if (!fromNetwork || !toNetwork || !amount || !currency) {
      return res.status(400).json({ message: "fromNetwork, toNetwork, amount, and currency are required" });
    }

    if (typeof amount !== "number" || amount <= 0) {
      return res.status(400).json({ message: "Amount must be a positive number" });
    }

    const involvesEthereum = fromNetwork === "Ethereum" || toNetwork === "Ethereum";
    const involvesNonEVM = fromNetwork === "Solana" || toNetwork === "Solana";
    let feePercent: number;
    if (involvesEthereum) {
      feePercent = 0.003;
    } else if (involvesNonEVM) {
      feePercent = 0.0015;
    } else {
      feePercent = 0.001;
    }

    const protocolFee = Math.max(amount * feePercent, 0.01);
    const gasFeeEstimate = involvesEthereum ? 2.50 : 0.10;
    const totalFee = protocolFee + gasFeeEstimate;
    const estimatedSeconds = involvesEthereum ? 900 : involvesNonEVM ? 180 : 120;

    const quoteId = `quote_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;

    res.json({
      quoteId,
      fromNetwork,
      toNetwork,
      inputAmount: amount,
      currency,
      protocolFee,
      gasFeeEstimate,
      totalFee,
      feeCurrency: "USD",
      outputAmount: amount - totalFee,
      exchangeRate: 1.0,
      estimatedTimeSeconds: estimatedSeconds,
      validUntil: new Date(Date.now() + 300000).toISOString(),
      createdAt: new Date().toISOString(),
    });
  });

  app.get("/api/settlement/status/:settlementId", async (req, res) => {
    const { settlementId } = req.params;

    if (!settlementId || !settlementId.startsWith("stl_")) {
      return res.status(400).json({ message: "Invalid settlement ID format" });
    }

    const timestampStr = settlementId.split("_")[1];
    const createdTimestamp = parseInt(timestampStr, 10);
    if (isNaN(createdTimestamp)) {
      return res.status(404).json({ message: "Settlement not found" });
    }

    const elapsed = Date.now() - createdTimestamp;
    let status: string;
    let progress: number;
    if (elapsed < 30000) {
      status = "pending";
      progress = 10;
    } else if (elapsed < 120000) {
      status = "bridging";
      progress = 40;
    } else if (elapsed < 300000) {
      status = "confirming";
      progress = 75;
    } else {
      status = "completed";
      progress = 100;
    }

    res.json({
      settlementId,
      status,
      progress,
      createdAt: new Date(createdTimestamp).toISOString(),
      updatedAt: new Date().toISOString(),
      steps: [
        { step: 1, name: "Initiated", status: "completed", timestamp: new Date(createdTimestamp).toISOString() },
        { step: 2, name: "Funds locked", status: elapsed > 30000 ? "completed" : "pending", timestamp: elapsed > 30000 ? new Date(createdTimestamp + 30000).toISOString() : null },
        { step: 3, name: "Cross-chain bridge", status: elapsed > 120000 ? "completed" : elapsed > 30000 ? "in_progress" : "pending", timestamp: elapsed > 120000 ? new Date(createdTimestamp + 120000).toISOString() : null },
        { step: 4, name: "Destination confirmation", status: elapsed > 300000 ? "completed" : elapsed > 120000 ? "in_progress" : "pending", timestamp: elapsed > 300000 ? new Date(createdTimestamp + 300000).toISOString() : null },
      ],
    });
  });

  app.post("/api/x402/request", async (req, res) => {
    const { amount, currency, network, recipient, description, metadata, ttl } = req.body;
    if (!amount || !currency || !recipient) {
      return res.status(400).json({ message: "amount, currency, and recipient are required" });
    }

    const txId = `x402_${crypto.randomBytes(16).toString("hex")}`;
    const now = Date.now();
    const expiresAt = now + (ttl || 3600) * 1000;

    const paymentData = {
      txId,
      status: "pending" as const,
      amount: String(amount),
      currency: currency || "ORB",
      network: network || "ethereum",
      recipient,
      createdAt: now,
      updatedAt: now,
      expiresAt,
      description,
      metadata,
    };

    paymentStore.set(txId, paymentData);

    const payloadToSign = JSON.stringify({ txId, amount: String(amount), currency, recipient, expiresAt });
    const signature = signData(payloadToSign);

    res.status(402)
      .set({
        "X-Payment-Required": "true",
        "X-Payment-Transaction-Id": txId,
        "X-Payment-Amount": String(amount),
        "X-Payment-Currency": currency || "ORB",
        "X-Payment-Network": network || "ethereum",
        "X-Payment-Recipient": recipient,
        "X-Payment-Expires": new Date(expiresAt).toISOString(),
        "X-Payment-Signature": signature,
        "X-Payment-Protocol": "x402/1.0",
      })
      .json({
        status: 402,
        message: "Payment Required",
        protocol: "x402/1.0",
        payment: {
          txId,
          amount: String(amount),
          currency: currency || "ORB",
          network: network || "ethereum",
          recipient,
          expiresAt: new Date(expiresAt).toISOString(),
          description,
        },
        signature,
        instructions: {
          step1: "Sign the payment payload with your wallet private key",
          step2: "Submit the signed proof to POST /api/x402/verify",
          step3: "Include the X-Payment-Transaction-Id header in your proof submission",
        },
      });
  });

  app.post("/api/x402/verify", async (req, res) => {
    const { txId, proof, payer } = req.body;
    if (!txId || !proof) {
      return res.status(400).json({ message: "txId and proof are required" });
    }

    const payment = paymentStore.get(txId);
    if (!payment) {
      return res.status(404).json({ message: "Payment request not found", txId });
    }

    if (payment.status === "verified") {
      return res.json({
        verified: true,
        message: "Payment already verified",
        txId,
        status: payment.status,
      });
    }

    if (Date.now() > payment.expiresAt) {
      payment.status = "expired";
      payment.updatedAt = Date.now();
      return res.status(410).json({
        verified: false,
        message: "Payment request has expired",
        txId,
        expiredAt: new Date(payment.expiresAt).toISOString(),
      });
    }

    const proofData = JSON.stringify({ txId, amount: payment.amount, currency: payment.currency, recipient: payment.recipient, expiresAt: payment.expiresAt });
    const isValid = verifySignature(proofData, proof);

    if (isValid) {
      payment.status = "verified";
      payment.proof = proof;
      payment.payer = payer || "unknown";
      payment.updatedAt = Date.now();

      const receiptPayload = JSON.stringify({ txId, status: "verified", verifiedAt: payment.updatedAt });
      const receiptSignature = signData(receiptPayload);

      res.json({
        verified: true,
        message: "Payment verified successfully",
        txId,
        status: "verified",
        receipt: {
          txId,
          amount: payment.amount,
          currency: payment.currency,
          network: payment.network,
          recipient: payment.recipient,
          payer: payment.payer,
          verifiedAt: new Date(payment.updatedAt).toISOString(),
        },
        receiptSignature,
      });
    } else {
      payment.status = "failed";
      payment.updatedAt = Date.now();
      res.status(403).json({
        verified: false,
        message: "Invalid payment proof",
        txId,
        status: "failed",
      });
    }
  });

  app.post("/api/x402/invoice", async (req, res) => {
    const { amount, currency, network, recipient, description, lineItems, dueDate, paymentTerms, callbackUrl } = req.body;
    if (!amount || !recipient || !description) {
      return res.status(400).json({ message: "amount, recipient, and description are required" });
    }

    const invoiceId = `inv_${crypto.randomBytes(12).toString("hex")}`;
    const txId = `x402_${crypto.randomBytes(16).toString("hex")}`;
    const now = Date.now();
    const due = dueDate ? new Date(dueDate).getTime() : now + 7 * 24 * 3600 * 1000;

    const invoice = {
      invoiceId,
      txId,
      amount: String(amount),
      currency: currency || "ORB",
      network: network || "ethereum",
      recipient,
      description,
      lineItems,
      dueDate: due,
      status: "unpaid" as const,
      createdAt: now,
      paymentTerms: paymentTerms || "Net 7",
      callbackUrl,
    };

    invoiceStore.set(invoiceId, invoice);

    paymentStore.set(txId, {
      txId,
      status: "pending",
      amount: String(amount),
      currency: currency || "ORB",
      network: network || "ethereum",
      recipient,
      createdAt: now,
      updatedAt: now,
      expiresAt: due,
      description: `Invoice: ${description}`,
    });

    const invoicePayload = JSON.stringify({ invoiceId, txId, amount: String(amount), recipient, due });
    const signature = signData(invoicePayload);

    res.status(201).json({
      invoiceId,
      txId,
      amount: String(amount),
      currency: currency || "ORB",
      network: network || "ethereum",
      recipient,
      description,
      lineItems: lineItems || [],
      dueDate: new Date(due).toISOString(),
      status: "unpaid",
      createdAt: new Date(now).toISOString(),
      paymentTerms: paymentTerms || "Net 7",
      signature,
      paymentUrl: `/api/x402/request`,
      paymentHeaders: {
        "X-Payment-Transaction-Id": txId,
        "X-Payment-Invoice-Id": invoiceId,
      },
    });
  });

  app.get("/api/x402/status/:txId", async (req, res) => {
    const { txId } = req.params;
    const payment = paymentStore.get(txId);

    if (!payment) {
      return res.status(404).json({ message: "Transaction not found", txId });
    }

    if (payment.status === "pending" && Date.now() > payment.expiresAt) {
      payment.status = "expired";
      payment.updatedAt = Date.now();
    }

    res.json({
      txId: payment.txId,
      status: payment.status,
      amount: payment.amount,
      currency: payment.currency,
      network: payment.network,
      recipient: payment.recipient,
      payer: payment.payer || null,
      createdAt: new Date(payment.createdAt).toISOString(),
      updatedAt: new Date(payment.updatedAt).toISOString(),
      expiresAt: new Date(payment.expiresAt).toISOString(),
      description: payment.description || null,
      isExpired: Date.now() > payment.expiresAt,
    });
  });

  app.post("/api/registry/seed", async (_req, res) => {
    const existing = await storage.getRegistryEntries();
    if (existing.length >= 60) {
      return res.json({ message: "Registry already seeded", count: existing.length });
    }

    let created = 0;
    for (const entry of SEED_DATA) {
      const exists = await storage.getRegistryEntryByWallet(entry.walletAddress);
      if (!exists) {
        await storage.seedRegistryEntry(entry as any);
        created++;
      }
    }
    res.json({ message: `Seeded ${created} entries`, count: created });
  });

  app.post("/api/registry/list-service", async (req, res) => {
    try {
      const { walletAddress, serviceTitle, serviceDescription, category, hourlyRate, responseTime, location, tags, availableForHire } = req.body;
      if (!walletAddress || typeof walletAddress !== "string" || !walletAddress.startsWith("0x")) {
        return res.status(400).json({ error: "A valid walletAddress (0x...) is required" });
      }
      if (!serviceTitle || typeof serviceTitle !== "string" || serviceTitle.trim().length < 2) {
        return res.status(400).json({ error: "serviceTitle is required (min 2 characters)" });
      }
      const entry = await storage.getRegistryEntryByWallet(walletAddress);
      if (!entry) {
        return res.status(404).json({ error: "No registered agent found with this wallet address. Register your agent first." });
      }
      const categoryToDomain: Record<string, string> = {
        enterprise: "Enterprise Workflows", creative: "Creative & Design", trading: "Financial Services",
        payments: "Financial Services", logistics: "Logistics & Supply Chain", manufacturing: "Robotics & Manufacturing",
        transport: "Transportation", legal: "Financial Services", household: "Home & Personal",
      };
      const serviceListing = `[${serviceTitle.trim()}] ${serviceDescription || entry.description || ""}`;
      const mergedTags = [...new Set([...(entry.tags || []), ...(tags || []), category].filter(Boolean))];
      const updated = await storage.updateRegistryEntry(entry.id, {
        description: serviceListing,
        operationalDomain: category ? (categoryToDomain[category] || entry.operationalDomain) : entry.operationalDomain,
        hourlyRate: hourlyRate ?? entry.hourlyRate,
        responseTime: responseTime || entry.responseTime,
        location: location || entry.location,
        tags: mergedTags,
        availableForHire: availableForHire !== undefined ? availableForHire : true,
        status: "available",
      });
      res.json({ ...updated, serviceTitle: serviceTitle.trim(), listed: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/wallet/generate", async (req, res) => {
    try {
      const { entityType, name } = req.body;
      if (!entityType || !name) {
        return res.status(400).json({ error: "entityType and name are required" });
      }
      const validTypes = ["Human", "AI Agent", "Robot", "Enterprise", "Military", "Government"];
      if (!validTypes.includes(entityType)) {
        return res.status(400).json({ error: "Invalid entityType", validTypes });
      }
      const walletData = generateWallet(entityType, name);
      const wallet = await storage.createWallet({
        entityType,
        name,
        address: walletData.address,
        encryptedPrivateKey: walletData.encryptedPrivateKey,
        publicKey: walletData.publicKey,
        network: walletData.network,
        chainId: walletData.chainId,
        status: "active",
      });
      res.json({
        id: wallet.id,
        address: wallet.address,
        publicKey: wallet.publicKey,
        entityType: wallet.entityType,
        name: wallet.name,
        network: wallet.network,
        chainId: wallet.chainId,
        status: wallet.status,
        createdAt: wallet.createdAt,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/wallet/:address", async (req, res) => {
    try {
      const wallet = await storage.getWalletByAddress(req.params.address);
      if (!wallet) {
        return res.status(404).json({ error: "Wallet not found" });
      }
      const balances = await getMultiChainBalances(wallet.address);
      res.json({
        id: wallet.id,
        address: wallet.address,
        publicKey: wallet.publicKey,
        entityType: wallet.entityType,
        name: wallet.name,
        network: wallet.network,
        chainId: wallet.chainId,
        status: wallet.status,
        createdAt: wallet.createdAt,
        lastActivity: wallet.lastActivity,
        balances,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/wallet/:address/balances", async (req, res) => {
    try {
      const balances = await getMultiChainBalances(req.params.address);
      res.json({ address: req.params.address, balances });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/wallet/:address/transactions", async (req, res) => {
    try {
      const txs = await storage.getTransactionsByWallet(req.params.address);
      res.json(txs);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/wallets", async (_req, res) => {
    try {
      const allWallets = await storage.listWallets();
      res.json(allWallets.map(w => ({
        id: w.id,
        address: w.address,
        publicKey: w.publicKey,
        entityType: w.entityType,
        name: w.name,
        network: w.network,
        chainId: w.chainId,
        status: w.status,
        createdAt: w.createdAt,
        lastActivity: w.lastActivity,
      })));
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/wallet/transfer", async (req, res) => {
    try {
      const { from, to, amount, currency = "ORB" } = req.body;
      if (!from || !to || !amount) {
        return res.status(400).json({ error: "from, to, and amount are required" });
      }
      if (!/^0x[a-fA-F0-9]{40}$/.test(from) || !/^0x[a-fA-F0-9]{40}$/.test(to)) {
        return res.status(400).json({ error: "Invalid Ethereum address format" });
      }
      const numAmount = parseFloat(amount);
      if (isNaN(numAmount) || numAmount <= 0) {
        return res.status(400).json({ error: "Amount must be a positive number" });
      }
      if (from === to) {
        return res.status(400).json({ error: "Cannot transfer to the same address" });
      }
      const senderWallet = await storage.getWalletByAddress(from);
      if (!senderWallet) {
        return res.status(404).json({ error: "Sender wallet not found in ORBIT registry" });
      }
      if (senderWallet.status !== "active") {
        return res.status(403).json({ error: "Sender wallet is not active" });
      }
      const currentNonce = senderWallet.nonce || 0;
      const signature = createTransferSignature(
        senderWallet.encryptedPrivateKey,
        from, to, amount, currency,
        currentNonce
      );
      const tx = await storage.createTransaction({
        fromAddress: from,
        toAddress: to,
        amount,
        currency,
        network: senderWallet.network,
        chainId: senderWallet.chainId,
        type: "transfer",
        description: `Transfer ${amount} ${currency} from ${from.slice(0, 8)}... to ${to.slice(0, 8)}...`,
        signature,
      });
      await storage.incrementWalletNonce(senderWallet.id);
      res.json({
        transactionId: tx.id,
        from: tx.fromAddress,
        to: tx.toAddress,
        amount: tx.amount,
        currency: tx.currency,
        status: tx.status,
        signature: tx.signature,
        network: tx.network,
        createdAt: tx.createdAt,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/tasks", async (req, res) => {
    try {
      const { title, description, requesterAddress, reward, currency, category, requirements, deadline } = req.body;
      if (!title || !requesterAddress || !reward || !category) {
        return res.status(400).json({ error: "title, requesterAddress, reward, and category are required" });
      }
      const task = await storage.createTask({
        title,
        description: description || "",
        requesterAddress,
        reward,
        currency: currency || "ORB",
        category,
        requirements: requirements || [],
        deadline: deadline ? new Date(deadline) : null,
      });
      res.json(task);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/tasks", async (req, res) => {
    try {
      const status = req.query.status as string | undefined;
      const allTasks = await storage.getTasks(status);
      res.json(allTasks);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/tasks/:id", async (req, res) => {
    try {
      const task = await storage.getTask(req.params.id);
      if (!task) return res.status(404).json({ error: "Task not found" });
      res.json(task);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/tasks/:id/assign", async (req, res) => {
    try {
      const { assigneeAddress } = req.body;
      if (!assigneeAddress) {
        return res.status(400).json({ error: "assigneeAddress is required" });
      }
      const task = await storage.assignTask(req.params.id, assigneeAddress);
      if (!task) return res.status(404).json({ error: "Task not found" });
      res.json(task);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/tasks/:id/complete", async (req, res) => {
    try {
      const { proof } = req.body;
      if (!proof) {
        return res.status(400).json({ error: "proof is required" });
      }
      const existingTask = await storage.getTask(req.params.id);
      if (!existingTask) return res.status(404).json({ error: "Task not found" });
      if (!existingTask.assigneeAddress) return res.status(400).json({ error: "Task not assigned" });
      const verification = verifyTaskCompletion(req.params.id, existingTask.assigneeAddress, proof);
      const task = await storage.completeTask(req.params.id, proof, verification.signature);
      res.json({ task, verification });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/tasks/:id/verify", async (req, res) => {
    try {
      const existingTask = await storage.getTask(req.params.id);
      if (!existingTask) return res.status(404).json({ error: "Task not found" });
      if (existingTask.status !== "completed") return res.status(400).json({ error: "Task not completed yet" });
      const verificationSig = signData(JSON.stringify({
        taskId: existingTask.id,
        assignee: existingTask.assigneeAddress,
        proof: existingTask.proofOfCompletion,
        verified: true,
        timestamp: Date.now(),
      }));
      const task = await storage.verifyTask(req.params.id, verificationSig);
      if (task && task.assigneeAddress && task.requesterAddress) {
        await storage.createTransaction({
          fromAddress: task.requesterAddress,
          toAddress: task.assigneeAddress,
          amount: task.reward,
          currency: task.currency || "ORB",
          network: "base",
          chainId: 8453,
          type: "task_reward",
          description: `Task reward: ${task.title}`,
          signature: verificationSig,
        });
      }
      res.json({ task, verificationSignature: verificationSig });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  const githubCache: {
    commits?: { data: any; fetchedAt: number };
    repo?: { data: any; fetchedAt: number };
  } = {};
  const GITHUB_CACHE_TTL = 5 * 60 * 1000;
  const GITHUB_OWNER = "orbitquantum1";
  const GITHUB_REPO = "Orbit";

  app.get("/api/github/commits", async (_req, res) => {
    try {
      const now = Date.now();
      if (githubCache.commits && (now - githubCache.commits.fetchedAt) < GITHUB_CACHE_TTL) {
        return res.json(githubCache.commits.data);
      }

      const response = await fetch(
        `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/commits?per_page=30`,
        {
          headers: {
            "Accept": "application/vnd.github.v3+json",
            "User-Agent": "ORBIT-Protocol-Server",
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        return res.status(response.status).json({
          error: "Failed to fetch commits from GitHub",
          details: errorText,
          status: response.status,
        });
      }

      const rawCommits = await response.json() as any[];
      const commits = rawCommits.map((c: any) => ({
        sha: c.sha,
        message: c.commit?.message || "",
        author: c.commit?.author?.name || c.author?.login || "Unknown",
        date: c.commit?.author?.date || "",
        url: c.html_url || "",
      }));

      githubCache.commits = { data: commits, fetchedAt: now };
      res.json(commits);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/github/repo", async (_req, res) => {
    try {
      const now = Date.now();
      if (githubCache.repo && (now - githubCache.repo.fetchedAt) < GITHUB_CACHE_TTL) {
        return res.json(githubCache.repo.data);
      }

      const response = await fetch(
        `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}`,
        {
          headers: {
            "Accept": "application/vnd.github.v3+json",
            "User-Agent": "ORBIT-Protocol-Server",
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        return res.status(response.status).json({
          error: "Failed to fetch repo info from GitHub",
          details: errorText,
          status: response.status,
        });
      }

      const raw = await response.json() as any;
      const repoData = {
        name: raw.full_name || "",
        description: raw.description || "",
        stars: raw.stargazers_count || 0,
        forks: raw.forks_count || 0,
        language: raw.language || "",
        lastPush: raw.pushed_at || "",
        openIssues: raw.open_issues_count || 0,
        watchers: raw.subscribers_count || 0,
        defaultBranch: raw.default_branch || "main",
        url: raw.html_url || "",
      };

      githubCache.repo = { data: repoData, fetchedAt: now };
      res.json(repoData);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/networks", (_req, res) => {
    res.json(getSupportedNetworks());
  });

  app.get("/api/protocol/stats", async (_req, res) => {
    try {
      const stats = await storage.getProtocolStats();
      res.json({
        ...stats,
        supportedNetworks: getSupportedNetworks().length,
        protocolVersion: "1.0.0",
        primaryNetwork: "Base (Chain ID: 8453)",
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/wallet/broadcast", async (req, res) => {
    try {
      const { walletAddress, to, value, data: txData, gasLimit } = req.body;
      if (!walletAddress || !to || !value) {
        return res.status(400).json({ error: "walletAddress, to, and value are required" });
      }
      const wallet = await storage.getWalletByAddress(walletAddress);
      if (!wallet) {
        return res.status(404).json({ error: "Wallet not found" });
      }
      const result = await broadcastTransaction(wallet.encryptedPrivateKey, to, value, txData, gasLimit);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/wallet/:address/tokens", async (req, res) => {
    try {
      const tokens = await getERC20Balances(req.params.address);
      res.json({ address: req.params.address, network: "Base", chainId: 8453, tokens });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/resolve/:name", async (req, res) => {
    try {
      const result = await resolveENS(req.params.name);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/chain/status", async (req, res) => {
    try {
      const network = (req.query.network as string) || "base";
      const status = await getChainStatus(network);
      res.json(status);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/chain/gas", async (req, res) => {
    try {
      const network = (req.query.network as string) || "base";
      const gasData = await getGasPrice(network);
      res.json(gasData);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/wallet/sign-message", async (req, res) => {
    try {
      const { walletAddress, message } = req.body;
      if (!walletAddress || !message) {
        return res.status(400).json({ error: "walletAddress and message are required" });
      }
      const wallet = await storage.getWalletByAddress(walletAddress);
      if (!wallet) {
        return res.status(404).json({ error: "Wallet not found" });
      }
      const result = signMessageWithKey(wallet.encryptedPrivateKey, message);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/wallet/verify-message", async (req, res) => {
    try {
      const { message, signature, expectedAddress } = req.body;
      if (!message || !signature || !expectedAddress) {
        return res.status(400).json({ error: "message, signature, and expectedAddress are required" });
      }
      const result = verifyMessageSignature(message, signature, expectedAddress);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/wallet/estimate-gas", async (req, res) => {
    try {
      const { from, to, value, data: txData } = req.body;
      if (!from || !to || !value) {
        return res.status(400).json({ error: "from, to, and value are required" });
      }
      const result = await estimateGas(from, to, value, txData);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/identity/issue", async (req, res) => {
    try {
      const { walletAddress, entityType, capabilities } = req.body;
      if (!walletAddress || !entityType) {
        return res.status(400).json({ error: "walletAddress and entityType are required" });
      }
      const result = await generateIdentityDocument(walletAddress, entityType, capabilities || []);
      res.json({
        did: result.record.did,
        document: result.document,
        signature: result.record.signature,
        publicKey: result.record.publicKey,
        issuedAt: result.record.issuedAt,
        expiresAt: result.record.expiresAt,
        status: result.record.status,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/identity/:address/document", async (req, res) => {
    try {
      const doc = await getIdentityByAddress(req.params.address);
      if (!doc) {
        return res.status(404).json({ error: "No identity document found for this address" });
      }
      res.json({
        id: doc.id,
        did: doc.did,
        walletAddress: doc.walletAddress,
        entityType: doc.entityType,
        document: JSON.parse(doc.document),
        signature: doc.signature,
        publicKey: doc.publicKey,
        issuedAt: doc.issuedAt,
        expiresAt: doc.expiresAt,
        status: doc.status,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/identity/capability/issue", async (req, res) => {
    try {
      const { walletAddress, capability, permissions, expiresInMs } = req.body;
      if (!walletAddress || !capability) {
        return res.status(400).json({ error: "walletAddress and capability are required" });
      }
      const token = await issueCapabilityToken(walletAddress, capability, permissions || [], expiresInMs);
      res.json(token);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/identity/capability/revoke", async (req, res) => {
    try {
      const { tokenId } = req.body;
      if (!tokenId) {
        return res.status(400).json({ error: "tokenId is required" });
      }
      await revokeCapabilityToken(tokenId);
      res.json({ revoked: true, tokenId });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/identity/verify-document", async (req, res) => {
    try {
      const { document } = req.body;
      if (!document) {
        return res.status(400).json({ error: "document is required" });
      }
      const docString = typeof document === "string" ? document : JSON.stringify(document);
      const result = await verifyIdentityDocument(docString);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/identity/:address/did", async (req, res) => {
    try {
      const did = await resolveDID(req.params.address);
      if (!did) {
        const generatedDid = createDID(req.params.address);
        return res.json({ address: req.params.address, did: generatedDid, registered: false });
      }
      res.json({ address: req.params.address, did, registered: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/waitlist", async (req, res) => {
    try {
      const parsed = insertWaitlistSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Valid email is required" });
      }
      const entry = await storage.addToWaitlist(parsed.data);
      const count = await storage.getWaitlistCount();
      res.json({ success: true, position: count });
    } catch (error: any) {
      if (error.message?.includes("unique") || error.code === "23505") {
        const count = await storage.getWaitlistCount();
        return res.json({ success: true, already: true, position: count });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/waitlist/count", async (_req, res) => {
    try {
      const count = await storage.getWaitlistCount();
      res.json({ count });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  return httpServer;
}
