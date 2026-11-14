"""Reports from phones ("This message tried to trick me"), kept as salted hashes only.

A report never stores the message: only its fingerprint, the hashed 3-word windows (for near
matches), hashes of its links' domains, phone numbers and account numbers, and a hashed reporter id.
A message counts as confirmed once REPORT_CONFIRMATIONS different phones reported it, so one
person can't flag a message on their own.
"""
from __future__ import annotations

import json
import sqlite3
import threading
import time
from dataclasses import dataclass
from pathlib import Path

from . import extract

NEAR_MATCH = 0.6  # share of 3-word windows two messages must have in common to count as "the same"


@dataclass
class Match:
    reporters: int  # different phones that reported this message (or a near copy)
    confirmed: bool
    similarity: float


class ReportStore:
    def __init__(self, db_path: str, salt: str, confirmations: int) -> None:
        self.salt = salt
        self.confirmations = confirmations
        self._lock = threading.Lock()
        if db_path != ":memory:":
            Path(db_path).parent.mkdir(parents=True, exist_ok=True)
        self._db = sqlite3.connect(db_path, check_same_thread=False)
        self._db.executescript(
            """
            CREATE TABLE IF NOT EXISTS reports (
                fingerprint TEXT NOT NULL, reporter TEXT NOT NULL, shingles TEXT NOT NULL, created REAL NOT NULL,
                PRIMARY KEY (fingerprint, reporter));
            CREATE TABLE IF NOT EXISTS identifiers (
                kind TEXT NOT NULL, value TEXT NOT NULL, reporter TEXT NOT NULL, PRIMARY KEY (kind, value, reporter));
            """
        )

    # ---------------------------------------------------------------- writing
    def add(self, text: str, reporter_id: str) -> str:
        """Record a report. Returns 'pending', 'confirmed' or 'already_reported'."""
        fp = extract.fingerprint(text, self.salt)
        reporter = extract.salted("reporter:" + reporter_id, self.salt)
        sh = sorted(extract.shingles(text, self.salt))
        with self._lock:
            cur = self._db.execute(
                "INSERT OR IGNORE INTO reports VALUES (?, ?, ?, ?)", (fp, reporter, json.dumps(sh), time.time())
            )
            if cur.rowcount == 0:
                self._db.commit()
                return "already_reported"
            for kind, value in self._identifiers(text):
                self._db.execute("INSERT OR IGNORE INTO identifiers VALUES (?, ?, ?)", (kind, value, reporter))
            self._db.commit()
        return "confirmed" if self.match(text).confirmed else "pending"

    def _identifiers(self, text: str) -> list[tuple[str, str]]:
        out = [("domain", extract.salted(extract.registrable_domain(extract.host_of(u)), self.salt))
               for u in extract.links(text)]
        out += [("phone", extract.salted(p, self.salt)) for p in extract.phones(text)]
        out += [("account", extract.salted(a, self.salt)) for a in extract.account_numbers(text)]
        return out

    # ---------------------------------------------------------------- reading
    def match(self, text: str) -> Match:
        """How many different phones reported this message or a near copy of it."""
        fp = extract.fingerprint(text, self.salt)
        sh = extract.shingles(text, self.salt)
        with self._lock:
            rows = self._db.execute("SELECT fingerprint, reporter, shingles FROM reports").fetchall()
        best: dict[str, tuple[float, set[str]]] = {}
        for row_fp, reporter, row_sh in rows:
            score = 1.0 if row_fp == fp else extract.similarity(sh, set(json.loads(row_sh)))
            if score >= NEAR_MATCH:
                prev = best.get(row_fp, (0.0, set()))
                best[row_fp] = (max(prev[0], score), prev[1] | {reporter})
        if not best:
            return Match(0, False, 0.0)
        reporters = set().union(*(r for _, r in best.values()))
        top = max(s for s, _ in best.values())
        return Match(len(reporters), len(reporters) >= self.confirmations, round(top, 2))

    def identifier_reporters(self, kind: str, raw_value: str) -> int:
        """Different phones whose reported messages contained this domain / phone / account."""
        value = extract.salted(raw_value, self.salt)
        with self._lock:
            (count,) = self._db.execute(
                "SELECT COUNT(DISTINCT reporter) FROM identifiers WHERE kind = ? AND value = ?", (kind, value)
            ).fetchone()
        return int(count)

    def total(self) -> int:
        with self._lock:
            (count,) = self._db.execute("SELECT COUNT(DISTINCT fingerprint) FROM reports").fetchone()
        return int(count)
