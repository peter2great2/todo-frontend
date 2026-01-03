import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaCheckCircle,
  FaTrash,
  FaClipboardList,
  FaEdit,
} from "react-icons/fa";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3000/todos/all")
      .then((res) => {
        setTodos(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch todos:", err);
        setLoading(false);
      });
  }, []);
  const handleAdd = async () => {
    try {
      const response = await axios.post("http://localhost:3000/todos/add", {
        description: text,
      });
      setTodos([...todos, response.data]);
      setText("");
    } catch (error) {
      console.log(error.message);
    }
  };
  const handleDelete = async (todo) => {
    try {
      await axios.delete(`http://localhost:3000/todos/delete/${todo.todo_id}`);
      setTodos(todos.filter((t) => t.todo_id !== todo.todo_id));
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center px-4 flex-col justify-between">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
        <div className="flex items-center gap-2 mb-6 justify-center">
          <FaClipboardList className="text-emerald-600 text-2xl" />
          <h1 className="text-2xl font-bold text-slate-800">My Todos</h1>
        </div>
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            onChange={(e) => setText(e.target.value)}
            value={text}
            placeholder="What needs to be done?"
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            onClick={handleAdd}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition"
          >
            Add
          </button>
        </div>
        // Todo List
        {loading ? (
          <p className="text-center text-slate-500">Loading todos...</p>
        ) : (
          <ul className="space-y-3">
            {todos.map((todo) => (
              <li
                key={todo.todo_id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 transition"
              >
                <div className="flex items-center gap-3">
                  <FaCheckCircle className="text-emerald-500 text-lg" />
                  <span className="text-slate-700">{todo.description}</span>
                </div>

                <button className="text-slate-400  transition flex items-center gap-2">
                  <FaEdit className="hover:text-blue-500" />
                  <FaTrash
                    className="hover:text-red-500"
                    onClick={() => handleDelete(todo)}
                  />
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-6 text-sm text-slate-500 text-center">
          {todos.length} task{todos.length !== 1 && "s"}
        </div>
      </div>
      <div className="mt-4 text-center text-slate-500 flex justify-end pb-4  ">
        <h4 className="capitalize text-sm md:text-2xl">
          my first project using PostgresSQL for data management
        </h4>
      </div>
    </div>
  );
}
