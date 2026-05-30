import os
import asyncio
from typing import Tuple, Dict, Any
from openai import AsyncOpenAI, APITimeoutError, APIConnectionError, RateLimitError
from fastapi import HTTPException
import logging

from app.ai.prompt import SYSTEM_PROMPT

logger = logging.getLogger(__name__)

# Initialize OpenAI client
# Ensure OPENAI_API_KEY is loaded in env
client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

TIMEOUT_SECONDS = int(os.getenv("OPENAI_TIMEOUT_SECONDS", "15"))

async def get_ai_response(user_prompt: str) -> Tuple[str, str]:
    """
    Calls OpenAI to get a response.
    Returns a tuple of (clean_message, severity).
    """
    try:
        response = await client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.3,
            max_tokens=500,
            timeout=TIMEOUT_SECONDS
        )
        
        full_content = response.choices[0].message.content or ""
        
        # Parse severity
        severity = "low" # default
        clean_message = full_content
        
        lines = full_content.split('\n')
        if lines:
            last_line = lines[-1].strip()
            if last_line.startswith("SEVERITY:"):
                severity_val = last_line.replace("SEVERITY:", "").strip().lower()
                if severity_val in ["low", "medium", "high", "critical"]:
                    severity = severity_val
                # Strip the severity line from the message
                clean_message = '\n'.join(lines[:-1]).strip()

        return clean_message, severity

    except (APITimeoutError, APIConnectionError) as e:
        logger.error(f"OpenAI connection/timeout error: {e}")
        raise HTTPException(status_code=503, detail="Service temporarily unavailable.")
    except RateLimitError as e:
        logger.error(f"OpenAI rate limit error: {e}")
        raise HTTPException(status_code=503, detail="Service temporarily unavailable due to high load.")
    except Exception as e:
        logger.error(f"Unexpected OpenAI error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error.")
