from datetime import date, timedelta
from typing import Optional
from dateutil.relativedelta import relativedelta
from sqlmodel import Session, select
from models import Bill, Recurrent, Frequency


def _next_term(last_term: date, frequency: Frequency, recurrent_day: int) -> date:
    """Calculate next term based on last bill's term + frequency + recurrent_day."""
    if frequency == Frequency.weekly:
        next_date = last_term + timedelta(weeks=1)
        # Adjust to recurrent_day (day of week: 0=Monday, 6=Sunday)
        days_ahead = recurrent_day - next_date.weekday()
        if days_ahead < 0:
            days_ahead += 7
        return next_date + timedelta(days=days_ahead)

    elif frequency == Frequency.monthly:
        next_month = last_term + relativedelta(months=1)
        # Clamp day to max days in that month
        import calendar
        max_day = calendar.monthrange(next_month.year, next_month.month)[1]
        day = min(recurrent_day, max_day)
        return next_month.replace(day=day)

    elif frequency == Frequency.yearly:
        next_year = last_term + relativedelta(years=1)
        import calendar
        max_day = calendar.monthrange(next_year.year, next_year.month)[1]
        day = min(recurrent_day, max_day)
        return next_year.replace(day=day)


def _compute_estimated_value(session: Session, recurrent_id: str) -> Optional[float]:
    """Compute average value of last <=6 instances."""
    from typing import Optional
    bills = session.exec(
        select(Bill)
        .where(Bill.recurrent_id == recurrent_id)
        .order_by(Bill.term.desc())
        .limit(6)
    ).all()

    if not bills:
        return None

    values = [b.value for b in bills if b.value is not None]
    if not values:
        return None

    return sum(values) / len(values)


def generate_recurrent_bills(session: Session) -> dict:
    """
    For each Recurrent, check if the latest bill's term has passed.
    If so, generate the next bill instance.
    """
    recurrents = session.exec(select(Recurrent)).all()
    generated = 0

    for recurrent in recurrents:
        # Get latest bill for this recurrent
        latest_bill = session.exec(
            select(Bill)
            .where(Bill.recurrent_id == recurrent.id)
            .order_by(Bill.term.desc())
        ).first()

        if not latest_bill or not latest_bill.term:
            continue

        today = date.today()
        if latest_bill.term >= today:
            continue

        # Calculate next term
        next_term = _next_term(
            latest_bill.term,
            recurrent.frequency,
            recurrent.recurrent_day
        )

        # Determine value
        value = (
            recurrent.estimated_value
            if recurrent.is_variable and recurrent.estimated_value is not None
            else latest_bill.value
        )

        # Create new bill copying from latest
        new_bill = Bill(
            name=latest_bill.name,
            value=value,
            group_id=latest_bill.group_id,
            term=next_term,
            ref=latest_bill.ref,
            paid=False,
            recurrent_id=recurrent.id,
        )
        session.add(new_bill)

        # Recompute estimated_value after adding the new bill
        session.flush()  # get new_bill into session without committing
        estimated = _compute_estimated_value(session, recurrent.id)
        if estimated is not None:
            recurrent.estimated_value = estimated
            session.add(recurrent)

        generated += 1

    session.commit()
    return {"generated": generated}


def cleanup_old_bills(session: Session) -> dict:
    """
    Delete all bills older than 6 months.
    No exceptions — recurrent latest instances included.
    """
    from dateutil.relativedelta import relativedelta
    cutoff = date.today() - relativedelta(months=6)

    old_bills = session.exec(
        select(Bill).where(Bill.term < cutoff)
    ).all()

    deleted = len(old_bills)
    for bill in old_bills:
        session.delete(bill)

    session.commit()
    return {"deleted": deleted}