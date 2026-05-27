import http from "./http";

export const generateRecurrentBills = () =>
  http("/jobs/generate-recurrent", { method: "POST" });
