import http from "./http";
import IBillPayload from "@/shared/interfaces/IBillPayload";

export const getBills = () => http("/bills/");

export const createBill = (bill: IBillPayload) =>
  http("/bills/", { method: "POST", body: JSON.stringify(bill) });

export const updateBill = (id: number, bill: IBillPayload) =>
  http(`/bills/${id}`, { method: "PUT", body: JSON.stringify(bill) });

export const deleteBill = (id: number) =>
  http(`/bills/${id}`, { method: "DELETE" });
