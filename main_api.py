from fastapi import FastAPI, UploadFile, File, Form
from pydantic import BaseModel
from app.stt.whisper_stt import transcribe_audio
from app.llm.groq_llm import get_response
from app.tts.speak import speak
import tempfile
from pathlib import Path
from fastapi.middleware.cors import CORSMiddleware


# Load system prompt from file
system_prompt_path = Path(__file__).resolve().parent / "system_prompt.txt"
system_prompt = system_prompt_path.read_text().strip()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or ["https://en.wikipedia.org"] for stricter control
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- MODELS ----------
class AskRequest(BaseModel):
    query: str
    page_text: str

class AskResponse(BaseModel):
    answer: str

# ---------- ROUTES ----------

@app.post("/transcribe")
async def transcribe(file: UploadFile = File(...)):
    # Save the uploaded file to a temporary location
    with tempfile.NamedTemporaryFile(delete=False, suffix=".m4a") as tmp:
        tmp.write(await file.read())
        tmp_path = tmp.name

    # Pass file path to your existing function
    transcript = transcribe_audio(tmp_path)

    return {"transcript": transcript}

@app.post("/ask", response_model=AskResponse)
def ask_llm(data: AskRequest):
    response = get_response(system_prompt, {data.query},  {data.page_text})
    return {"answer": response}

@app.post("/speak")
def tts(text: str = Form(...)):
    audio_path = speak(text)  # Assumes speak_text() returns the file path
    return {"audio_url": f"/static/{audio_path}"}  # You need to serve /static if returning real audio

# ---------- TO RUN ----------
# uvicorn main_api:app --reload
