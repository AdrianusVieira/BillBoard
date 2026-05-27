import os
import logging
from urllib.parse import urlparse
from sqlmodel import SQLModel, create_engine, Session
from dotenv import load_dotenv
from sqlalchemy.exc import OperationalError

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL is not set. Please set it in backend/.env or in the environment before starting the app.")

try:
    engine = create_engine(DATABASE_URL)
except Exception as e:
    raise RuntimeError(f"Unable to create SQLAlchemy engine for DATABASE_URL: {e}") from e

def create_db():
    try:
        SQLModel.metadata.create_all(engine)
    except OperationalError as e:
        host = None
        try:
            parsed = urlparse(DATABASE_URL)
            host = parsed.hostname
        except Exception:
            host = None

        suggestions = [
            "Verify `DATABASE_URL` in backend/.env is correct (host, user, password, dbname)",
            (f"Check network/DNS resolution for the DB host: nslookup {host} or dig +short {host}") if host else "Check network/DNS resolution for the DB host",
            "Ensure any required VPN is connected and your firewall allows outbound DB connections",
            "Confirm the Supabase project is active and that the DB host hasn't changed"
        ]

        raise RuntimeError(
            f"Failed to connect to database host {host!r} from DATABASE_URL. Original error: {e}. Suggestions: {'; '.join(suggestions)}"
        ) from e
    except Exception as e:
        raise RuntimeError(f"Unexpected error while creating database schema: {e}") from e

def get_session():
    with Session(engine) as session:
        yield session