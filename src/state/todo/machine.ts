import { Machine } from "xstate";
import { TodoContext, TodoEvent } from "./types";

const todoMachine = Machine<TodoContext, TodoEvent>({
  id: "todo",
  initial: "ready",
  states: {
    ready: {},
  },
});

export default todoMachine;
