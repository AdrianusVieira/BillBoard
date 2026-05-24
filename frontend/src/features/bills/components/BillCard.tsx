import { Pencil, Trash2 } from "lucide-react";
import { useMemo } from "react";
import IBill from "@/shared/types/IBill";
import IGroup from "@/shared/types/IGroup";

const TEXTS = {
  paid: "Paid",
  unpaid: "Unpaid",
};

interface BillCardProps {
  bill: IBill;
  groups: IGroup[];
  onEdit: (bill: IBill) => void;
  onRemove: (id: number) => void;
  onTogglePaid: (bill: IBill) => void;
}

const BillCard = ({
  bill,
  groups,
  onEdit,
  onRemove,
  onTogglePaid,
}: BillCardProps) => {
  const group = useMemo(
    () => groups.find((g) => g.id === bill.group_id),
    [groups, bill.group_id],
  );

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:border-border/80">
      <div className="flex flex-col gap-1 min-w-0">
        <p className="text-sm font-medium truncate">{bill.name}</p>
        <div className="flex gap-3 text-xs text-muted-foreground">
          {group && <span>{group.name}</span>}
          {bill.term && <span>{bill.term}</span>}
          {bill.ref && <span>{bill.ref}</span>}
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <span className="text-sm font-medium">
          R$ {bill.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
        </span>

        <button
          onClick={() => onTogglePaid(bill)}
          className={`text-xs px-3 py-1 rounded-full border ${
            bill.paid
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-muted text-muted-foreground border-border"
          }`}
        >
          {bill.paid ? TEXTS.paid : TEXTS.unpaid}
        </button>

        <button
          onClick={() => onEdit(bill)}
          className="text-muted-foreground hover:text-foreground"
        >
          <Pencil className="w-4 h-4" />
        </button>

        <button
          onClick={() => onRemove(bill.id)}
          className="text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default BillCard;
