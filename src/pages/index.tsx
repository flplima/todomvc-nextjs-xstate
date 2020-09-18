import { NewTodoInput, TodoList } from "src/components";

export default function Home() {
  return (
    <>
      <section className="todoapp">
        <header className="header">
          <h1>todos</h1>
          <NewTodoInput />
        </header>
        <section className="main">
          <input id="toggle-all" className="toggle-all" type="checkbox" />
          <label htmlFor="toggle-all">Mark all as complete</label>
          <TodoList />
        </section>
        <footer className="footer">
          <span className="todo-count"></span>
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
          <button className="clear-completed">Clear completed</button>
        </footer>
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
