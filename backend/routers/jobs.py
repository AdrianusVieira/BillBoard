from fastapi import APIRouter, Depends
from sqlmodel import Session
from database import get_session
from jobs import generate_recurrent_bills, cleanup_old_bills

router = APIRouter(prefix="/jobs", tags=["Jobs"])


@router.post("/generate-recurrent")
def run_generate_recurrent(session: Session = Depends(get_session)):
    return generate_recurrent_bills(session)


@router.post("/cleanup")
def run_cleanup(session: Session = Depends(get_session)):
    return cleanup_old_bills(session)