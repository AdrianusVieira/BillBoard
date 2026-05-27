from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import date
from enum import Enum
import uuid


class Frequency(str, Enum):
    weekly = "weekly"
    monthly = "monthly"
    yearly = "yearly"


class RecurrentBase(SQLModel):
    is_variable: bool = False
    estimated_value: Optional[float] = None
    frequency: Frequency
    recurrent_day: int


class Recurrent(RecurrentBase, table=True):
    id: Optional[str] = Field(
        default_factory=lambda: str(uuid.uuid4()),
        primary_key=True
    )


class RecurrentCreate(RecurrentBase):
    pass


class RecurrentUpdate(SQLModel):
    is_variable: Optional[bool] = None
    estimated_value: Optional[float] = None
    frequency: Optional[Frequency] = None
    recurrent_day: Optional[int] = None


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
    recurrent_id: Optional[str] = Field(default=None, foreign_key="recurrent.id")


class Bill(BillBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)


class BillCreate(BillBase):
    pass