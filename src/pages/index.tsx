import { NewTodoInput, TodoList, TodoFooter } from "src/components";
import TodoMarkAll from "src/components/TodoMarkAll";

export default function Home() {
  return (
    <>
      <section className="todoapp">
        <header className="header">
          <h1>todos</h1>
          <NewTodoInput />
        </header>

        <section className="main">
          <TodoMarkAll />
          <TodoList />
        </section>

        <TodoFooter />
      </section>

      <footer className="info">
        <p>Double-click to edit a todo</p>
        <p>
          Created by <a href="https://github.com/flplima">Felipe Lima</a>
        </p>
        <p>
          Part of <a href="http://todomvc.com">TodoMVC</a>
        </p>
      </footer>
    </>
  );
}
