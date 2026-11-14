@echo off
rem Starts the Verifye server (server/) for the demo. Run it on the laptop, then put this laptop's
rem address in the app: Settings -> Server address (for a phone on USB: http://127.0.0.1:8000).
rem The keys go in server.env (see server.env.example). That file is never committed.
cd /d "%~dp0server"
if not exist .venv (
  echo First run: setting up Python...
  py -3 -m venv .venv
  .venvScriptspython -m pip install -q -r requirements.txt
)
if not exist .env echo WARNING: server.env is missing. Copy .env.example to .env and add the keys.
echo Verifye server: http://localhost:8000/health
.venvScriptspython -m uvicorn verifye_server.main:app --host 0.0.0.0 --port 8000
