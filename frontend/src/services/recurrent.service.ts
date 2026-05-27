import IRecurrentPayload from "@/shared/interfaces/IRecurrentPayload";
import http from "./http";

export const getRecurrents = () => http("/recurrent/");

export const createRecurrent = (recurrent: IRecurrentPayload) =>
  http("/recurrent/", { method: "POST", body: JSON.stringify(recurrent) });

export const updateRecurrent = (
  id: string,
  recurrent: Partial<IRecurrentPayload>,
) =>
  http(`/recurrent/${id}`, { method: "PUT", body: JSON.stringify(recurrent) });

export const deleteRecurrent = (id: string) =>
  http(`/recurrent/${id}`, { method: "DELETE" });
