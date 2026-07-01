import type { CheckPDARequest, CheckPDAResponse } from "@/types/pda";

const BASE =
  process.env.NODE_ENV === "development" ? "http://localhost:8888" : "";

export async function checkPDA(input: string, language: string): Promise<CheckPDAResponse> {
  const body: CheckPDARequest = { input, language };
  const res = await fetch(`${BASE}/api/pda`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`API error ${res.status}: ${err}`);
  }
  return res.json() as Promise<CheckPDAResponse>;
}
