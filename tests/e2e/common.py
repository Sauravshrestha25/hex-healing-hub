"""Shared settings for the browser tests. See README.md in this folder."""
import os
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
_env = (ROOT / ".env").read_text()

# The local owner account from .env; its password is passed in, never stored here.
EMAIL = re.search(r'^SUPERADMIN_EMAIL=["\x27]?(.*?)["\x27]?$', _env, re.M).group(1)
PW = os.environ["E2E_PASSWORD"]
# The server under test: start it with SMTP_HOST="" so no real email is sent.
B = os.environ.get("E2E_BASE", "http://localhost:3100")
# That server's log (the test mailer writes each email, or its subject, there).
DEVLOG = os.environ.get("E2E_LOG", "/tmp/hex-e2e-server.log")
# The business WhatsApp line, read from the code so the tests follow it when it changes.
WHATSAPP_NUMBER = re.search(r'WHATSAPP_NUMBER = "(\d+)"', (ROOT / "features/shared/lib/whatsapp.ts").read_text()).group(1)
