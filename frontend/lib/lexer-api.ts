import type { AnalyzeRequest, AnalyzeResponse } from "@/types/token";

// In dev, Next.js runs on :3000 and Go runs on :8080.
// In prod, Go serves everything on the same origin.
const BASE =
  process.env.NODE_ENV === "development" ? "http://localhost:8888" : "";

export async function analyzeCode(
  code: string,
  lang: string
): Promise<AnalyzeResponse> {
  const body: AnalyzeRequest = { code, lang };
  const res = await fetch(`${BASE}/api/analyze`, {
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
