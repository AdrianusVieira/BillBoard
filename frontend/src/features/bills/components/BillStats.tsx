const TEXTS = {
  totalBills: "Total bills",
  totalValue: "Total value",
}

interface BillStatsProps {
  totalBills: number
  totalValue: number
}

const BillStats = ({ totalBills, totalValue }: BillStatsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-muted rounded-lg p-4">
        <p className="text-xs text-muted-foreground mb-1">{TEXTS.totalBills}</p>
        <p className="text-2xl font-semibold">{totalBills}</p>
      </div>
      <div className="bg-muted rounded-lg p-4">
        <p className="text-xs text-muted-foreground mb-1">{TEXTS.totalValue}</p>
        <p className="text-2xl font-semibold">
          R$ {totalValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
        </p>
      </div>
    </div>
  )
}

export default BillStats