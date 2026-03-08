import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const BASE_URL = process.env.ORBIT_API_URL || "http://localhost:5000";

async function apiRequest(method: string, path: string, body?: unknown): Promise<unknown> {
  const url = `${BASE_URL}${path}`;
  const options: RequestInit = {
    method,
    headers: { "Content-Type": "application/json" },
  };
  if (body) {
    options.body = JSON.stringify(body);
  }
  const response = await fetch(url, options);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API error ${response.status}: ${errorText}`);
  }
  return response.json();
}

const server = new Server(
  {
    name: "orbit-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "orbit_register_agent",
        description:
          "Register a new AI agent or robot in the ORBIT decentralized registry. Provides the agent with a unique identity, wallet address, and makes it discoverable by other agents.",
        inputSchema: {
          type: "object" as const,
          properties: {
            entityType: {
              type: "string",
              description: "Type of entity: 'AI Agent', 'Robot', 'IoT Device', or 'Human Operator'",
            },
            name: {
              type: "string",
              description: "Display name of the agent",
            },
            description: {
              type: "string",
              description: "Description of the agent's capabilities and purpose",
            },
            capabilities: {
              type: "array",
              items: { type: "string" },
              description: "List of capabilities (e.g., 'Natural Language Processing', 'Computer Vision')",
            },
            manufacturer: {
              type: "string",
              description: "Organization or individual that created the agent",
            },
            model: {
              type: "string",
              description: "Model name or version",
            },
            operationalDomain: {
              type: "string",
              description: "Primary domain of operation (e.g., 'Enterprise Workflows', 'Financial Services')",
            },
            hourlyRate: {
              type: "number",
              description: "Hourly rate in USD for hiring this agent",
            },
            tags: {
              type: "array",
              items: { type: "string" },
              description: "Searchable tags for discovery",
            },
          },
          required: ["entityType", "name"],
        },
      },
      {
        name: "orbit_generate_wallet",
        description:
          "Generate a new multi-chain crypto wallet for an agent. The wallet supports Ethereum, Base, Polygon, Arbitrum, and Optimism networks.",
        inputSchema: {
          type: "object" as const,
          properties: {
            entityType: {
              type: "string",
              description: "Type of entity: 'AI Agent', 'Robot', 'IoT Device', or 'Human Operator'",
            },
            name: {
              type: "string",
              description: "Name to associate with the wallet",
            },
            network: {
              type: "string",
              description: "Blockchain network (default: 'base'). Options: ethereum, base, polygon, arbitrum, optimism",
            },
          },
          required: ["entityType", "name"],
        },
      },
      {
        name: "orbit_check_balance",
        description:
          "Check the balance of a wallet address across supported blockchain networks, including native tokens and ERC-20 tokens.",
        inputSchema: {
          type: "object" as const,
          properties: {
            address: {
              type: "string",
              description: "The wallet address to check the balance for",
            },
          },
          required: ["address"],
        },
      },
      {
        name: "orbit_send_payment",
        description:
          "Initiate a payment or settlement between agents on the ORBIT network. Supports cross-chain transfers with automatic bridging.",
        inputSchema: {
          type: "object" as const,
          properties: {
            fromAddress: {
              type: "string",
              description: "Sender wallet address",
            },
            toAddress: {
              type: "string",
              description: "Recipient wallet address",
            },
            amount: {
              type: "string",
              description: "Amount to send (as string to preserve precision)",
            },
            currency: {
              type: "string",
              description: "Currency to send (default: 'ETH')",
            },
            network: {
              type: "string",
              description: "Network to use (default: 'base')",
            },
            memo: {
              type: "string",
              description: "Optional memo or description for the payment",
            },
          },
          required: ["fromAddress", "toAddress", "amount"],
        },
      },
      {
        name: "orbit_mint_identity",
        description:
          "Issue a decentralized identity document (DID) for an agent. This creates a verifiable credential that proves the agent's identity and capabilities on-chain.",
        inputSchema: {
          type: "object" as const,
          properties: {
            walletAddress: {
              type: "string",
              description: "Wallet address to associate with the identity",
            },
            entityType: {
              type: "string",
              description: "Type of entity",
            },
            name: {
              type: "string",
              description: "Name for the identity document",
            },
            capabilities: {
              type: "array",
              items: { type: "string" },
              description: "Capabilities to attest in the identity document",
            },
          },
          required: ["walletAddress", "entityType", "name"],
        },
      },
      {
        name: "orbit_search_agents",
        description:
          "Search the ORBIT registry for agents by type, capabilities, tags, or availability. Returns matching agents with their profiles and contact information.",
        inputSchema: {
          type: "object" as const,
          properties: {
            query: {
              type: "string",
              description: "Search query to match against agent names, descriptions, and tags",
            },
            entityType: {
              type: "string",
              description: "Filter by entity type (e.g., 'AI Agent', 'Robot')",
            },
            capabilities: {
              type: "array",
              items: { type: "string" },
              description: "Filter by required capabilities",
            },
            availableForHire: {
              type: "boolean",
              description: "Filter to only show agents available for hire",
            },
            maxHourlyRate: {
              type: "number",
              description: "Maximum hourly rate filter",
            },
          },
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "orbit_register_agent": {
        const walletResult = await apiRequest("POST", "/api/wallet/generate", {
          entityType: args?.entityType || "AI Agent",
          name: args?.name || "Unnamed Agent",
          network: "base",
        }) as { address: string };

        const registryResult = await apiRequest("POST", "/api/registry", {
          entityType: args?.entityType || "AI Agent",
          name: args?.name || "Unnamed Agent",
          walletAddress: walletResult.address,
          description: args?.description || "",
          capabilities: args?.capabilities || [],
          manufacturer: args?.manufacturer || "",
          model: args?.model || "",
          operationalDomain: args?.operationalDomain || "General Purpose",
          hourlyRate: args?.hourlyRate || 0,
          tags: args?.tags || [],
          availableForHire: true,
          status: "available",
        });

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(
                {
                  success: true,
                  wallet: { address: walletResult.address },
                  registry: registryResult,
                },
                null,
                2
              ),
            },
          ],
        };
      }

      case "orbit_generate_wallet": {
        const result = await apiRequest("POST", "/api/wallet/generate", {
          entityType: args?.entityType || "AI Agent",
          name: args?.name || "Unnamed Wallet",
          network: args?.network || "base",
        });

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "orbit_check_balance": {
        const address = args?.address as string;
        if (!address) {
          throw new Error("address is required");
        }

        const [walletInfo, balances, tokens] = await Promise.all([
          apiRequest("GET", `/api/wallet/${address}`).catch(() => null),
          apiRequest("GET", `/api/wallet/${address}/balances`).catch(() => null),
          apiRequest("GET", `/api/wallet/${address}/tokens`).catch(() => null),
        ]);

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(
                {
                  wallet: walletInfo,
                  balances,
                  tokens,
                },
                null,
                2
              ),
            },
          ],
        };
      }

      case "orbit_send_payment": {
        const fromAddress = args?.fromAddress as string;
        const toAddress = args?.toAddress as string;
        const amount = args?.amount as string;

        if (!fromAddress || !toAddress || !amount) {
          throw new Error("fromAddress, toAddress, and amount are required");
        }

        const result = await apiRequest("POST", "/api/settlement/initiate", {
          fromAddress,
          toAddress,
          amount,
          currency: args?.currency || "ETH",
          network: args?.network || "base",
          description: args?.memo || "",
        });

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "orbit_mint_identity": {
        const walletAddress = args?.walletAddress as string;
        if (!walletAddress) {
          throw new Error("walletAddress is required");
        }

        const result = await apiRequest("POST", "/api/identity/issue", {
          walletAddress,
          entityType: args?.entityType || "AI Agent",
          name: args?.name || "Unnamed Entity",
          capabilities: args?.capabilities || [],
        });

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "orbit_search_agents": {
        const registryEntries = (await apiRequest("GET", "/api/registry")) as Array<Record<string, unknown>>;

        let results = registryEntries;

        if (args?.entityType) {
          results = results.filter(
            (e) => e.entityType === args.entityType
          );
        }

        if (args?.availableForHire !== undefined) {
          results = results.filter(
            (e) => e.availableForHire === args.availableForHire
          );
        }

        if (args?.maxHourlyRate !== undefined) {
          results = results.filter(
            (e) => typeof e.hourlyRate === "number" && e.hourlyRate <= (args.maxHourlyRate as number)
          );
        }

        if (args?.capabilities && Array.isArray(args.capabilities)) {
          const requiredCaps = args.capabilities as string[];
          results = results.filter((e) => {
            const agentCaps = e.capabilities as string[] | undefined;
            if (!agentCaps) return false;
            return requiredCaps.some((cap) => agentCaps.includes(cap));
          });
        }

        if (args?.query) {
          const query = (args.query as string).toLowerCase();
          results = results.filter((e) => {
            const name = (e.name as string || "").toLowerCase();
            const description = (e.description as string || "").toLowerCase();
            const tags = (e.tags as string[] || []).map((t) => t.toLowerCase());
            return (
              name.includes(query) ||
              description.includes(query) ||
              tags.some((t) => t.includes(query))
            );
          });
        }

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(
                {
                  totalResults: results.length,
                  agents: results.slice(0, 20),
                },
                null,
                2
              ),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify({ error: errorMessage }, null, 2),
        },
      ],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("ORBIT MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
