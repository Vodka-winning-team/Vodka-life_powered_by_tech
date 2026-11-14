"""Settings, read from server/.env and the environment (the environment wins)."""
from __future__ import annotations

import os
import secrets
from dataclasses import dataclass, field
from functools import lru_cache
from pathlib import Path

SERVER_DIR = Path(__file__).resolve().parent.parent


def _read_env_file(path: Path) -> dict[str, str]:
    values: dict[str, str] = {}
    if not path.is_file():
        return values
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        values[key.strip()] = value.strip().strip('"').strip("'")
    return values


@dataclass(frozen=True)
class Settings:
    safe_browsing_key: str = ""
    urlhaus_auth_key: str = ""
    ipqs_key: str = ""
    myt_api_key: str = ""
    myt_base_url: str = ""
    myt_voice: str = ""
    myt_model: str = "myt/myt_tts"
    server_salt: str = field(default_factory=lambda: secrets.token_hex(16))
    report_confirmations: int = 2
    intel_budget_seconds: float = 3.0
    rate_limit_per_minute: int = 60
    db_path: str = str(SERVER_DIR / "data" / "verifye.db")

    @property
    def tts_ready(self) -> bool:
        return bool(self.myt_api_key and self.myt_base_url and self.myt_voice)

    def providers(self) -> dict[str, bool]:
        """Which live checks are switched on (shown at GET /health, never the keys)."""
        return {
            "safe_browsing": bool(self.safe_browsing_key),
            "urlhaus": bool(self.urlhaus_auth_key),
            "domain_age": True,  # RDAP needs no key
            "short_links": True,  # needs no key
            "phone_ipqs": bool(self.ipqs_key),
            "speech_myt": self.tts_ready,
        }


def load_settings(env_file: Path | None = None, environ: dict[str, str] | None = None) -> Settings:
    values = _read_env_file(env_file or SERVER_DIR / ".env")
    values.update({k: v for k, v in (environ if environ is not None else os.environ).items() if v})

    def num(key: str, default: float) -> float:
        try:
            return float(values.get(key, default))
        except ValueError:
            return default

    kwargs: dict = dict(
        safe_browsing_key=values.get("SAFE_BROWSING_KEY", ""),
        urlhaus_auth_key=values.get("URLHAUS_AUTH_KEY", ""),
        ipqs_key=values.get("IPQS_KEY", ""),
        myt_api_key=values.get("MYT_API_KEY", ""),
        myt_base_url=values.get("MYT_BASE_URL", ""),
        myt_voice=values.get("MYT_VOICE", ""),
        myt_model=values.get("MYT_MODEL", "") or "myt/myt_tts",
        report_confirmations=max(1, int(num("REPORT_CONFIRMATIONS", 2))),
        intel_budget_seconds=max(0.5, num("INTEL_BUDGET_SECONDS", 3.0)),
        rate_limit_per_minute=max(1, int(num("RATE_LIMIT_PER_MINUTE", 60))),
    )
    if values.get("SERVER_SALT"):
        kwargs["server_salt"] = values["SERVER_SALT"]
    if values.get("DB_PATH"):
        kwargs["db_path"] = values["DB_PATH"]
    return Settings(**kwargs)


@lru_cache
def get_settings() -> Settings:
    return load_settings()
