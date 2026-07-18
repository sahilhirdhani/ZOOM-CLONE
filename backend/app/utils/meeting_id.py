import random
import string


def generate_meeting_code() -> str:
    """Generate a Zoom-style meeting code: XXX-XXXX-XXX"""
    part1 = ''.join(random.choices(string.digits, k=3))
    part2 = ''.join(random.choices(string.digits, k=4))
    part3 = ''.join(random.choices(string.digits, k=3))
    return f"{part1}-{part2}-{part3}"


import os

def generate_meeting_link(code: str) -> str:
    """Generate a shareable meeting link."""
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
    return f"{frontend_url}/join?code={code}"
