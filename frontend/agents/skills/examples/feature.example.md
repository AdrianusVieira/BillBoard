# Example: Feature Component

```tsx
import { Trash2, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useBills } from "@/features/bills/hooks/useBills"

interface Bill {
  id: number
  name: string
  value: number
  group: string
  paid: boolean
  term?: string
  ref?: string
}

interface BillCardProps {
  bill: Bill
}

const BillCard = ({ bill }: BillCardProps) => {
  const { removeBill } = useBills()

  return (
    
      
        {bill.name}
        {bill.group}
      
      
        R$ {bill.value}
        
          
        
        <Button variant="ghost" size="icon" onClick={() => removeBill(bill.id)}>
          
        
      
    
  )
}

export default BillCard
```