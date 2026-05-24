import { useState } from "react"
import { Plus, Settings } from "lucide-react"
import { GroupSettings } from "@/features/groups"
import useBillsScreen from "@/features/bills/hooks/useBillsScreen"
import BillFilters from "./BillFilters"
import BillForm from "./BillForm"
import BillList from "./BillList"
import BillStats from "./BillStats"

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
  },
  title: "Bill Board",
}

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
  } = useBillsScreen()

  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  const shouldRenderContent = !loading && !error

  const showLoading = () => (
    <p className="text-sm text-muted-foreground text-center py-8">
      {TEXTS.loading}
    </p>
  )

  const showError = () => (
    <p className="text-sm text-destructive text-center py-8">{TEXTS.error}</p>
  )

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
        onEdit={handleOpenEdit}
        onRemove={handleRemove}
        onTogglePaid={handleTogglePaid}
      />
    </div>
  )

  const showSettings = () => (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white border rounded-xl p-6 w-full max-w-md flex flex-col gap-4 shadow-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold">{TEXTS.settings.title}</h2>
          <button
            onClick={() => setIsSettingsOpen(false)}
            className="text-muted-foreground hover:text-foreground text-sm"
          >
            {TEXTS.settings.close}
          </button>
        </div>
        <GroupSettings />
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">{TEXTS.title}</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-2 text-sm px-4 py-2 border rounded-md text-muted-foreground"
            >
              <Settings className="w-4 h-4" />
              {TEXTS.buttons.settings}
            </button>
            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-2 text-sm px-4 py-2 bg-primary text-primary-foreground rounded-md"
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
          onClose={handleCloseForm}
          onSubmit={handleSubmit}
        />
      )}

      {isSettingsOpen && showSettings()}
    </div>
  )
}

export default BillsPage