from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from database import get_session
from models import Bill, BillCreate

router = APIRouter(prefix="/bills", tags=["Bills"])

@router.get("/")
def get_bills(session: Session = Depends(get_session)):
    return session.exec(select(Bill)).all()

@router.post("/")
def create_bill(bill: BillCreate, session: Session = Depends(get_session)):
    db_bill = Bill.model_validate(bill)
    session.add(db_bill)
    session.commit()
    session.refresh(db_bill)
    return db_bill

@router.put("/{bill_id}")
def update_bill(bill_id: int, updated: BillCreate, session: Session = Depends(get_session)):
    bill = session.get(Bill, bill_id)
    if not bill:
        raise HTTPException(status_code=404, detail="Bill not found")
    bill.name = updated.name
    bill.value = updated.value
    bill.group_id = updated.group_id
    bill.term = updated.term
    bill.ref = updated.ref
    bill.paid = updated.paid
    session.commit()
    session.refresh(bill)
    return bill

@router.delete("/{bill_id}")
def delete_bill(bill_id: int, session: Session = Depends(get_session)):
    bill = session.get(Bill, bill_id)
    if not bill:
        raise HTTPException(status_code=404, detail="Bill not found")
    session.delete(bill)
    session.commit()
    return {"message": "Bill deleted"}