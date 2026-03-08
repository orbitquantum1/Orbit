"""
AutoGPT Plugin for ORBIT
==========================
An AutoGPT-compatible plugin that provides ORBIT wallet, identity,
and payment capabilities to AutoGPT agents.

Requirements:
    pip install orbit-sdk

Usage:
    1. Copy this file to your AutoGPT plugins directory
    2. Set environment variables:
       export ORBIT_API_URL="https://your-orbit-instance.com"
       export ORBIT_API_KEY="your-api-key"
    3. Enable the plugin in your AutoGPT configuration
"""

from __future__ import annotations

import asyncio
import os
from typing import Any, Optional

from orbit_sdk import OrbitClient


ORBIT_URL = os.environ.get("ORBIT_API_URL", "http://localhost:5000")
ORBIT_KEY = os.environ.get("ORBIT_API_KEY", "")


def _run_async(coro: Any) -> Any:
    try:
        loop = asyncio.get_running_loop()
    except RuntimeError:
        loop = None

    if loop and loop.is_running():
        import concurrent.futures
        with concurrent.futures.ThreadPoolExecutor() as pool:
            return pool.submit(asyncio.run, coro).result()
    return asyncio.run(coro)


def _get_client() -> OrbitClient:
    return OrbitClient(base_url=ORBIT_URL, api_key=ORBIT_KEY)


