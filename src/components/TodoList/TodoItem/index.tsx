import { Interpreter } from "xstate";
import { useService } from "@xstate/react";
import clsx from "clsx";

import { TodoContext } from "src/machines/todo";
import InputEdit from "./InputEdit";

interface Props {
  todo: Interpreter<TodoContext>;
}

export default function TodoItem({ todo }: Props) {
  const [state, send] = useService(todo);
  const { id, title, completed } = state.context;

  const onChangeCheckbox = (_: React.ChangeEvent<HTMLInputElement>) => {
    send("TOGGLE_COMPLETE");
  };

  const onDoubleClickLabel = (_: React.MouseEvent<HTMLLabelElement>) => {
    send("EDIT");
  };

  return (
    <li
      key={id}
      className={clsx({
        editing: state.matches("editing"),
        completed,
      })}
    >
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          onChange={onChangeCheckbox}
          checked={completed}
        />
        <label onDoubleClick={onDoubleClickLabel}>{title}</label>
        <button className="destroy" onClick={() => send("DELETE")} />
      </div>
      <InputEdit todo={todo} />
    </li>
  );
}
