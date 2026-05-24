import { EStatusFilter, TStatusFilter } from "../types/TStatusFilter";

const TEXTS = {
  buttons: {
    clear: "Clear",
  },
  filters: {
    all: "All",
    paid: "Paid",
    unpaid: "Unpaid",
  },
  placeholders: {
    dateTo: "To",
    dateFrom: "From",
    search: "Search bills...",
  },
}

interface BillFiltersProps {
  dateFrom: string
  dateTo: string
  search: string
  statusFilter: TStatusFilter
  onClearDates: () => void
  onChangeDateFrom: (value: string) => void
  onChangeDateTo: (value: string) => void
  onChangeSearch: (value: string) => void
  onChangeStatusFilter: (value: TStatusFilter) => void
}

const BillFilters = ({
  dateFrom,
  dateTo,
  search,
  statusFilter,
  onClearDates,
  onChangeDateFrom,
  onChangeDateTo,
  onChangeSearch,
  onChangeStatusFilter,
}: BillFiltersProps) => {
  const statusOptions: TStatusFilter[] = [
    EStatusFilter.All,
    EStatusFilter.Unpaid,
    EStatusFilter.Paid,
  ]

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2 flex-wrap items-center">
        <input
          type="text"
          placeholder={TEXTS.placeholders.search}
          value={search}
          onChange={(e) => onChangeSearch(e.target.value)}
          className="flex-1 min-w-40 border rounded-md px-3 py-2 text-sm"
        />
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => onChangeDateFrom(e.target.value)}
          className="border rounded-md px-3 py-2 text-sm"
        />
        <span className="text-muted-foreground text-sm">→</span>
        <input
          type="date"
          value={dateTo}
          onChange={(e) => onChangeDateTo(e.target.value)}
          className="border rounded-md px-3 py-2 text-sm"
        />
        <button
          onClick={onClearDates}
          className="text-sm px-3 py-2 border rounded-md text-muted-foreground"
        >
          {TEXTS.buttons.clear}
        </button>
      </div>

      <div className="flex gap-2">
        {statusOptions.map((status) => (
          <button
            key={status}
            onClick={() => onChangeStatusFilter(status)}
            className={`text-sm px-4 py-1.5 rounded-full border transition-colors ${
              statusFilter === status
                ? "bg-primary text-primary-foreground border-primary"
                : "text-muted-foreground border-border"
            }`}
          >
            {TEXTS.filters[status]}
          </button>
        ))}
      </div>
    </div>
  )
}

export default BillFilters