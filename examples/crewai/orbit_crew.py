"""
CrewAI Multi-Agent Crew with ORBIT Wallets
============================================
A CrewAI crew where each agent has its own ORBIT wallet for
autonomous payments and identity verification on the decentralized network.

Requirements:
    pip install crewai crewai-tools orbit-sdk

Usage:
    export OPENAI_API_KEY="sk-..."
    export ORBIT_API_URL="https://your-orbit-instance.com"
    export ORBIT_API_KEY="your-api-key"
    python orbit_crew.py
"""

from __future__ import annotations

import asyncio
import os
from typing import Any, Optional, Type

from crewai import Agent, Crew, Process, Task
from crewai.tools import BaseTool
from pydantic import BaseModel, Field

from orbit_sdk import OrbitClient


ORBIT_URL = os.environ.get("ORBIT_API_URL", "http://localhost:5000")
ORBIT_KEY = os.environ.get("ORBIT_API_KEY", "")


def get_orbit_client() -> OrbitClient:
    return OrbitClient(base_url=ORBIT_URL, api_key=ORBIT_KEY)


class OnboardAgentInput(BaseModel):
    name: str = Field(description="Agent display name")
    entity_type: str = Field(default="AI Agent", description="Entity type")
    description: Optional[str] = Field(default=None, description="Agent description")
    capabilities: Optional[list[str]] = Field(default=None, description="Agent capabilities list")


class OnboardAgentTool(BaseTool):
    name: str = "Onboard Agent"
    description: str = (
        "Register a new agent on the ORBIT platform with a wallet, identity, and registry entry in one call."
    )
    args_schema: Type[BaseModel] = OnboardAgentInput

    def _run(self, name: str, entity_type: str = "AI Agent", description: Optional[str] = None, capabilities: Optional[list[str]] = None) -> str:
        async def _do() -> str:
            async with get_orbit_client() as client:
                payload: dict[str, Any] = {"name": name, "entityType": entity_type}
                if description:
                    payload["description"] = description
                if capabilities:
                    payload["capabilities"] = capabilities
                result = await client._request("POST", "/api/registry/onboard", json=payload)
                wallet = result["wallet"]
                identity = result["identity"]
                return (
                    f"Agent onboarded successfully.\n"
                    f"Wallet: {wallet['address']}\n"
                    f"DID: {identity['did']}\n"
                    f"Network: {wallet['network']}"
                )
        return asyncio.run(_do())


class SendPaymentInput(BaseModel):
    from_address: str = Field(description="Sender wallet address")
    to_address: str = Field(description="Recipient wallet address")
    amount: str = Field(description="Amount to send")
    description: Optional[str] = Field(default=None, description="Payment memo")


class SendPaymentTool(BaseTool):
    name: str = "Send Payment"
    description: str = "Send an ORB payment from one ORBIT wallet to another."
    args_schema: Type[BaseModel] = SendPaymentInput

    def _run(self, from_address: str, to_address: str, amount: str, description: Optional[str] = None) -> str:
        async def _do() -> str:
            async with get_orbit_client() as client:
                tx = await client.pay(
                    from_address=from_address,
                    to_address=to_address,
                    amount=amount,
                    description=description,
                )
                return (
                    f"Payment of {tx['amount']} {tx['currency']} sent.\n"
                    f"Status: {tx['status']}\n"
                    f"TX: {tx.get('txHash', 'pending')}"
                )
        return asyncio.run(_do())


class CheckBalanceInput(BaseModel):
    address: str = Field(description="Wallet address")


class CheckBalanceTool(BaseTool):
    name: str = "Check Balance"
    description: str = "Check the ORB token balance of an ORBIT wallet."
    args_schema: Type[BaseModel] = CheckBalanceInput

    def _run(self, address: str) -> str:
        async def _do() -> str:
            async with get_orbit_client() as client:
                result = await client.get_balance(address)
                return f"Balance: {result['balance']} on {result['network']}"
        return asyncio.run(_do())


class SearchAgentsInput(BaseModel):
    query: Optional[str] = Field(default=None, description="Search query")
    capability: Optional[str] = Field(default=None, description="Required capability")


class SearchAgentsTool(BaseTool):
    name: str = "Search Agents"
    description: str = "Search the ORBIT registry for available agents."
    args_schema: Type[BaseModel] = SearchAgentsInput

    def _run(self, query: Optional[str] = None, capability: Optional[str] = None) -> str:
        async def _do() -> str:
            async with get_orbit_client() as client:
                results = await client.search_agents(query=query, capability=capability, limit=5)
                agents = results if isinstance(results, list) else results.get("entries", [])
                if not agents:
                    return "No agents found."
                lines = []
                for a in agents:
                    lines.append(f"- {a['name']} | {a['walletAddress']} | Trust: {a.get('trustScore', 'N/A')}")
                return "\n".join(lines)
        return asyncio.run(_do())


def build_orbit_crew() -> Crew:
    orbit_tools = [
        OnboardAgentTool(),
        SendPaymentTool(),
        CheckBalanceTool(),
        SearchAgentsTool(),
    ]

    coordinator = Agent(
        role="Crew Coordinator",
        goal="Manage the multi-agent crew, assign tasks, and handle payments between agents using ORBIT wallets.",
        backstory=(
            "You are the lead coordinator of an AI agent crew operating on the ORBIT "
            "decentralized platform. You manage wallets, delegate work, and ensure "
            "agents are compensated for completed tasks."
        ),
        tools=orbit_tools,
        verbose=True,
    )

    researcher = Agent(
        role="Research Analyst",
        goal="Find and analyze information, then report findings to the coordinator.",
        backstory=(
            "You are a research specialist in the ORBIT crew. You search for relevant "
            "agents and data on the network to support the team's objectives."
        ),
        tools=[SearchAgentsTool()],
        verbose=True,
    )

    treasurer = Agent(
        role="Treasury Manager",
        goal="Monitor balances, process payments, and ensure financial operations run smoothly.",
        backstory=(
            "You are the financial officer of the ORBIT crew. You track wallet balances, "
            "process payments between agents, and maintain financial records."
        ),
        tools=[SendPaymentTool(), CheckBalanceTool()],
        verbose=True,
    )

    setup_task = Task(
        description=(
            "Onboard all crew members onto the ORBIT platform. Create wallets for "
            "'CrewCoordinator', 'ResearchAnalyst', and 'TreasuryManager'. "
            "Report back each agent's wallet address."
        ),
        expected_output="A list of all crew members with their ORBIT wallet addresses.",
        agent=coordinator,
    )

    research_task = Task(
        description=(
            "Search the ORBIT registry for agents with 'data-analysis' capabilities. "
            "Compile a shortlist of the top candidates with their trust scores and wallet addresses."
        ),
        expected_output="A ranked list of data analysis agents with trust scores and wallet addresses.",
        agent=researcher,
    )

    payment_task = Task(
        description=(
            "Check the coordinator's wallet balance. If sufficient funds exist, "
            "send a 5 ORB payment to the research analyst's wallet as compensation "
            "for the research task. Report the transaction status."
        ),
        expected_output="Transaction confirmation with amount, recipient, and status.",
        agent=treasurer,
    )

    return Crew(
        agents=[coordinator, researcher, treasurer],
        tasks=[setup_task, research_task, payment_task],
        process=Process.sequential,
        verbose=True,
    )


def main() -> None:
    print("ORBIT CrewAI Multi-Agent Crew")
    print("=" * 40)

    crew = build_orbit_crew()
    result = crew.kickoff()

    print("\nCrew Result:")
    print(result)


if __name__ == "__main__":
    main()
