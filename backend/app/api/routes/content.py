"""Static content: demo samples, verified directory, lessons and quiz, trend radar."""
from dataclasses import asdict

from fastapi import APIRouter, Depends

from ...knowledge import loader
from ...knowledge.tactics import TACTICS
from ...services.store import Store
from ..deps import get_store

router = APIRouter()


@router.get("/samples", tags=["Content"], summary="Demo messages (scams and genuine)")
async def samples() -> list[dict]:
    return loader.samples()


@router.get("/directory", tags=["Content"], summary="Verified official contacts")
async def directory() -> dict:
    d = loader.directory()
    return {"organisations": d["organisations"], "reporting": d["reporting"]}


@router.get("/learn/tactics", tags=["Learn"], summary="Scam tactics with 30-second lessons")
async def tactics(lang: str = "en") -> list[dict]:
    # lang = en, fr or mfe (Kreol). Texts without a translation stay in English.
    texts = loader.learn_texts(lang).get("tactics", {})
    return [{**asdict(t), **texts.get(t.id, {})} for t in TACTICS.values()]


@router.get("/learn/quiz", tags=["Learn"], summary="Spot-the-scam quiz questions")
async def quiz(lang: str = "en") -> list[dict]:
    texts = loader.learn_texts(lang).get("quiz", {})
    return [{**q, **texts.get(q["id"], {})} for q in loader.quiz()]


@router.get("/radar", tags=["Scam Radar"], summary="Anonymised scam trends (for banks / regulators)")
async def radar(store: Store = Depends(get_store)) -> dict:
    return store.radar()
