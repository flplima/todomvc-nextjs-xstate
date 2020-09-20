import { useService } from "@xstate/react";

import { appService } from "src/state/app";
import { TodoContext } from "src/state/todo";
import { useHash } from "src/hooks";
import TodoItem from "./TodoItem";

export default function TodoList() {
  const hash = useHash();
  const [state] = useService(appService);
  const { todos } = state.context;

  const filterTodoByHash = (todo: TodoContext) => {
    if (hash === "active") {
      return !todo.completed;
    }
    if (hash === "completed") {
      return todo.completed;
    }
    return true;
  };

  return (
    <ul className="todo-list">
      {todos.filter(filterTodoByHash).map((todo) => (
        <TodoItem key={todo.id} todoRef={todo.ref} />
      ))}
    </ul>
  );
}
