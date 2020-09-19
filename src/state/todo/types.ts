import { Interpreter } from "xstate";

export interface TodoContext {
  id: number;
  title: string;
  completed: boolean;
  ref?: Interpreter<TodoContext>;
}

export interface TodoStateSchema {
  states: {
    ready: {};
  };
}

export type TodoEvent = { type: "TOGGLE_COMPLETE" } | { type: "DELETE" };
