from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from database import create_db
from routers import groups, bills
import models

@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        create_db()
    except Exception as e:
        # Provide a clearer startup error so logs are actionable
        raise RuntimeError(f"Application failed to start due to database error: {e}") from e
    yield

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(groups.router)
app.include_router(bills.router)

@app.get("/")
def root():
    return {"message": "Billboard API is running"}