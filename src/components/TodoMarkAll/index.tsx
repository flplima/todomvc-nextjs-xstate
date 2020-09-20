import { useService } from "@xstate/react";

import { appService } from "src/machines/app";

export default function TodoMarkAll() {
  const [state, send] = useService(appService);
  const { todos } = state.context;
  const completedTodos = todos.filter((todo) => todo.completed);
  const allCompleted = completedTodos.length === todos.length;

  const labelText = `Mark all as ${allCompleted ? "active" : "complete"}`;

  const onClick = () => {
    send(allCompleted ? "MARK_ALL.ACTIVE" : "MARK_ALL.COMPLETED");
  };

  if (!todos.length) {
    return null;
  }

  return (
    <>
      <input
        readOnly
        id="toggle-all"
        className="toggle-all"
        type="checkbox"
        checked={allCompleted}
        onClick={onClick}
      />
      <label htmlFor="toggle-all" title={labelText}>
        {labelText}
      </label>
    </>
  );
}
