import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { useRecurrentsQuery } from "@/features/recurrent/hooks/useRecurrentsQuery";
import IRecurrent from "@/shared/interfaces/IRecurrent";
import { EFrequency, TFrequency } from "@/shared/types/TFrequency";
import IRecurrentPayload from "@/shared/interfaces/IRecurrentPayload";

const TEXTS = {
  loading: "Loading recurrent bills...",
  loadError: "Failed to load recurrent bills.",
  empty: "No recurrent bills yet.",
  buttons: {
    cancel: "Cancel",
    add: "Add recurrent",
    update: "Update recurrent",
  },
  fields: {
    frequency: "Frequency",
    recurrentDay: "Recurrent day",
    estimatedValue: "Estimated value",
    variableValue: "Variable value",
  },
  frequency: {
    weekly: "Weekly",
    monthly: "Monthly",
    yearly: "Yearly",
  },
  badges: {
    variable: "variable",
    fixed: "fixed",
  },
};

const RecurrentSettings = () => {
  const { query, update, remove } = useRecurrentsQuery();

  const [editing, setEditing] = useState<IRecurrent | null>(null);
  const [frequency, setFrequency] = useState<TFrequency>(EFrequency.Monthly);
  const [recurrentDay, setRecurrentDay] = useState("");
  const [isVariable, setIsVariable] = useState(false);
  const [estimatedValue, setEstimatedValue] = useState("");

  const handleEdit = (recurrent: IRecurrent) => {
    setEditing(recurrent);
    setFrequency(recurrent.frequency);
    setRecurrentDay(String(recurrent.recurrent_day));
    setIsVariable(recurrent.is_variable);
    setEstimatedValue(
      recurrent.estimated_value != null
        ? String(recurrent.estimated_value)
        : "",
    );
  };

  const handleCancel = () => {
    setEditing(null);
    setFrequency(EFrequency.Monthly);
    setRecurrentDay("");
    setIsVariable(false);
    setEstimatedValue("");
  };

  const handleSubmit = async () => {
    if (!editing || !recurrentDay) return;

    const payload: Partial<IRecurrentPayload> = {
      frequency,
      recurrent_day: parseInt(recurrentDay),
      is_variable: isVariable,
      estimated_value: estimatedValue ? parseFloat(estimatedValue) : null,
    };

    await update.mutateAsync({ id: editing.id, payload });
    handleCancel();
  };

  const handleRemove = async (id: string) => {
    await remove.mutateAsync(id);
  };

  const shouldRenderContent = !query.isLoading && !query.error;
  const recurrents: IRecurrent[] = query.data ?? [];

  const showLoading = () => (
    <p className="text-sm text-muted-foreground">{TEXTS.loading}</p>
  );

  const showError = () => (
    <p className="text-sm text-destructive">{TEXTS.loadError}</p>
  );

  const showList = () => (
    <div className="flex flex-col gap-2">
      {recurrents.length === 0 && (
        <p className="text-sm text-muted-foreground">{TEXTS.empty}</p>
      )}
      {recurrents.map((r) => (
        <div
          key={r.id}
          className="flex items-start justify-between p-3 border rounded-lg"
        >
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`text-[11px] px-2 py-0.5 rounded-full border ${
                  r.is_variable
                    ? "bg-amber-50 text-amber-700 border-amber-200"
                    : "bg-blue-50 text-blue-700 border-blue-200"
                }`}
              >
                {r.is_variable ? TEXTS.badges.variable : TEXTS.badges.fixed}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {r.frequency.charAt(0).toUpperCase() + r.frequency.slice(1)} · day{" "}
              {r.recurrent_day}
              {r.estimated_value != null && (
                <>
                  {" "}
                  · est. R${" "}
                  {r.estimated_value.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </>
              )}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleEdit(r)}
              className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary/50 active:scale-95"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleRemove(r.id)}
              className="text-muted-foreground hover:text-destructive cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary/50 active:scale-95"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const showForm = () => (
    <div className="flex flex-col gap-3 border-t pt-4">
      <p className="text-sm font-medium">Edit Recurrent</p>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground">
            {TEXTS.fields.frequency}
          </label>
          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value as TFrequency)}
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
            value={recurrentDay}
            onChange={(e) => setRecurrentDay(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm w-full"
          />
        </div>
      </div>
      {isVariable && (
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground">
            {TEXTS.fields.estimatedValue}
          </label>
          <input
            type="number"
            value={estimatedValue}
            onChange={(e) => setEstimatedValue(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm w-full"
          />
        </div>
      )}
      <label className="flex items-center gap-2 text-sm cursor-pointer">
        <input
          type="checkbox"
          checked={isVariable}
          onChange={(e) => setIsVariable(e.target.checked)}
        />
        {TEXTS.fields.variableValue}
      </label>
      <div className="flex gap-2 justify-end">
        <button
          onClick={handleCancel}
          className="text-sm px-4 py-2 border rounded-md cursor-pointer transition-colors hover:bg-muted/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary/50 active:scale-95"
        >
          {TEXTS.buttons.cancel}
        </button>
        <button
          onClick={handleSubmit}
          className="text-sm px-4 py-2 bg-primary text-primary-foreground rounded-md cursor-pointer transition-transform hover:brightness-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary/50 active:scale-95"
        >
          {TEXTS.buttons.update}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      {query.isLoading && showLoading()}
      {query.error && showError()}
      {shouldRenderContent && (
        <>
          {showList()}
          {editing && showForm()}
        </>
      )}
    </div>
  );
};

export default RecurrentSettings;
