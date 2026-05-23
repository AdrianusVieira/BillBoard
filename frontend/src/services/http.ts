const BASE_URL = "http://localhost:8000";

const http = async (path: string, options?: RequestInit) => {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok)
    throw new Error(`Request failed: ${res.status} ${res.statusText}`);
  return res.json();
};

export default http;
