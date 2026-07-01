import type { AnalyzeRequest, AnalyzeResponse } from "@/types/token";

// In dev, Next.js runs on :3000 and Go runs on :8080.
// In prod, Go serves everything on the same origin.
// Removed BASE URL, Vercel natively routes /api

export async function analyzeCode(
  code: string,
  lang: string
): Promise<AnalyzeResponse> {
  const body: AnalyzeRequest = { code, lang };
  const res = await fetch(`/api/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`API error ${res.status}: ${err}`);
  }
  return res.json() as Promise<AnalyzeResponse>;
}
