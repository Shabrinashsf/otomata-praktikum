export type PDAState = "q_start" | "q_read" | "q_match" | "q_accept" | "q_reject";

export interface PDAStep {
  current_state: PDAState;
  input: string;
  top_stack: string;
  action: string;
  next_state: PDAState;
  stack_after: string[];
}

export interface CheckPDARequest {
  input: string;
  language: string; // "brackets", "anbn", "palindrome"
}

export interface CheckPDAResponse {
  input: string;
  language: string;
  accepted: boolean;
  final_state: PDAState;
  steps: PDAStep[];
  reason: string;
}
