export interface TodoContext {
  id: number;
  title: string;
  prevTitle?: string;
  completed: boolean;
}

export interface TodoStateSchema {
  states: {
    reading: {};
    editing: {};
  };
}

export type TodoEvent =
  | { type: "EDIT"; value: string }
  | { type: "TITLE.CHANGE"; value: string }
  | { type: "TITLE.COMMIT_CHANGE" }
  | { type: "TITLE.CANCEL_CHANGE" }
  | { type: "TOGGLE_COMPLETE" }
  | { type: "SET_COMPLETED" }
  | { type: "SET_ACTIVE" }
  | { type: "DELETE" };
