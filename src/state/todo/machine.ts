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
            sendParent((ctx) => ({ type: "TODO.UPDATE", todo: ctx })),
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
      onEntry: assign({ prevTitle: (ctx) => ctx.title }),
      on: {
        "TITLE.CHANGE": {
          actions: assign({
            title: (ctx, e) => e.value,
          }),
        },
        "TITLE.COMMIT_CHANGE": {
          target: "reading",
          actions: [
            assign((ctx) => ({ title: ctx.title.trim() })),
            sendParent((ctx) => {
              if (!ctx.title.length) {
                return { type: "TODO.DELETE", id: ctx.id };
              }
              return { type: "TODO.UPDATE", todo: ctx };
            }),
          ],
        },
        "TITLE.CANCEL_CHANGE": {
          target: "reading",
          actions: assign({ title: (ctx) => ctx.prevTitle }),
        },
      },
    },
  },
  on: {
    SET_ACTIVE: {
      actions: [
        assign({ completed: false } as Partial<TodoContext>),
        sendParent((ctx) => ({ type: "TODO.UPDATE", todo: ctx })),
      ],
    },
    SET_COMPLETED: {
      actions: [
        assign({ completed: true } as Partial<TodoContext>),
        sendParent((ctx) => ({ type: "TODO.UPDATE", todo: ctx })),
      ],
    },
  },
});

export default todoMachine;
