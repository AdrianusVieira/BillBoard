import IBill from "@/shared/interfaces/IBill";
import IBillPayload from "@/shared/interfaces/IBillPayload";
import IGroup from "@/shared/interfaces/IGroup";
import IRecurrent from "@/shared/interfaces/IRecurrent";
import IRecurrentPayload from "@/shared/interfaces/IRecurrentPayload";
import { EFrequency, TFrequency } from "@/shared/types/TFrequency";
import { useState, useEffect } from "react";

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
    recurrent: "Recurrent bill",
    frequency: "Frequency",
    recurrentDay: "Recurrent day",
    variableValue: "Variable value",
  },
  titles: {
    create: "Add bill",
    update: "Edit bill",
  },
  frequency: {
    weekly: "Weekly",
    monthly: "Monthly",
    yearly: "Yearly",
  },
};

interface BillFormProps {
  editing: IBill | null;
  groups: IGroup[];
  recurrents: IRecurrent[];
  onClose: () => void;
  onSubmit: (
    payload: IBillPayload,
    recurrentPayload?: IRecurrentPayload,
  ) => void;
}

const BillForm = ({
  editing,
  groups,
  recurrents,
  onClose,
  onSubmit,
}: BillFormProps) => {
  const [groupId, setGroupId] = useState<number | undefined>(undefined);
  const [name, setName] = useState("");
  const [paid, setPaid] = useState(false);
  const [ref, setRef] = useState("");
  const [term, setTerm] = useState("");
  const [value, setValue] = useState("");

  // Recurrent fields
  const [isRecurrent, setIsRecurrent] = useState(false);
  const [frequency, setFrequency] = useState<TFrequency>(EFrequency.Monthly);
  const [recurrentDay, setRecurrentDay] = useState("");
  const [isVariable, setIsVariable] = useState(false);

  useEffect(() => {
    if (editing) {
      setGroupId(editing.group_id);
      setName(editing.name);
      setPaid(editing.paid);
      setRef(editing.ref ?? "");
      setTerm(editing.term ?? "");
      setValue(String(editing.value));

      // If editing a recurrent bill, pre-fill recurrent fields
      if (editing.recurrent_id) {
        const recurrent = recurrents.find((r) => r.id === editing.recurrent_id);
        if (recurrent) {
          setIsRecurrent(true);
          setFrequency(recurrent.frequency);
          setRecurrentDay(String(recurrent.recurrent_day));
          setIsVariable(recurrent.is_variable);
        }
      }
    } else {
      setGroupId(undefined);
      setName("");
      setPaid(false);
      setRef("");
      setTerm("");
      setValue("");
      setIsRecurrent(false);
      setFrequency(EFrequency.Monthly);
      setRecurrentDay("");
      setIsVariable(false);
    }
  }, [editing, recurrents]);

  const handleSubmit = () => {
    if (!name.trim() || !value) return;

    const billPayload: IBillPayload = {
      group_id: groupId,
      name,
      paid,
      ref,
      term,
      value: parseFloat(value),
      recurrent_id: editing?.recurrent_id ?? null,
    };

    let recurrentPayload: IRecurrentPayload | undefined;

    if (isRecurrent && recurrentDay) {
      recurrentPayload = {
        is_variable: isVariable,
        estimated_value: parseFloat(value),
        frequency,
        recurrent_day: parseInt(recurrentDay),
      };
    }

    onSubmit(billPayload, recurrentPayload);
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
              className="border rounded-md px-3 py-2 text-sm w-full cursor-pointer"
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
              className="border rounded-md px-3 py-2 text-sm w-full"
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

        {/* Recurrent section — only show when creating */}
        {!editing && (
          <div className="border rounded-md p-3 bg-muted/30 flex flex-col gap-3">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={isRecurrent}
                onChange={(e) => setIsRecurrent(e.target.checked)}
              />
              {TEXTS.fields.recurrent}
            </label>

            {isRecurrent && (
              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-muted-foreground">
                      {TEXTS.fields.frequency}
                    </label>
                    <select
                      value={frequency}
                      onChange={(e) =>
                        setFrequency(e.target.value as TFrequency)
                      }
                      className="border rounded-md px-3 py-2 text-sm w-full cursor-pointer"
                    >
                      <option value="monthly">{TEXTS.frequency.monthly}</option>
                      <option value="weekly">{TEXTS.frequency.weekly}</option>
                      <option value="yearly">{TEXTS.frequency.yearly}</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-muted-foreground">
                      {TEXTS.fields.recurrentDay}
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={31}
                      placeholder="15"
                      value={recurrentDay}
                      onChange={(e) => setRecurrentDay(e.target.value)}
                      className="border rounded-md px-3 py-2 text-sm w-full"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isVariable}
                    onChange={(e) => setIsVariable(e.target.checked)}
                  />
                  {TEXTS.fields.variableValue}
                </label>
              </div>
            )}
          </div>
        )}

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
