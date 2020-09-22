import { Machine, assign, sendParent } from "xstate";
import { TodoContext, TodoEvent } from "./types";

const todoMachine = Machine<TodoContext, TodoEvent>({
  id: "todo",
  initial: "reading",
  states: {
    reading: {
      on: {
        EDIT: "editing",
        TOGGLE_COMPLETE: {
          actions: [
            assign((ctx) => ({
              completed: !ctx.completed,
            })),
            sendParent("TODO.UPDATE"),
          ],
        },
        DELETE: {
          actions: sendParent((ctx) => ({
            type: "TODO.DELETE",
            id: ctx.id,
          })),
        },
      },
    },
    editing: {
      entry: assign((ctx) => ({ prevTitle: ctx.title })),
      on: {
        "TITLE.CHANGE": {
          actions: assign((_, e) => ({
            title: e.value,
          })),
        },
        "TITLE.COMMIT_CHANGE": {
          target: "reading",
          actions: [
            assign((ctx) => ({ title: ctx.title.trim() })),
            sendParent((ctx) => {
              if (!ctx.title.length) {
                return { type: "TODO.DELETE", id: ctx.id };
              }
              return { type: "TODO.UPDATE" };
            }),
          ],
        },
        "TITLE.CANCEL_CHANGE": {
          target: "reading",
          actions: assign((ctx) => ({ title: ctx.prevTitle })),
        },
      },
    },
  },
  on: {
    SET_ACTIVE: {
      actions: [
        assign({ completed: false } as Partial<TodoContext>),
        sendParent("TODO.UPDATE"),
      ],
    },
    SET_COMPLETED: {
      actions: [
        assign({ completed: true } as Partial<TodoContext>),
        sendParent("TODO.UPDATE"),
      ],
    },
  },
});

export default todoMachine;
