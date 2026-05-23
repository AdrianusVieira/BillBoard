from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from database import get_session
from models import Group, GroupCreate


router = APIRouter(prefix="/groups", tags=["Groups"])

@router.get("/")
def get_groups(session: Session = Depends(get_session)):
    return session.exec(select(Group)).all()

@router.post("/")
def create_group(group: GroupCreate, session: Session = Depends(get_session)):
    db_group = Group.model_validate(group)
    session.add(db_group)
    session.commit()
    session.refresh(db_group)
    return db_group

@router.put("/{group_id}")
def update_group(group_id: int, updated: GroupCreate, session: Session = Depends(get_session)):
    group = session.get(Group, group_id)
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")
    group.name = updated.name
    group.description = updated.description
    session.commit()
    session.refresh(group)
    return group

@router.delete("/{group_id}")
def delete_group(group_id: int, session: Session = Depends(get_session)):
    group = session.get(Group, group_id)
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")
    session.delete(group)
    session.commit()
    return {"message": "Group deleted"}