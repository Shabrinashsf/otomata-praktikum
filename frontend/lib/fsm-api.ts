import type { CheckRequest, CheckResponse } from "@/types/fsm";

const BASE =
  process.env.NODE_ENV === "development" ? "http://localhost:8888" : "";

export async function checkFSM(input: string): Promise<CheckResponse> {
  const body: CheckRequest = { input };
  const res = await fetch(`${BASE}/api/fsm`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`API error ${res.status}: ${err}`);
  }
  return res.json() as Promise<CheckResponse>;
}
