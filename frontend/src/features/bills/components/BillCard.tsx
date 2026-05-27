import IBill from "@/shared/interfaces/IBill";
import IGroup from "@/shared/interfaces/IGroup";
import IRecurrent from "@/shared/interfaces/IRecurrent";
import { Copy, Pencil, Trash2 } from "lucide-react";
import { useMemo } from "react";

const TEXTS = {
  paid: "Paid",
  unpaid: "Unpaid",
  est: "est.",
};

interface BillCardProps {
  bill: IBill;
  groups: IGroup[];
  recurrents: IRecurrent[];
  onEdit: (bill: IBill) => void;
  onRemove: (id: number) => void;
  onTogglePaid: (bill: IBill) => void;
  onDuplicate: (bill: IBill) => void;
}

const BillCard = ({
  bill,
  groups,
  recurrents,
  onDuplicate,
  onEdit,
  onRemove,
  onTogglePaid,
}: BillCardProps) => {
  const group = useMemo(
    () => groups.find((g) => g.id === bill.group_id),
    [groups, bill.group_id],
  );

  const recurrent = useMemo(
    () =>
      bill.recurrent_id
        ? recurrents.find((r) => r.id === bill.recurrent_id)
        : null,
    [recurrents, bill.recurrent_id],
  );

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:border-border/80">
      <div className="flex flex-col gap-1 min-w-0">
        <p className="text-sm font-medium truncate">{bill.name}</p>
        <div className="flex gap-3 text-xs text-muted-foreground items-center flex-wrap">
          {group && <span>{group.name}</span>}
          {bill.term && <span>{bill.term}</span>}
          {bill.ref && <span>{bill.ref}</span>}
          {recurrent && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[11px]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17 2l4 4-4 4" />
                <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                <path d="M7 22l-4-4 4-4" />
                <path d="M21 13v2a4 4 0 0 1-4 4H3" />
              </svg>
              {recurrent.frequency}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <div className="text-right">
          <span className="text-sm font-medium">
            R${" "}
            {bill.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </span>
          {recurrent?.is_variable && recurrent.estimated_value != null && (
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {TEXTS.est} R${" "}
              {recurrent.estimated_value.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </p>
          )}
        </div>

        <button
          onClick={() => onTogglePaid(bill)}
          className={`text-xs px-3 py-1 rounded-full border ${
            bill.paid
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-muted text-muted-foreground border-border"
          } cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary/50 active:scale-95`}
        >
          {bill.paid ? TEXTS.paid : TEXTS.unpaid}
        </button>

        <button
          onClick={() => onDuplicate(bill)}
          className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary/50 active:scale-95"
          aria-label={`Duplicate ${bill.name}`}
        >
          <Copy className="w-4 h-4" />
        </button>

        <button
          onClick={() => onEdit(bill)}
          className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary/50 active:scale-95"
        >
          <Pencil className="w-4 h-4" />
        </button>

        <button
          onClick={() => onRemove(bill.id)}
          className="text-muted-foreground hover:text-destructive cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary/50 active:scale-95"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default BillCard;
