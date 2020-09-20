import Link from "next/link";
import clsx from "clsx";
import { useService } from "@xstate/react";

import { appService } from "src/machines/app";
import { useHash } from "src/hooks";

export default function TodoFooter() {
  const hash = useHash();
  const [state, send] = useService(appService);
  const { todos } = state.context;
  const activeTodos = todos.filter((todo) => !todo.completed);

  const onClickClearCompleted = () => {
    send("CLEAR_COMPLETED");
  };

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
          <Link href="/#/">
            <a
              className={clsx({
                selected: !["active", "completed"].includes(hash),
              })}
            >
              All
            </a>
          </Link>
        </li>
        <li>
          <Link href="/#/active">
            <a className={clsx({ selected: hash === "active" })}>Active</a>
          </Link>
        </li>
        <li>
          <Link href="/#/completed">
            <a className={clsx({ selected: hash === "completed" })}>
              Completed
            </a>
          </Link>
        </li>
      </ul>
      {activeTodos.length < todos.length && (
        <button className="clear-completed" onClick={onClickClearCompleted}>
          Clear completed
        </button>
      )}
    </footer>
  );
}
