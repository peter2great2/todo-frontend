import { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { toast } from "react-toastify";
import {
  FaCheckCircle,
  FaTrash,
  FaClipboardList,
  FaEdit,
  FaSave,
  FaTimes,
} from "react-icons/fa";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3000/todos/all", { withCredentials: true })
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
    if (!text.trim()) {
      toast.error("Please enter a task description.");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:3000/todos/add",
        {
          description: text,
        },
        { withCredentials: true }
      );
      setTodos([...todos, response.data]);
      toast.success("Todo added successfully!");
      setText("");
    } catch (error) {
      console.log(error.message);
    }
  };
  const handleDelete = async (todo) => {
    try {
      await axios.delete(`http://localhost:3000/todos/delete/${todo.todo_id}`);
      setTodos(todos.filter((t) => t.todo_id !== todo.todo_id));
      toast.success("Todo deleted successfully!");
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleEdit = (todo) => {
    setEditingId(todo.todo_id);
    setEditText(todo.description);
    toast.info("Editing todo...");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  const handleSaveEdit = async (todo) => {
    if (!editText.trim()) return;
    try {
      const response = await axios.put(
        `http://localhost:3000/todos/update/${todo.todo_id}`,
        { description: editText, completed: todo.completed }
      );
      setTodos(
        todos.map((t) =>
          t.todo_id === todo.todo_id ? { ...t, description: editText } : t
        )
      );
      toast.success("Todo updated successfully!");
      setEditingId(null);
      setEditText("");
    } catch (error) {
      console.error("Failed to update todo:", error.message);
    }
  };
  const handleCompleted = async (todo) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/todos/update/${todo.todo_id}`,
        { description: todo.description, completed: !todo.completed }
      );
      setTodos(
        todos.map((t) =>
          t.todo_id === todo.todo_id ? { ...t, completed: !t.completed } : t
        )
      );
      toast.success(
        `Todo marked as ${!todo.completed ? "completed" : "incomplete"}!`
      );
    } catch (error) {
      console.error("Failed to update todo:", error.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center px-4 flex-col justify-between pt-3">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
        <div className="flex items-center gap-2 mb-6 justify-center">
          <FaClipboardList className="text-emerald-600 text-2xl" />
          <h1 className="text-2xl font-bold text-slate-800">My Todos</h1>
        </div>
        <form
          className="flex gap-2 flex-col md:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            handleAdd();
          }}
        >
          <input
            type="text"
            onChange={(e) => setText(e.target.value)}
            value={text}
            placeholder="What needs to be done?"
            className="flex-1 px-4 py-2 border border-slate-100 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200"
          />
          <button
            // onClick={handleAdd}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition"
          >
            Add Task
          </button>
        </form>
        {loading ? (
          <p className="text-center text-slate-500">Loading todos...</p>
        ) : todos.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-red-500 text-lg">No tasks yet!</p>
            <p className="text-red-400 text-sm mt-1">
              Add a task to get started.
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {todos.map((todo) => (
              <li
                key={todo.todo_id}
                className="flex items-center justify-between p-3 border-b border-slate-200 rounded-md border-t hover:bg-slate-50 transition"
              >
                {editingId === todo.todo_id ? (
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="flex-1 px-3 py-1 border border-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      autoFocus
                    />
                    <button
                      onClick={() => handleSaveEdit(todo)}
                      className="text-emerald-500 hover:text-emerald-600 transition p-1"
                      title="Save"
                    >
                      <FaSave className="text-lg" />
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="text-slate-400 hover:text-red-500 transition p-1"
                      title="Cancel"
                    >
                      <FaTimes className="text-lg" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-start justify-between flex-1">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <div>
                          <FaCheckCircle
                            className={`cursor-pointer ${
                              todo.completed
                                ? "text-emerald-500"
                                : "text-slate-300 hover:text-slate-500 transition"
                            }`}
                            size={18}
                            title={
                              todo.completed
                                ? "Mark as Incomplete"
                                : "Mark as Completed"
                            }
                            onClick={() => handleCompleted(todo)}
                          />
                        </div>
                        <div>
                          <span className="text-slate-700">
                            {todo.description}
                          </span>
                        </div>
                      </div>
                      <span className="text-slate-500 text-xs pl-6">
                        {format(new Date(todo.created_at), "PPpp")}
                      </span>
                    </div>

                    <div className="text-slate-400 transition flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(todo)}
                        className="hover:text-blue-700 text-blue-500 transition p-1"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(todo)}
                        className="hover:text-red-700 text-red-500 transition p-1"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-6 text-sm text-slate-500 text-center">
          {todos.length} task{todos.length !== 1 && "s"}
        </div>
      </div>
      <div className="mt-4 text-center text-slate-500 flex justify-end pb-4  ">
        <h4 className="capitalize text-sm md:text-md">
          my first project using PostgresSQL for data management
        </h4>
      </div>
    </div>
  );
}
