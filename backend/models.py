from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import date

class GroupBase(SQLModel):
    name: str
    description: Optional[str] = None

class Group(GroupBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

class GroupCreate(GroupBase):
    pass

class BillBase(SQLModel):
    name: str
    value: float
    group_id: Optional[int] = Field(default=None, foreign_key="group.id")
    term: Optional[date] = None
    ref: Optional[str] = None
    paid: bool = False

class Bill(BillBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

class BillCreate(BillBase):
    pass