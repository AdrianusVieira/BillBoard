from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from database import create_db, get_session
from routers import groups, bills
from routers.recurrent import router as recurrent_router
from routers.jobs import router as jobs_router
from jobs import generate_recurrent_bills, cleanup_old_bills
import models


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db()

    # Run startup jobs
    with next(get_session()) as session:
        cleanup_old_bills(session)
        generate_recurrent_bills(session)

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
app.include_router(recurrent_router)
app.include_router(jobs_router)


@app.get("/")
def root():
    return {"message": "Billboard API is running"}