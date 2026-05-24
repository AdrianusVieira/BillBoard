export const EStatusFilter = {
  All: "all",
  Paid: "paid",
  Unpaid: "unpaid",
} as const;

export type TStatusFilter = typeof EStatusFilter[keyof typeof EStatusFilter];