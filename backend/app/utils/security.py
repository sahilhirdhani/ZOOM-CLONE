import hashlib
import os

def hash_password(password: str) -> str:
    """Hash a password using SHA-256 with a random salt."""
    salt = os.urandom(16).hex()
    hashed = hashlib.sha256((password + salt).encode('utf-8')).hexdigest()
    return f"{salt}:{hashed}"

def verify_password(password: str, hashed_password: str) -> bool:
    """Verify a hashed password."""
    if not hashed_password or ":" not in hashed_password:
        return False
    salt, hashed = hashed_password.split(":", 1)
    test_hashed = hashlib.sha256((password + salt).encode('utf-8')).hexdigest()
    return test_hashed == hashed
