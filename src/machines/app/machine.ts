import { Machine, assign, spawn, send, actions } from "xstate";

import { todoMachine } from "src/machines/todo";
import { AppContext, AppEvent, AppStateSchema } from "src/machines/app";

const appMachine = Machine<AppContext, AppStateSchema, AppEvent>({
  id: "app",
  initial: "fetchingTodos",
  context: {
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
            todos: e.data.map((todo) => spawn(todoMachine.withContext(todo))),
          })),
        },
        onError: {
          target: "ready",
          actions: () => {
            alert("There was a problem fetching todos");
          },
        },
      },
    },
    persistingTodos: {
      invoke: {
        src: (ctx) => {
          const data = ctx.todos.map((todo) => {
            const { id, title, completed } = todo.state.context;
            return { id, title, completed };
          });
          return fetch("api", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });
        },
        onDone: "ready",
        onError: {
          target: "ready",
          actions: () => {
            alert("There was a problem persisting todos");
          },
        },
      },
    },
    ready: {},
  },
  on: {
    "TODO.CREATE": {
      actions: [
        assign((ctx, e) => ({
          todos: [
            ...ctx.todos,
            spawn(
              todoMachine.withContext({
                id: Date.now() + Math.random(),
                title: e.title.trim(),
                completed: false,
              })
            ),
          ],
        })),
        send("PERSIST_TODOS"),
      ],
      cond: (ctx, e) => !!e.title.trim().length,
    },
    "TODO.UPDATE": {
      actions: [
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
          todos: (ctx, e) =>
            ctx.todos.filter((todo) => todo.state.context.id !== e.id),
        }),
        send("PERSIST_TODOS"),
      ],
    },
    "MARK_ALL.COMPLETED": {
      actions: (ctx) => {
        ctx.todos.forEach((todo) => todo.send("SET_COMPLETED"));
      },
    },
    "MARK_ALL.ACTIVE": {
      actions: (ctx) => {
        ctx.todos.forEach((todo) => todo.send("SET_ACTIVE"));
      },
    },
    CLEAR_COMPLETED: {
      actions: [
        assign((ctx) => ({
          todos: ctx.todos.filter((todo) => !todo.state.context.completed),
        })),
        send("PERSIST_TODOS"),
      ],
    },
    PERSIST_TODOS: "persistingTodos",
  },
});

export default appMachine;
