import { useService } from "@xstate/react";

import { appService } from "src/state/app";

export default function NewTodoInput() {
  const [state, send] = useService(appService);
  const { newTodoText } = state.context;

  const onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      send("NEW_TODO.COMMIT");
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    send({
      type: "NEW_TODO.CHANGE",
      value: e.target.value,
    });
  };

  return (
    <input
      autoFocus
      className="new-todo"
      placeholder="What needs to be done?"
      value={newTodoText}
      onKeyPress={onKeyPress}
      onChange={onChange}
    />
  );
}
