import { useEffect, useRef } from "react";
import { useService } from "@xstate/react";

import { appService } from "src/machines/app";

export default function NewTodoInput() {
  const inputRef = useRef<HTMLInputElement>();
  const [, send] = useService(appService);

  const onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const title = inputRef.current.value;
      send("TODO.CREATE", { title });
      inputRef.current.value = "";
    }
  };

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <input
      className="new-todo"
      ref={inputRef}
      placeholder="What needs to be done?"
      onKeyPress={onKeyPress}
    />
  );
}
