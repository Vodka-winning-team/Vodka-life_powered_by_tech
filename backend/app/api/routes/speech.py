"""Text-to-speech through myt AI Cloud (Mauritius Telecom).

The app sends the text of a result; this route forwards it to myt AI Cloud and returns the audio.
The API key stays on the server (backend/.env) and is never sent to the app.
"""
import httpx
from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import Response
from pydantic import BaseModel, Field

from ...core.config import get_settings

router = APIRouter(prefix="/speech", tags=["Speech"])


class SpeechRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=1500, description="The words to read aloud.")


@router.get("/status", summary="Is text-to-speech set up on this server?")
def speech_status() -> dict:
    settings = get_settings()
    ready = bool(settings.myt_api_key and settings.myt_base_url and settings.myt_voice)
    return {"ready": ready, "model": settings.myt_model}


@router.post("", summary="Read a text aloud (returns MP3 audio)")
async def speak(request: SpeechRequest) -> Response:
    settings = get_settings()
    if not (settings.myt_api_key and settings.myt_base_url and settings.myt_voice):
        raise HTTPException(status_code=503, detail="Text-to-speech is not set up on this server.")

    url = settings.myt_base_url.rstrip("/") + "/audio/speech"
    body = {"model": settings.myt_model, "input": request.text, "voice": settings.myt_voice, "response_format": "mp3"}
    headers = {"Authorization": f"Bearer {settings.myt_api_key}"}
    try:
        async with httpx.AsyncClient(timeout=20) as client:
            answer = await client.post(url, json=body, headers=headers)
    except httpx.HTTPError:
        raise HTTPException(status_code=502, detail="Could not reach the text-to-speech service.")

    if answer.status_code != 200:
        # 401 = wrong key, 429 = budget or rate limit, 400 = text too long or unknown voice.
        raise HTTPException(status_code=502, detail=f"Text-to-speech service answered {answer.status_code}.")
    return Response(content=answer.content, media_type="audio/mpeg")


@router.get("", summary="Same as POST, for audio players that load a web address")
async def speak_from_link(text: str = Query(..., min_length=1, max_length=1500)) -> Response:
    return await speak(SpeechRequest(text=text))
