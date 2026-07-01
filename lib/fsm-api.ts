import type { CheckRequest, CheckResponse } from "@/types/fsm";

// Removed BASE URL, Vercel natively routes /api

export async function checkFSM(input: string): Promise<CheckResponse> {
  const body: CheckRequest = { input };
  const res = await fetch(`/api/fsm`, {
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
