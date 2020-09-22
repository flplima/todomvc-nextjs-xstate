import { Interpreter } from "xstate";
import { TodoContext } from "../todo/types";

export interface AppContext {
  todos: Interpreter<TodoContext>[];
}

export interface AppStateSchema {
  states: {
    fetchingTodos: {};
    persistingTodos: {};
    ready: {};
  };
}

export type AppEvent =
  | { type: "TODO.CREATE"; title: string }
  | { type: "TODO.UPDATE" }
  | { type: "TODO.DELETE"; id: number }
  | { type: "MARK_ALL.ACTIVE" }
  | { type: "MARK_ALL.COMPLETED" }
  | { type: "CLEAR_COMPLETED" }
  | { type: "PERSIST_TODOS" };
