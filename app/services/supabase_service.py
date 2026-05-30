import os
import logging
from supabase import create_client, Client

logger = logging.getLogger(__name__)

SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")

# Initialize client only if env vars are present (handled in main.py startup check)
supabase: Client = None
if SUPABASE_URL and SUPABASE_KEY:
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def validate_session(session_id: str) -> bool:
    """Check if session exists in Supabase."""
    if not supabase:
        return False
    try:
        response = supabase.table("sessions").select("id").eq("id", session_id).execute()
        return len(response.data) > 0
    except Exception as e:
        logger.error(f"Supabase validate_session error: {e}")
        return False

def save_chat_sync(session_id: str, role: str, content: str, is_emergency: bool = False, severity: str = "low"):
    """Sync function to save chat to Supabase. To be run in background."""
    if not supabase:
        return
    try:
        supabase.table("chats").insert({
            "session_id": session_id,
            "role": role,
            "content": content,
            "is_emergency": is_emergency,
            "severity": severity
        }).execute()
    except Exception as e:
        logger.error(f"Supabase save_chat error: {e}")

def save_emergency_log_sync(session_id: str, trigger_phrase: str, user_prompt: str):
    """Sync function to save emergency log to Supabase. To be run in background."""
    if not supabase:
        return
    try:
        supabase.table("emergency_logs").insert({
            "session_id": session_id,
            "trigger_phrase": trigger_phrase,
            "user_prompt": user_prompt
        }).execute()
    except Exception as e:
        logger.error(f"Supabase save_emergency_log error: {e}")
