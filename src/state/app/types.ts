import { TodoContext } from "../todo/types";

export interface AppContext {
  newTodoText: string;
  todos: TodoContext[];
}

export interface AppStateSchema {
  states: {
    ready: {};
  };
}

export type AppEvent =
  | { type: "NEW_TODO.COMMIT" }
  | { type: "NEW_TODO.CHANGE"; value: string };
