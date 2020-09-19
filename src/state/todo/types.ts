import { Interpreter } from "xstate";

export interface TodoContext {
  id: number;
  title: string;
  prevTitle?: string;
  completed: boolean;
  ref?: Interpreter<TodoContext>;
}

export interface TodoStateSchema {
  states: {
    reading: {};
    editing: {};
  };
}

export type TodoEvent =
  | { type: "EDIT"; value: string }
  | { type: "CHANGE"; value: string }
  | { type: "CHANGE_COMMIT" }
  | { type: "CHANGE_CANCEL" }
  | { type: "TOGGLE_COMPLETE" }
  | { type: "DELETE" };
