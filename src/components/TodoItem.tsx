import { useRef } from "react";
import { Interpreter } from "xstate";
import { useService } from "@xstate/react";
import { TodoContext } from "src/state/todo";

interface Props {
  todoRef: Interpreter<TodoContext>;
}

export default function TodoItem({ todoRef }: Props) {
  const [state, send] = useService(todoRef);
  const { id, title, completed } = state.context;
  const inputRef = useRef<HTMLInputElement>();

  return (
    <li
      // className={cn({
      //   editing: state.matches("editing"),
      //   completed,
      // })}
      // data-todo-state={completed ? "completed" : "active"}
      key={id}
    >
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          onChange={(_) => {
            send("TOGGLE_COMPLETE");
          }}
          // value={completed}
          checked={completed}
        />
        <label
          onDoubleClick={(e) => {
            send("EDIT");
          }}
        >
          {title}
        </label>{" "}
        <button className="destroy" onClick={() => send("DELETE")} />
      </div>
      <input
        className="edit"
        value={title}
        onBlur={(_) => send("BLUR")}
        onChange={(e) => send("CHANGE", { value: e.target.value })}
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            send("COMMIT");
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            send("CANCEL");
          }
        }}
        ref={inputRef}
      />
    </li>
  );
}
