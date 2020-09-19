import { Machine, assign, sendParent } from "xstate";
import { TodoContext, TodoEvent } from "./types";

const todoMachine = Machine<TodoContext, TodoEvent>({
  id: "todo",
  initial: "ready",
  states: {
    ready: {},
  },
  on: {
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
});

export default todoMachine;
