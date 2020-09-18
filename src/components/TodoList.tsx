import { useService } from "@xstate/react";

import { appService } from "src/state/app";
import TodoItem from "./TodoItem";

export default function TodoList() {
  const [state] = useService(appService);
  const { todos } = state.context;

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoItem todoRef={todo.ref} />
      ))}
    </ul>
  );
}
