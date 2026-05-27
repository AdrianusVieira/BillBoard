import { useState } from "react";
import { Plus, Settings, RefreshCcw } from "lucide-react";
import { GroupSettings } from "@/features/groups";
import RecurrentSettings from "@/features/recurrent/components/RecurrentSettings";
import useBillsScreen from "@/features/bills/hooks/useBillsScreen";
import BillFilters from "./BillFilters";
import BillForm from "./BillForm";
import BillList from "./BillList";
import BillStats from "./BillStats";
import { generateRecurrentBills } from "@/services/jobs.service";

const TEXTS = {
  buttons: {
    addBill: "Add bill",
    settings: "Settings",
  },
  error: "Failed to load bills.",
  loading: "Loading...",
  settings: {
    close: "✕",
    title: "Settings",
    tabs: {
      groups: "Groups",
      recurrent: "Recurrent",
    },
  },
  title: "Bill Board",
};

const BillsPage = () => {
  const {
    dateFrom,
    dateTo,
    editing,
    error,
    filteredBills,
    groups,
    isFormOpen,
    loading,
    recurrents,
    search,
    statusFilter,
    totalValue,
    handleClearDates,
    handleChangeDateFrom,
    handleChangeDateTo,
    handleChangeSearch,
    handleChangeStatusFilter,
    handleCloseForm,
    handleOpenAdd,
    handleOpenEdit,
    handleRemove,
    handleSubmit,
    handleTogglePaid,
    handleDuplicate,
    refreshData,
  } = useBillsScreen();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState<"groups" | "recurrent">(
    "groups",
  );
  const [isReloading, setIsReloading] = useState(false);

  const shouldRenderContent = !loading && !error;

  const handleReloadRecurrent = async () => {
    setIsReloading(true);
    try {
      await generateRecurrentBills();
      await refreshData();
    } catch (error) {
      console.error("Failed to reload recurrent bills:", error);
    } finally {
      setIsReloading(false);
    }
  };

  const showLoading = () => (
    <p className="text-sm text-muted-foreground text-center py-8">
      {TEXTS.loading}
    </p>
  );

  const showError = () => (
    <p className="text-sm text-destructive text-center py-8">{TEXTS.error}</p>
  );

  const showContent = () => (
    <div className="flex flex-col gap-6">
      <BillStats totalBills={filteredBills.length} totalValue={totalValue} />
      <BillFilters
        dateFrom={dateFrom}
        dateTo={dateTo}
        search={search}
        statusFilter={statusFilter}
        onClearDates={handleClearDates}
        onChangeDateFrom={handleChangeDateFrom}
        onChangeDateTo={handleChangeDateTo}
        onChangeSearch={handleChangeSearch}
        onChangeStatusFilter={handleChangeStatusFilter}
      />
      <BillList
        bills={filteredBills}
        groups={groups}
        recurrents={recurrents}
        onEdit={handleOpenEdit}
        onRemove={handleRemove}
        onTogglePaid={handleTogglePaid}
        onDuplicate={handleDuplicate}
      />
    </div>
  );

  const showSettings = () => (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white border rounded-xl p-6 w-full max-w-md flex flex-col gap-4 shadow-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold">{TEXTS.settings.title}</h2>
          <button
            onClick={() => setIsSettingsOpen(false)}
            className="text-muted-foreground hover:text-foreground text-sm cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary/50 active:scale-95"
          >
            {TEXTS.settings.close}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-0 border-b">
          <button
            onClick={() => setSettingsTab("groups")}
            className={`text-sm px-4 py-2 border-b-2 transition-colors cursor-pointer focus:outline-none ${
              settingsTab === "groups"
                ? "border-primary text-primary font-medium"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
            style={{ marginBottom: "-1px" }}
          >
            {TEXTS.settings.tabs.groups}
          </button>
          <button
            onClick={() => setSettingsTab("recurrent")}
            className={`text-sm px-4 py-2 border-b-2 transition-colors cursor-pointer focus:outline-none ${
              settingsTab === "recurrent"
                ? "border-primary text-primary font-medium"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
            style={{ marginBottom: "-1px" }}
          >
            {TEXTS.settings.tabs.recurrent}
          </button>
        </div>

        {settingsTab === "groups" && <GroupSettings />}
        {settingsTab === "recurrent" && <RecurrentSettings />}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">{TEXTS.title}</h1>
          <div className="flex gap-2">
            <button
              onClick={handleReloadRecurrent}
              disabled={isReloading}
              className="flex items-center gap-2 text-sm px-4 py-2 border rounded-md text-muted-foreground cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary/50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCcw className="w-4 h-4" />
              {isReloading ? "Reloading..." : "Reload"}
            </button>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-2 text-sm px-4 py-2 border rounded-md text-muted-foreground cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary/50 active:scale-95"
            >
              <Settings className="w-4 h-4" />
              {TEXTS.buttons.settings}
            </button>
            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-2 text-sm px-4 py-2 bg-primary text-primary-foreground rounded-md cursor-pointer transition-transform hover:brightness-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary/50 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              {TEXTS.buttons.addBill}
            </button>
          </div>
        </div>

        {loading && showLoading()}
        {error && showError()}
        {shouldRenderContent && showContent()}
      </div>

      {isFormOpen && (
        <BillForm
          editing={editing}
          groups={groups}
          recurrents={recurrents}
          onClose={handleCloseForm}
          onSubmit={handleSubmit}
        />
      )}

      {isSettingsOpen && showSettings()}
    </div>
  );
};

export default BillsPage;
