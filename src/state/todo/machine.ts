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
        CHANGE: {
          actions: assign({
            title: (ctx, e) => e.value,
          }),
        },
        CHANGE_COMMIT: {
          target: "reading",
          actions: sendParent((ctx) => {
            if (!ctx.title.trim().length) {
              return { type: "TODO.DELETE", id: ctx.id };
            }
            return { type: "TODO.UPDATE", todo: ctx };
          }),
        },
        CHANGE_CANCEL: {
          target: "reading",
          actions: assign({ title: (ctx) => ctx.prevTitle }),
        },
      },
    },
  },
});

export default todoMachine;
