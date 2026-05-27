from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from database import get_session
from models import Recurrent, RecurrentCreate, RecurrentUpdate, Bill

router = APIRouter(prefix="/recurrent", tags=["Recurrent"])


@router.get("/")
def get_recurrents(session: Session = Depends(get_session)):
    return session.exec(select(Recurrent)).all()


@router.get("/{recurrent_id}")
def get_recurrent(recurrent_id: str, session: Session = Depends(get_session)):
    recurrent = session.get(Recurrent, recurrent_id)
    if not recurrent:
        raise HTTPException(status_code=404, detail="Recurrent not found")
    return recurrent


@router.post("/")
def create_recurrent(recurrent: RecurrentCreate, session: Session = Depends(get_session)):
    db_recurrent = Recurrent.model_validate(recurrent)
    session.add(db_recurrent)
    session.commit()
    session.refresh(db_recurrent)
    return db_recurrent


@router.put("/{recurrent_id}")
def update_recurrent(
    recurrent_id: str,
    updated: RecurrentUpdate,
    session: Session = Depends(get_session)
):
    recurrent = session.get(Recurrent, recurrent_id)
    if not recurrent:
        raise HTTPException(status_code=404, detail="Recurrent not found")

    update_data = updated.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(recurrent, key, value)

    session.add(recurrent)
    session.commit()
    session.refresh(recurrent)
    return recurrent


@router.delete("/{recurrent_id}")
def delete_recurrent(recurrent_id: str, session: Session = Depends(get_session)):
    recurrent = session.get(Recurrent, recurrent_id)
    if not recurrent:
        raise HTTPException(status_code=404, detail="Recurrent not found")

    # Decouple all linked bills — keep them as standalone
    linked_bills = session.exec(
        select(Bill).where(Bill.recurrent_id == recurrent_id)
    ).all()
    for bill in linked_bills:
        bill.recurrent_id = None
        session.add(bill)

    session.delete(recurrent)
    session.commit()
    return {"message": "Recurrent deleted, bills decoupled"}