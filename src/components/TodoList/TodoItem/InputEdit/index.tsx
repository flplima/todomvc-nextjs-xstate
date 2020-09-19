import { useEffect, useRef } from "react";
import { useService } from "@xstate/react";
import { Interpreter } from "xstate";

import { TodoContext } from "src/state/todo";

interface Props {
  todoRef: Interpreter<TodoContext>;
}

export default function InputEdit({ todoRef }: Props) {
  const [state, send] = useService(todoRef);
  const { title } = state.context;
  const inputRef = useRef<HTMLInputElement>();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    send("CHANGE", { value: e.target.value });
  };

  const onBlur = () => {
    send("CHANGE_COMMIT");
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.key === "Enter" && send("CHANGE_COMMIT");
    e.key === "Escape" && send("CHANGE_CANCEL");
  };

  const editingRef = useRef<boolean>(false);
  useEffect(() => {
    if (!editingRef.current && state.matches("editing")) {
      inputRef.current?.focus();
    }
    editingRef.current = state.matches("editing");
  }, [state]);

  return (
    <input
      className="edit"
      ref={inputRef}
      value={title}
      onChange={onChange}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
    />
  );
}
