import { useState, useEffect } from "react";
import IBill from "@/shared/types/IBill";
import IBillPayload from "@/shared/types/IBillPayload";
import IGroup from "@/shared/types/IGroup";

const TEXTS = {
  buttons: {
    cancel: "Cancel",
    create: "Add bill",
    update: "Update bill",
  },
  fields: {
    group: "Group",
    name: "Name *",
    paid: "Mark as paid",
    ref: "Referente a",
    term: "Term (due date)",
    value: "R$ Value *",
  },
  titles: {
    create: "Add bill",
    update: "Edit bill",
  },
};

interface BillFormProps {
  editing: IBill | null;
  groups: IGroup[];
  onClose: () => void;
  onSubmit: (payload: IBillPayload) => void;
}

const BillForm = ({ editing, groups, onClose, onSubmit }: BillFormProps) => {
  const [groupId, setGroupId] = useState<number | undefined>(undefined);
  const [name, setName] = useState("");
  const [paid, setPaid] = useState(false);
  const [ref, setRef] = useState("");
  const [term, setTerm] = useState("");
  const [value, setValue] = useState("");

  useEffect(() => {
    if (editing) {
      setGroupId(editing.group_id);
      setName(editing.name);
      setPaid(editing.paid);
      setRef(editing.ref ?? "");
      setTerm(editing.term ?? "");
      setValue(String(editing.value));
    } else {
      setGroupId(undefined);
      setName("");
      setPaid(false);
      setRef("");
      setTerm("");
      setValue("");
    }
  }, [editing]);

  const handleSubmit = () => {
    if (!name.trim() || !value) return;

    onSubmit({
      group_id: groupId,
      name,
      paid,
      ref,
      term,
      value: parseFloat(value),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white border rounded-xl p-6 w-full max-w-md flex flex-col gap-4 shadow-lg">
        <h2 className="text-base font-semibold">
          {editing ? TEXTS.titles.update : TEXTS.titles.create}
        </h2>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground">
            {TEXTS.fields.name}
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm w-full"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground">
              {TEXTS.fields.value}
            </label>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm w-full"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground">
              {TEXTS.fields.group}
            </label>
            <select
              value={groupId ?? ""}
              onChange={(e) =>
                setGroupId(e.target.value ? Number(e.target.value) : undefined)
              }
              className="border rounded-md px-3 py-2 text-sm w-full cursor-pointer transition-colors hover:border-border/80 focus:border-primary focus:outline-none"
            >
              <option value="">No group</option>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground">
              {TEXTS.fields.term}
            </label>
            <input
              type="date"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm w-full transition-colors hover:border-border/80 focus:border-primary focus:outline-none"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground">
              {TEXTS.fields.ref}
            </label>
            <input
              type="text"
              value={ref}
              onChange={(e) => setRef(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm w-full"
            />
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={paid}
            onChange={(e) => setPaid(e.target.checked)}
          />
          {TEXTS.fields.paid}
        </label>

        <div className="flex gap-2 justify-end mt-2">
          <button
            onClick={onClose}
            className="text-sm px-4 py-2 border rounded-md cursor-pointer transition-colors hover:bg-muted/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary/50 active:scale-95"
          >
            {TEXTS.buttons.cancel}
          </button>
          <button
            onClick={handleSubmit}
            className="text-sm px-4 py-2 bg-primary text-primary-foreground rounded-md cursor-pointer transition-transform hover:brightness-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary/50 active:scale-95"
          >
            {editing ? TEXTS.buttons.update : TEXTS.buttons.create}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BillForm;
