// FSM types mirror backend/fsm/fsm.go
export type FSMState = "S" | "A" | "B" | "C";

export interface FSMStep {
  current_state: FSMState;
  input: string;
  next_state: FSMState;
  is_accepting: boolean;
}

export interface CheckRequest {
  input: string;
}

export interface CheckResponse {
  input: string;
  accepted: boolean;
  final_state: FSMState;
  steps: FSMStep[];
  reason: string;
}
