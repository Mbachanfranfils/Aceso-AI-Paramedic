from pydantic import BaseModel, UUID4
from typing import Literal

class ChatRequest(BaseModel):
    session_id: UUID4
    prompt: str

    class Config:
        str_max_length = 500
        str_strip_whitespace = True

class ChatResponse(BaseModel):
    message: str
    is_emergency: bool
    severity: Literal['low', 'medium', 'high', 'critical']
    session_id: UUID4
