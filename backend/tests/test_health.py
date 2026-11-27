import pytest
import httpx
from app.main import app

@pytest.mark.anyio
async def test_health():
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "online"
        assert data["database"] in ("connected", "unavailable")
        # Verificación de encabezados OWASP Secure Headers
        assert response.headers.get("X-Content-Type-Options") == "nosniff"
        assert response.headers.get("X-Frame-Options") == "DENY"
        assert response.headers.get("Referrer-Policy") == "strict-origin-when-cross-origin"
        assert "Strict-Transport-Security" in response.headers


@pytest.mark.anyio
async def test_cors_strict_whitelist_blocks_untrusted_origins():
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        # 1. Origen permitido (en lista blanca CORS_ORIGINS)
        allowed_resp = await client.options(
            "/health",
            headers={
                "Origin": "http://localhost:3000",
                "Access-Control-Request-Method": "GET",
            },
        )
        assert allowed_resp.headers.get("access-control-allow-origin") == "http://localhost:3000"

        # 2. Origen malicioso externo (NO debe recibir encabezado Access-Control-Allow-Origin)
        blocked_resp = await client.options(
            "/health",
            headers={
                "Origin": "https://malicious-site.evil.com",
                "Access-Control-Request-Method": "GET",
            },
        )
        assert blocked_resp.headers.get("access-control-allow-origin") is None
