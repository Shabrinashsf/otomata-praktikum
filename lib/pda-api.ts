import type { CheckPDARequest, CheckPDAResponse } from "@/types/pda";

// Removed BASE URL, Vercel natively routes /api

export async function checkPDA(input: string, language: string): Promise<CheckPDAResponse> {
  const body: CheckPDARequest = { input, language };
  const res = await fetch(`/api/pda`, {
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
