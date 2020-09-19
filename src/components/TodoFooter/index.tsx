import { useService } from "@xstate/react";

import { appService } from "src/state/app";

export default function TodoFooter() {
  const [state] = useService(appService);
  const { todos } = state.context;
  const activeTodos = todos.filter((todo) => !todo.completed);

  if (!todos.length) {
    return null;
  }

  return (
    <footer className="footer">
      <span className="todo-count">
        {activeTodos.length} item{activeTodos.length !== 1 && "s"} left
      </span>
      <ul className="filters">
        <li>
          <a href="#/" className="selected">
            All
          </a>
        </li>
        <li>
          <a href="#/active">Active</a>
        </li>
        <li>
          <a href="#/completed">Completed</a>
        </li>
      </ul>
      {activeTodos.length < todos.length && (
        <button className="clear-completed">Clear completed</button>
      )}
    </footer>
  );
}