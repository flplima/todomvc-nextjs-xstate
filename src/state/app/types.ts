import { TodoContext } from "../todo/types";

export interface AppContext {
  newTodoText: string;
  todos: TodoContext[];
}

export interface AppStateSchema {
  states: {
    fetchingTodos: {};
    persistingTodos: {};
    ready: {};
  };
}

export type AppEvent =
  | { type: "NEW_TODO.COMMIT" }
  | { type: "NEW_TODO.CHANGE"; value: string }
  | { type: "TODO.UPDATE"; todo: TodoContext }
  | { type: "TODO.DELETE"; id: number }
  | { type: "MARK_ALL.ACTIVE" }
  | { type: "MARK_ALL.COMPLETED" }
  | { type: "CLEAR_COMPLETED" }
  | { type: "PERSIST_TODOS" };
