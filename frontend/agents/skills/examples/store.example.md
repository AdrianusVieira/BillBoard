# Example: Zustand Store

```ts
import { create } from "zustand"

interface Bill {
  id: number
  name: string
  value: number
  group_id: number
  paid: boolean
  term?: string
  ref?: string
}

interface BillStore {
  bills: Bill[]
  setBills: (bills: Bill[]) => void
  addBill: (bill: Bill) => void
  updateBill: (updated: Bill) => void
  removeBill: (id: number) => void
}

export const useBillStore = create<BillStore>((set) => ({
  bills: [],
  setBills: (bills) => set({ bills }),
  addBill: (bill) => set((state) => ({ bills: [...state.bills, bill] })),
  updateBill: (updated) => set((state) => ({
    bills: state.bills.map((b) => b.id === updated.id ? updated : b),
  })),
  removeBill: (id) => set((state) => ({
    bills: state.bills.filter((b) => b.id !== id),
  })),
}))
```