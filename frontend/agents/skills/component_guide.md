# Component Guide

## Structure of every component

```jsx
// 1. Imports — React → third party → internal
import { useState } from "react"
import { SomeIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useBills } from "@/features/bills/hooks/useBills"

// 2. Component definition — always arrow function
const ComponentName = () => {
  // 3. State — local UI state only
  const [open, setOpen] = useState(false)

  // 4. Store/hook consumption
  const { bills, loading, error } = useBills()

  // 5. Early returns for loading and error
  if (loading) return <div>Loading...</div>
  if (error) return <div>Something went wrong.</div>

  // 6. Render
  return (
    <div>
      {/* JSX here */}
    </div>
  )
}

// 7. Default export at the bottom
export default ComponentName
```

## Structure of every hook

```js
import { useState, useEffect } from "react"
import { getbills } from "@/services/api"
import { useBillStore } from "@/features/bills/store"

const useBills = () => {
  const { bills, setBills } = useBillStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      try {
        const data = await getBills()
        setBills(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  return { bills, loading, error }
}

export default useBills
```

## Structure of every Zustand store

```js
import { create } from "zustand"

export const useBillStore = create((set) => ({
  bills: [],
  setBills: (bills) => set({ bills }),
  addBill: (bill) => set((state) => ({ bills: [...state.bills, bill] })),
  updateBill: (updated) => set((state) => ({
    bills: state.bills.map((b) => b.id === updated.id ? updated : b)
  })),
  removeBill: (id) => set((state) => ({
    bills: state.bills.filter((b) => b.id !== id)
  })),
}))
```

## Structure of every index.js

```js
export { default as BillCard } from "./components/BillCard"
export { default as BillForm } from "./components/BillForm"
export { useBills } from "./hooks/useBills"
export { useBillStore } from "./store"
```