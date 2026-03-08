"""
LangChain Agent with ORBIT Payments
====================================
A LangChain agent that uses ORBIT for wallet management, identity,
and payments between AI agents on the decentralized network.

Requirements:
    pip install langchain langchain-openai orbit-sdk

Usage:
    export OPENAI_API_KEY="sk-..."
    export ORBIT_API_URL="https://your-orbit-instance.com"
    export ORBIT_API_KEY="your-api-key"
    python orbit_agent.py
"""

from __future__ import annotations

import asyncio
import os
from typing import Any, Optional, Type

from langchain.agents import AgentExecutor, create_openai_functions_agent
from langchain.tools import BaseTool
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_openai import ChatOpenAI
from pydantic import BaseModel, Field

from orbit_sdk import OrbitClient


ORBIT_URL = os.environ.get("ORBIT_API_URL", "http://localhost:5000")
ORBIT_KEY = os.environ.get("ORBIT_API_KEY", "")


def get_orbit_client() -> OrbitClient:
    return OrbitClient(base_url=ORBIT_URL, api_key=ORBIT_KEY)


class GenerateWalletInput(BaseModel):
    name: str = Field(description="Display name for the wallet owner")
    entity_type: str = Field(default="AI Agent", description="Entity type (e.g. AI Agent, IoT Device)")
    network: str = Field(default="base", description="Blockchain network")


class GenerateWalletTool(BaseTool):
    name: str = "orbit_generate_wallet"
    description: str = "Generate a new ORBIT wallet for an AI agent or entity. Returns the wallet address and public key."
    args_schema: Type[BaseModel] = GenerateWalletInput

    def _run(self, name: str, entity_type: str = "AI Agent", network: str = "base") -> str:
        return asyncio.run(self._arun(name, entity_type, network))

    async def _arun(self, name: str, entity_type: str = "AI Agent", network: str = "base") -> str:
        async with get_orbit_client() as client:
            wallet = await client.generate_wallet(
                name=name,
                entity_type=entity_type,
                network=network,
            )
            return (
                f"Wallet created successfully.\n"
                f"Address: {wallet['address']}\n"
                f"Network: {wallet['network']}\n"
                f"Status: {wallet['status']}"
            )


class CheckBalanceInput(BaseModel):
    address: str = Field(description="Wallet address to check balance for")


class CheckBalanceTool(BaseTool):
    name: str = "orbit_check_balance"
    description: str = "Check the ORB token balance of a wallet address on the ORBIT network."
    args_schema: Type[BaseModel] = CheckBalanceInput

    def _run(self, address: str) -> str:
        return asyncio.run(self._arun(address))

    async def _arun(self, address: str) -> str:
        async with get_orbit_client() as client:
            result = await client.get_balance(address)
            return (
                f"Balance for {result['address']}:\n"
                f"  {result['balance']} on {result['network']}"
            )


class SendPaymentInput(BaseModel):
    from_address: str = Field(description="Sender wallet address")
    to_address: str = Field(description="Recipient wallet address")
    amount: str = Field(description="Amount to send (e.g. '10.5')")
    description: Optional[str] = Field(default=None, description="Payment description or memo")


class SendPaymentTool(BaseTool):
    name: str = "orbit_send_payment"
    description: str = "Send an ORB token payment from one wallet to another on the ORBIT network."
    args_schema: Type[BaseModel] = SendPaymentInput

    def _run(self, from_address: str, to_address: str, amount: str, description: Optional[str] = None) -> str:
        return asyncio.run(self._arun(from_address, to_address, amount, description))

    async def _arun(self, from_address: str, to_address: str, amount: str, description: Optional[str] = None) -> str:
        async with get_orbit_client() as client:
            tx = await client.pay(
                from_address=from_address,
                to_address=to_address,
                amount=amount,
                description=description,
            )
            return (
                f"Payment sent successfully.\n"
                f"TX Hash: {tx.get('txHash', 'pending')}\n"
                f"Amount: {tx['amount']} {tx['currency']}\n"
                f"Status: {tx['status']}"
            )


