import http from "./http";
import IGroupPayload from "@/shared/types/IGroupPayload";

export const getGroups = () => http("/groups/");

export const createGroup = (group: IGroupPayload) =>
  http("/groups/", { method: "POST", body: JSON.stringify(group) });

export const updateGroup = (id: number, group: IGroupPayload) =>
  http(`/groups/${id}`, { method: "PUT", body: JSON.stringify(group) });

export const deleteGroup = (id: number) =>
  http(`/groups/${id}`, { method: "DELETE" });
