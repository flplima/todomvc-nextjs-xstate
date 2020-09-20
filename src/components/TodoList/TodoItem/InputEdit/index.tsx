import { useEffect, useRef } from "react";
import { useService } from "@xstate/react";
import { Interpreter } from "xstate";

import { TodoContext } from "src/machines/todo";

interface Props {
  todoRef: Interpreter<TodoContext>;
}

export default function InputEdit({ todoRef }: Props) {
  const [state, send] = useService(todoRef);
  const { title } = state.context;
  const inputRef = useRef<HTMLInputElement>();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    send("TITLE.CHANGE", { value: e.target.value });
  };

  const onBlur = () => {
    send("TITLE.COMMIT_CHANGE");
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.key === "Enter" && send("TITLE.COMMIT_CHANGE");
    e.key === "Escape" && send("TITLE.CANCEL_CHANGE");
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
