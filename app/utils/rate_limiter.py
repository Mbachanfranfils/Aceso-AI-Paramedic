import os
from slowapi import Limiter
from slowapi.util import get_remote_address
from fastapi import Request

# Function to extract session_id for rate limiting, falling back to IP if needed
def get_session_id(request: Request) -> str:
    # Try to parse session_id from the JSON body
    # Since we need to access the body in a sync function without awaiting, 
    # and rate limiting happens before endpoint logic, we might not easily get the parsed body here.
    # We can rely on custom header or just IP if session ID is hard.
    # To strictly follow "per session_id", we assume the client passes it in headers,
    # or we can write a custom key function. Since it's a POST body, reading body in a key function is tricky.
    # Let's check headers first. If not present, we can fallback to remote address.
    session_id = request.headers.get("x-session-id")
    if session_id:
        return session_id
    return get_remote_address(request)

RATE_LIMIT = f"{os.getenv('RATE_LIMIT_PER_MINUTE', '10')}/minute"

limiter = Limiter(key_func=get_session_id, default_limits=[RATE_LIMIT])
