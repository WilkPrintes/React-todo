import { useEffect, useState } from "react"
import { BsTrash, BsBookmarkCheck, BsBookmarkCheckFill } from "react-icons/bs"

function App() {
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const API = "http://localhost:5180/";

  useEffect(() => {

    const loadData = async () => {
      setLoading(true);

      const res = await fetch(API + "todos")
        .then((res) => res.json())
        .then((data) => data)
        .catch((err) => console.error(err));

      setLoading(false)
      setTodos(res);
    }

    loadData();
  }, [])

  async function handleDelete(id) {
    fetch(API + "todos/" + id, {
      method: "DELETE",
    })
    setTodos((prevState) => prevState.filter((t) => t.id !== id))
  }

  async function handleDone(todo) {
    fetch(API + "todos/" + todo.id, {
      method: "PUT",
      body: JSON.stringify({ ...todo, done: !todo.done }),
      headers: {
        "Content-Type": "application/json",
      },
    })
    setTodos((prevState) => prevState.map((t) => t.id === todo.id ? { ...t, done: !t.done } : t))
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const todo = {
      id: Math.random(),
      title,
      time,
      done: false,
    }

    await fetch(API + "todos", {
      method: "POST",
      body: JSON.stringify(todo),
      headers: {
        "Content-Type": "application/json",
      },
    })

    setTodos((prevState) => [...prevState, todo])

    setTitle("");
    setTime("");
  }

  return (
    <div className="todo-component">
      <div className="todo-header">
        <h1>React Todo</h1>
      </div>
      <div className="form-todo">
        <h2>Insira sua próxima tarefa:</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-control">
            <label htmlFor="title">O que você vai fazer?</label>
            <input
              type="text"
              name="title"
              placeholder="Título da Tarefa"
              onChange={(e) => { setTitle(e.target.value) }}
              value={title || ""}
              required
            />
          </div>
          <div className="form-control">
            <label htmlFor="time">Duração:</label>
            <input
              type="number"
              name="time"
              placeholder="Tempo estimado (em horas)"
              onChange={(e) => { setTime(e.target.value) }}
              value={time || ""}
              required
            />
          </div>
          <input type="submit" value="Criar" />
        </form>
      </div>
      <div className="list-todo">
        <h2>Lista de tarefas:</h2>
        {todos.length === 0 && <p>Não há tarefas</p>}
        {todos.map((todo) => (
          <div className="todo" key={todo.id}>
            <h3 className={todo.done ? "todo-done" : ""}>{todo.title}</h3>
            <p>Duração: {todo.time} {todo.time == 1 ? "hora" : "horas"}</p>
            <div className="actions">
              <span onClick={() => handleDone(todo)} >
                {!todo.done ? <BsBookmarkCheck /> : <BsBookmarkCheckFill />}
              </span>
              <BsTrash onClick={() => handleDelete(todo.id)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
