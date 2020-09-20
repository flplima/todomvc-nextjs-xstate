import { Machine, assign, spawn } from "xstate";

import { todoMachine, TodoContext } from "src/state/todo";
import { AppContext, AppEvent, AppStateSchema } from "src/state/app";

const appMachine = Machine<AppContext, AppStateSchema, AppEvent>({
  id: "app",
  initial: "ready",
  context: {
    newTodoText: "Hello todos",
    todos: [],
  },
  states: {
    ready: {},
  },
  on: {
    "NEW_TODO.CHANGE": {
      actions: assign({
        newTodoText: (ctx, e) => e.value,
      }),
    },
    "NEW_TODO.COMMIT": {
      actions: assign({
        newTodoText: "",
        todos: (ctx: AppContext) => {
          const newTodo: TodoContext = {
            id: Date.now() + Math.random(),
            title: ctx.newTodoText.trim(),
            completed: false,
          };
          newTodo.ref = spawn(todoMachine.withContext(newTodo));
          return [...ctx.todos, newTodo];
        },
      }),
    },
    "TODO.UPDATE": {
      actions: assign({
        todos: (ctx, e) =>
          ctx.todos.map((todo) => {
            return todo.id === e.todo.id
              ? { ...todo, ...e.todo, ref: todo.ref }
              : todo;
          }),
      }),
    },
    "TODO.DELETE": {
      actions: assign({
        todos: (ctx, e) => ctx.todos.filter((todo) => todo.id !== e.id),
      }),
    },
    "MARK_ALL.COMPLETED": {
      actions: (ctx) => {
        ctx.todos.forEach((todo) => todo.ref.send("SET_COMPLETED"));
      },
    },
    "MARK_ALL.ACTIVE": {
      actions: (ctx) => {
        ctx.todos.forEach((todo) => todo.ref.send("SET_ACTIVE"));
      },
    },
    CLEAR_COMPLETED: {
      actions: assign((ctx) => ({
        todos: ctx.todos.filter((todo) => !todo.completed),
      })),
    },
  },
});

export default appMachine;
