import IBill from "@/shared/types/IBill";
import IGroup from "@/shared/types/IGroup";
import BillCard from "./BillCard";

const TEXTS = {
  empty: "No bills match your filters.",
};

interface BillListProps {
  bills: IBill[];
  groups: IGroup[];
  onEdit: (bill: IBill) => void;
  onRemove: (id: number) => void;
  onTogglePaid: (bill: IBill) => void;
  onDuplicate: (bill: IBill) => void;
}

const BillList = ({
  bills,
  groups,
  onEdit,
  onRemove,
  onTogglePaid,
  onDuplicate,
}: BillListProps) => {
  const isEmpty = bills.length === 0;

  const showEmpty = () => (
    <p className="text-sm text-muted-foreground text-center py-8">
      {TEXTS.empty}
    </p>
  );

  const showBills = () => (
    <div className="flex flex-col gap-2">
      {bills.map((bill) => (
        <BillCard
          key={bill.id}
          bill={bill}
          groups={groups}
          onEdit={onEdit}
          onRemove={onRemove}
          onTogglePaid={onTogglePaid}
          onDuplicate={onDuplicate}
        />
      ))}
    </div>
  );

  return <div>{isEmpty ? showEmpty() : showBills()}</div>;
};

export default BillList;
