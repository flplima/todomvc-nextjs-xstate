import { Interpreter } from "xstate";
import { useService } from "@xstate/react";

import { appService } from "src/machines/app";
import { TodoContext } from "src/machines/todo";
import { useHash } from "src/hooks";
import TodoItem from "./TodoItem";

export default function TodoList() {
  const hash = useHash();
  const [state] = useService(appService);
  const { todos } = state.context;

  const filterTodoByHash = (todo: Interpreter<TodoContext>) => {
    const { completed } = todo.state.context;
    if (hash === "active") {
      return !completed;
    }
    if (hash === "completed") {
      return completed;
    }
    return true;
  };

  return (
    <ul className="todo-list">
      {todos.filter(filterTodoByHash).map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
}
