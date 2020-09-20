import { Machine, assign, spawn, send, actions } from "xstate";

import { todoMachine, TodoContext } from "src/state/todo";
import { AppContext, AppEvent, AppStateSchema } from "src/state/app";

const appMachine = Machine<AppContext, AppStateSchema, AppEvent>({
  id: "app",
  initial: "fetchingTodos",
  context: {
    newTodoText: "Hello todos",
    todos: [],
  },
  states: {
    fetchingTodos: {
      invoke: {
        src: () => {
          if (process.browser) {
            return fetch("api").then((res) => res.json());
          }
        },
        onDone: {
          target: "ready",
          actions: assign((ctx, e) => ({
            todos: e.data.map((todo) => ({
              ...todo,
              ref: spawn(todoMachine.withContext(todo)),
            })),
          })),
        },
      },
    },
    persistingTodos: {
      invoke: {
        src: (ctx) => {
          const body = JSON.stringify(
            ctx.todos.map((todo) => ({
              id: todo.id,
              title: todo.title,
              completed: todo.completed,
            }))
          );
          return fetch("api", { method: "PUT", body });
        },
        onDone: "ready",
      },
    },
    ready: {},
  },
  on: {
    "NEW_TODO.CHANGE": {
      actions: assign({
        newTodoText: (ctx, e) => e.value,
      }),
    },
    "NEW_TODO.COMMIT": {
      actions: [
        assign({
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
        send("PERSIST_TODOS"),
      ],
    },
    "TODO.UPDATE": {
      actions: [
        assign({
          todos: (ctx, e) =>
            ctx.todos.map((todo) => {
              return todo.id === e.todo.id
                ? { ...todo, ...e.todo, ref: todo.ref }
                : todo;
            }),
        }),
        actions.cancel("debounced-persist-todos"),
        send("PERSIST_TODOS", {
          delay: 200,
          id: "debounced-persist-todos",
        }),
      ],
    },
    "TODO.DELETE": {
      actions: [
        assign({
          todos: (ctx, e) => ctx.todos.filter((todo) => todo.id !== e.id),
        }),
        send("PERSIST_TODOS"),
      ],
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
      actions: [
        assign((ctx) => ({
          todos: ctx.todos.filter((todo) => !todo.completed),
        })),
        send("PERSIST_TODOS"),
      ],
    },
    PERSIST_TODOS: "persistingTodos",
  },
});

export default appMachine;