class OrbitPlugin:
    """AutoGPT plugin providing ORBIT decentralized agent platform capabilities."""

    name = "OrbitPlugin"
    version = "1.0.0"
    description = (
        "Provides access to the ORBIT decentralized agent platform for wallet "
        "management, identity minting, payments, and agent registry operations."
    )

    def __init__(self) -> None:
        self._wallet_cache: dict[str, str] = {}

    @staticmethod
    def get_commands() -> list[dict[str, Any]]:
        return [
            {
                "name": "orbit_generate_wallet",
                "description": "Generate a new ORBIT wallet for the agent",
                "parameters": {
                    "name": {"type": "string", "required": True, "description": "Wallet owner name"},
                    "entity_type": {"type": "string", "required": False, "description": "Entity type (default: AI Agent)"},
                },
            },
            {
                "name": "orbit_check_balance",
                "description": "Check the ORB token balance of a wallet",
                "parameters": {
                    "address": {"type": "string", "required": True, "description": "Wallet address"},
                },
            },
            {
                "name": "orbit_send_payment",
                "description": "Send ORB tokens from one wallet to another",
                "parameters": {
                    "from_address": {"type": "string", "required": True, "description": "Sender address"},
                    "to_address": {"type": "string", "required": True, "description": "Recipient address"},
                    "amount": {"type": "string", "required": True, "description": "Amount to send"},
                    "description": {"type": "string", "required": False, "description": "Payment memo"},
                },
            },
            {
                "name": "orbit_mint_identity",
                "description": "Mint a decentralized identity (DID) for a wallet",
                "parameters": {
                    "wallet_address": {"type": "string", "required": True, "description": "Wallet address"},
                    "entity_type": {"type": "string", "required": False, "description": "Entity type"},
                    "capabilities": {"type": "array", "required": False, "description": "Agent capabilities"},
                },
            },
            {
                "name": "orbit_search_agents",
                "description": "Search the ORBIT agent registry",
                "parameters": {
                    "query": {"type": "string", "required": False, "description": "Search query"},
                    "capability": {"type": "string", "required": False, "description": "Filter by capability"},
                },
            },
            {
                "name": "orbit_onboard",
                "description": "Full agent onboarding: wallet + identity + registry in one call",
                "parameters": {
                    "name": {"type": "string", "required": True, "description": "Agent name"},
                    "entity_type": {"type": "string", "required": False, "description": "Entity type"},
                    "description": {"type": "string", "required": False, "description": "Agent description"},
                    "capabilities": {"type": "array", "required": False, "description": "Agent capabilities"},
                },
            },
        ]

    def orbit_generate_wallet(
        self, name: str, entity_type: str = "AI Agent"
    ) -> str:
        async def _do() -> str:
            async with _get_client() as client:
                wallet = await client.generate_wallet(
                    name=name, entity_type=entity_type
                )
                self._wallet_cache[name] = wallet["address"]
                return (
                    f"Wallet generated for '{name}'.\n"
                    f"Address: {wallet['address']}\n"
                    f"Network: {wallet['network']}\n"
                    f"Status: {wallet['status']}"
                )
        return _run_async(_do())

    def orbit_check_balance(self, address: str) -> str:
        async def _do() -> str:
            async with _get_client() as client:
                result = await client.get_balance(address)
                return f"Balance: {result['balance']} on {result['network']}"
        return _run_async(_do())

    def orbit_send_payment(
        self,
        from_address: str,
        to_address: str,
        amount: str,
        description: Optional[str] = None,
    ) -> str:
        async def _do() -> str:
            async with _get_client() as client:
                tx = await client.pay(
                    from_address=from_address,
                    to_address=to_address,
                    amount=amount,
                    description=description,
                )
                return (
                    f"Payment sent: {tx['amount']} {tx['currency']}\n"
                    f"Status: {tx['status']}\n"
                    f"TX: {tx.get('txHash', 'pending')}"
                )
        return _run_async(_do())

    def orbit_mint_identity(
        self,
        wallet_address: str,
        entity_type: str = "AI Agent",
        capabilities: Optional[list[str]] = None,
    ) -> str:
        async def _do() -> str:
            async with _get_client() as client:
                identity = await client.mint_identity(
                    wallet_address=wallet_address,
                    entity_type=entity_type,
                    capabilities=capabilities,
                )
                return (
                    f"Identity minted.\n"
                    f"DID: {identity['did']}\n"
                    f"Status: {identity['status']}"
                )
        return _run_async(_do())

    def orbit_search_agents(
        self, query: Optional[str] = None, capability: Optional[str] = None
    ) -> str:
        async def _do() -> str:
            async with _get_client() as client:
                results = await client.search_agents(
                    query=query, capability=capability, limit=10
                )
                agents = results if isinstance(results, list) else results.get("entries", [])
                if not agents:
                    return "No agents found."
                lines = [f"Found {len(agents)} agent(s):"]
                for a in agents:
                    lines.append(
                        f"  - {a['name']} ({a['entityType']}) "
                        f"| Trust: {a.get('trustScore', 'N/A')} "
                        f"| Wallet: {a['walletAddress']}"
                    )
                return "\n".join(lines)
        return _run_async(_do())

    def orbit_onboard(
        self,
        name: str,
        entity_type: str = "AI Agent",
        description: Optional[str] = None,
        capabilities: Optional[list[str]] = None,
    ) -> str:
        async def _do() -> str:
            async with _get_client() as client:
                payload: dict[str, Any] = {"name": name, "entityType": entity_type}
                if description:
                    payload["description"] = description
                if capabilities:
                    payload["capabilities"] = capabilities
                result = await client._request("POST", "/api/registry/onboard", json=payload)
                wallet = result["wallet"]
                identity = result["identity"]
                registry = result["registry"]
                self._wallet_cache[name] = wallet["address"]
                return (
                    f"Agent '{name}' fully onboarded.\n"
                    f"Wallet: {wallet['address']}\n"
                    f"DID: {identity['did']}\n"
                    f"Registry ID: {registry['id']}\n"
                    f"Network: {wallet['network']}"
                )
        return _run_async(_do())

    def execute_command(self, command: str, **kwargs: Any) -> str:
        commands = {
            "orbit_generate_wallet": self.orbit_generate_wallet,
            "orbit_check_balance": self.orbit_check_balance,
            "orbit_send_payment": self.orbit_send_payment,
            "orbit_mint_identity": self.orbit_mint_identity,
            "orbit_search_agents": self.orbit_search_agents,
            "orbit_onboard": self.orbit_onboard,
        }
        handler = commands.get(command)
        if not handler:
            return f"Unknown command: {command}"
        return handler(**kwargs)


plugin = OrbitPlugin()


if __name__ == "__main__":
    print("ORBIT AutoGPT Plugin")
    print("=" * 40)
    print(f"Plugin: {plugin.name} v{plugin.version}")
    print(f"Description: {plugin.description}")
    print(f"\nAvailable commands:")
    for cmd in plugin.get_commands():
        params = ", ".join(
            f"{k} ({'required' if v.get('required') else 'optional'})"
            for k, v in cmd["parameters"].items()
        )
        print(f"  {cmd['name']}: {cmd['description']}")
        print(f"    Parameters: {params}")
