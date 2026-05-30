from typing import Tuple, Optional

CRITICAL_PHRASES = [
    "not breathing", "unconscious", "severe bleeding",
    "chest pain", "seizure", "unresponsive", "heart attack",
    "stroke", "not responding", "stopped breathing",
    "no pulse", "choking badly", "losing consciousness"
]

def detect_emergency(prompt: str) -> Tuple[bool, Optional[str]]:
    text = prompt.lower()
    for phrase in CRITICAL_PHRASES:
        if phrase in text:
            return True, phrase
    return False, None