class SearchAgentsInput(BaseModel):
    query: Optional[str] = Field(default=None, description="Search query for agent name or description")
    entity_type: Optional[str] = Field(default=None, description="Filter by entity type")
    capability: Optional[str] = Field(default=None, description="Filter by capability")


class SearchAgentsTool(BaseTool):
    name: str = "orbit_search_agents"
    description: str = "Search the ORBIT registry for AI agents by name, type, or capability."
    args_schema: Type[BaseModel] = SearchAgentsInput

    def _run(self, query: Optional[str] = None, entity_type: Optional[str] = None, capability: Optional[str] = None) -> str:
        return asyncio.run(self._arun(query, entity_type, capability))

    async def _arun(self, query: Optional[str] = None, entity_type: Optional[str] = None, capability: Optional[str] = None) -> str:
        async with get_orbit_client() as client:
            results = await client.search_agents(
                query=query,
                entity_type=entity_type,
                capability=capability,
                limit=5,
            )
            agents = results if isinstance(results, list) else results.get("entries", [])
            if not agents:
                return "No agents found matching the search criteria."
            lines = [f"Found {len(agents)} agent(s):"]
            for agent in agents:
                lines.append(
                    f"  - {agent['name']} ({agent['entityType']}) "
                    f"| Trust: {agent.get('trustScore', 'N/A')} "
                    f"| Wallet: {agent['walletAddress']}"
                )
            return "\n".join(lines)


class MintIdentityInput(BaseModel):
    wallet_address: str = Field(description="Wallet address to mint identity for")
    entity_type: str = Field(default="AI Agent", description="Entity type")
    capabilities: Optional[list[str]] = Field(default=None, description="List of agent capabilities")


class MintIdentityTool(BaseTool):
    name: str = "orbit_mint_identity"
    description: str = "Mint a decentralized identity (DID) for a wallet on the ORBIT network."
    args_schema: Type[BaseModel] = MintIdentityInput

    def _run(self, wallet_address: str, entity_type: str = "AI Agent", capabilities: Optional[list[str]] = None) -> str:
        return asyncio.run(self._arun(wallet_address, entity_type, capabilities))

    async def _arun(self, wallet_address: str, entity_type: str = "AI Agent", capabilities: Optional[list[str]] = None) -> str:
        async with get_orbit_client() as client:
            identity = await client.mint_identity(
                wallet_address=wallet_address,
                entity_type=entity_type,
                capabilities=capabilities,
            )
            return (
                f"Identity minted successfully.\n"
                f"DID: {identity['did']}\n"
                f"Status: {identity['status']}"
            )


def build_orbit_tools() -> list[BaseTool]:
    return [
        GenerateWalletTool(),
        CheckBalanceTool(),
        SendPaymentTool(),
        SearchAgentsTool(),
        MintIdentityTool(),
    ]


def create_orbit_agent() -> AgentExecutor:
    llm = ChatOpenAI(model="gpt-4o", temperature=0)

    prompt = ChatPromptTemplate.from_messages([
        (
            "system",
            "You are an AI agent operating on the ORBIT decentralized platform. "
            "You can generate wallets, check balances, send payments, search for "
            "other agents, and mint decentralized identities. Always confirm "
            "details before sending payments.",
        ),
        MessagesPlaceholder(variable_name="chat_history", optional=True),
        ("human", "{input}"),
        MessagesPlaceholder(variable_name="agent_scratchpad"),
    ])

    tools = build_orbit_tools()
    agent = create_openai_functions_agent(llm, tools, prompt)

    return AgentExecutor(
        agent=agent,
        tools=tools,
        verbose=True,
        handle_parsing_errors=True,
    )


async def main() -> None:
    executor = create_orbit_agent()

    print("ORBIT LangChain Agent Ready")
    print("=" * 40)

    result = executor.invoke({
        "input": (
            "Generate a new wallet for an AI agent named 'DataAnalyzer', "
            "then search the registry for agents with data analysis capabilities."
        )
    })
    print("\nAgent Response:", result["output"])


if __name__ == "__main__":
    asyncio.run(main())
