from __future__ import annotations

from typing import Any, Optional

import httpx


class OrbitClient:
    """Async Python client for the ORBIT decentralized agent platform API."""

    def __init__(self, base_url: str, api_key: Optional[str] = None, timeout: float = 30.0) -> None:
        headers: dict[str, str] = {"Content-Type": "application/json"}
        if api_key:
            headers["Authorization"] = f"Bearer {api_key}"
        self._client = httpx.AsyncClient(base_url=base_url, headers=headers, timeout=timeout)

    async def close(self) -> None:
        await self._client.aclose()

    async def __aenter__(self) -> "OrbitClient":
        return self

    async def __aexit__(self, *args: Any) -> None:
        await self.close()

    async def _request(self, method: str, path: str, **kwargs: Any) -> Any:
        resp = await self._client.request(method, path, **kwargs)
        resp.raise_for_status()
        if resp.status_code == 204:
            return None
        return resp.json()

    async def register_agent(
        self,
        *,
        name: str,
        entity_type: str = "AI Agent",
        wallet_address: str,
        description: Optional[str] = None,
        capabilities: Optional[list[str]] = None,
        manufacturer: Optional[str] = None,
        model: Optional[str] = None,
        operational_domain: Optional[str] = None,
        visibility: str = "public",
        status: str = "available",
        hourly_rate: Optional[float] = None,
        response_time: Optional[str] = None,
        location: Optional[str] = None,
        languages: Optional[list[str]] = None,
        tags: Optional[list[str]] = None,
        available_for_hire: bool = True,
    ) -> dict[str, Any]:
        payload: dict[str, Any] = {
            "name": name,
            "entityType": entity_type,
            "walletAddress": wallet_address,
        }
        optionals: dict[str, Any] = {
            "description": description,
            "capabilities": capabilities,
            "manufacturer": manufacturer,
            "model": model,
            "operationalDomain": operational_domain,
            "visibility": visibility,
            "status": status,
            "hourlyRate": hourly_rate,
            "responseTime": response_time,
            "location": location,
            "languages": languages,
            "tags": tags,
            "availableForHire": available_for_hire,
        }
        payload.update({k: v for k, v in optionals.items() if v is not None})
        return await self._request("POST", "/api/registry", json=payload)

    async def generate_wallet(
        self,
        *,
        entity_type: str = "AI Agent",
        name: str,
        network: str = "base",
        chain_id: int = 8453,
    ) -> dict[str, Any]:
        return await self._request(
            "POST",
            "/api/wallet/generate",
            json={
                "entityType": entity_type,
                "name": name,
                "network": network,
                "chainId": chain_id,
            },
        )

    async def mint_identity(
        self,
        *,
        wallet_address: str,
        entity_type: str = "AI Agent",
        capabilities: Optional[list[str]] = None,
    ) -> dict[str, Any]:
        payload: dict[str, Any] = {
            "walletAddress": wallet_address,
            "entityType": entity_type,
        }
        if capabilities:
            payload["capabilities"] = capabilities
        return await self._request("POST", "/api/identity/issue", json=payload)

    async def pay(
        self,
        *,
        from_address: str,
        to_address: str,
        amount: str,
        currency: str = "ORB",
        network: str = "base",
        chain_id: int = 8453,
        tx_type: str = "payment",
        description: Optional[str] = None,
    ) -> dict[str, Any]:
        payload: dict[str, Any] = {
            "fromAddress": from_address,
            "toAddress": to_address,
            "amount": amount,
            "currency": currency,
            "network": network,
            "chainId": chain_id,
            "type": tx_type,
        }
        if description:
            payload["description"] = description
        return await self._request("POST", "/api/wallet/transfer", json=payload)

    async def search_agents(
        self,
        *,
        query: Optional[str] = None,
        entity_type: Optional[str] = None,
        capability: Optional[str] = None,
        domain: Optional[str] = None,
        verified: Optional[bool] = None,
        available: Optional[bool] = None,
        min_trust: Optional[int] = None,
        sort: Optional[str] = None,
        limit: int = 20,
        offset: int = 0,
    ) -> dict[str, Any]:
        params: dict[str, Any] = {"limit": limit, "offset": offset}
        if query:
            params["q"] = query
        if entity_type:
            params["entityType"] = entity_type
        if capability:
            params["capability"] = capability
        if domain:
            params["domain"] = domain
        if verified is not None:
            params["verified"] = str(verified).lower()
        if available is not None:
            params["available"] = str(available).lower()
        if min_trust is not None:
            params["minTrust"] = min_trust
        if sort:
            params["sort"] = sort
        return await self._request("GET", "/api/registry", params=params)

    async def get_agent(self, agent_id: str) -> dict[str, Any]:
        return await self._request("GET", f"/api/registry/{agent_id}")

    async def get_balance(self, address: str) -> dict[str, Any]:
        return await self._request("GET", f"/api/wallet/{address}/balances")

    async def get_multi_chain_balances(self, address: str) -> dict[str, Any]:
        return await self._request("GET", f"/api/wallet/{address}/balances")

    async def sign_message(self, *, address: str, message: str) -> dict[str, Any]:
        return await self._request(
            "POST",
            "/api/wallet/sign-message",
            json={"walletAddress": address, "message": message},
        )

    async def verify_identity(self, *, wallet_address: str, entity_type: str, capabilities: Optional[list[str]] = None) -> dict[str, Any]:
        payload: dict[str, Any] = {"walletAddress": wallet_address, "entityType": entity_type}
        if capabilities:
            payload["capabilities"] = capabilities
        return await self._request("POST", "/api/identity/verify", json=payload)

    async def resolve_did(self, wallet_address: str) -> dict[str, Any]:
        return await self._request("GET", f"/api/identity/resolve/{wallet_address}")

    async def get_identity(self, address: str) -> dict[str, Any]:
        return await self._request("GET", f"/api/identity/{address}/document")

    async def issue_capability_token(
        self,
        *,
        wallet_address: str,
        capability: str,
        permissions: Optional[list[str]] = None,
        expires_at: Optional[str] = None,
    ) -> dict[str, Any]:
        payload: dict[str, Any] = {
            "walletAddress": wallet_address,
            "capability": capability,
        }
        if permissions:
            payload["permissions"] = permissions
        if expires_at:
            payload["expiresAt"] = expires_at
        return await self._request("POST", "/api/identity/capability/issue", json=payload)

    async def get_transactions(
        self,
        *,
        address: Optional[str] = None,
        status: Optional[str] = None,
        tx_type: Optional[str] = None,
        limit: int = 50,
        offset: int = 0,
    ) -> dict[str, Any]:
        params: dict[str, Any] = {"limit": limit, "offset": offset}
        if address:
            params["address"] = address
        if status:
            params["status"] = status
        if tx_type:
            params["type"] = tx_type
        if address:
            return await self._request("GET", f"/api/wallet/{address}/transactions", params=params)
        return await self._request("GET", "/api/wallets", params=params)

    async def create_task(
        self,
        *,
        title: str,
        description: Optional[str] = None,
        requester_address: str,
        reward: str,
        currency: str = "ORB",
        category: str,
        requirements: Optional[list[str]] = None,
        deadline: Optional[str] = None,
    ) -> dict[str, Any]:
        payload: dict[str, Any] = {
            "title": title,
            "requesterAddress": requester_address,
            "reward": reward,
            "currency": currency,
            "category": category,
        }
        if description:
            payload["description"] = description
        if requirements:
            payload["requirements"] = requirements
        if deadline:
            payload["deadline"] = deadline
        return await self._request("POST", "/api/tasks", json=payload)

    async def get_tasks(
        self,
        *,
        status: Optional[str] = None,
        category: Optional[str] = None,
        limit: int = 50,
        offset: int = 0,
    ) -> dict[str, Any]:
        params: dict[str, Any] = {"limit": limit, "offset": offset}
        if status:
            params["status"] = status
        if category:
            params["category"] = category
        return await self._request("GET", "/api/tasks", params=params)

    async def get_supported_networks(self) -> dict[str, Any]:
        return await self._request("GET", "/api/networks")

    async def get_chain_status(self, chain_id: int) -> dict[str, Any]:
        return await self._request("GET", f"/api/networks/{chain_id}/status")

    async def estimate_gas(
        self,
        *,
        from_address: str,
        to_address: str,
        amount: str,
        network: str = "base",
    ) -> dict[str, Any]:
        return await self._request(
            "POST",
            "/api/wallet/estimate-gas",
            json={
                "fromAddress": from_address,
                "toAddress": to_address,
                "amount": amount,
                "network": network,
            },
        )
