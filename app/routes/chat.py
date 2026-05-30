from fastapi import APIRouter, HTTPException, BackgroundTasks, Request
from app.models.schemas import ChatRequest, ChatResponse
from app.ai.emergency import detect_emergency
from app.services.ai_service import get_ai_response
from app.services.supabase_service import validate_session, save_chat_sync, save_emergency_log_sync
from app.utils.rate_limiter import limiter
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/chat", response_model=ChatResponse)
@limiter.limit("10/minute")
async def chat_endpoint(request: Request, body: ChatRequest, background_tasks: BackgroundTasks):
    session_id_str = str(body.session_id)
    
    # 1. Validate session
    if not validate_session(session_id_str):
        raise HTTPException(status_code=401, detail="Invalid session.")
    
    # 2. Sanitize prompt
    user_prompt = body.prompt.strip()
    if not user_prompt:
        raise HTTPException(status_code=400, detail="Prompt cannot be empty.")
    
    # 3. Emergency detection
    is_emergency, trigger_phrase = detect_emergency(user_prompt)
    
    if is_emergency:
        # Emergency override response
        ai_message = "Call emergency services immediately. Do not delay."
        severity = "critical"
        
        # Save user message
        background_tasks.add_task(save_chat_sync, session_id_str, "user", user_prompt, True, severity)
        # Save AI response
        background_tasks.add_task(save_chat_sync, session_id_str, "assistant", ai_message, True, severity)
        # Save emergency log
        background_tasks.add_task(save_emergency_log_sync, session_id_str, trigger_phrase or "unknown", user_prompt)
        
        return ChatResponse(
            message=ai_message,
            is_emergency=True,
            severity=severity,
            session_id=body.session_id
        )

    # 4. Call OpenAI
    clean_message, severity = await get_ai_response(user_prompt)
    
    # Save user message
    background_tasks.add_task(save_chat_sync, session_id_str, "user", user_prompt, False, severity)
    # Save AI response
    background_tasks.add_task(save_chat_sync, session_id_str, "assistant", clean_message, False, severity)

    return ChatResponse(
        message=clean_message,
        is_emergency=False,
        severity=severity,
        session_id=body.session_id
    )
