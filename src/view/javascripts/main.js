document.addEventListener("DOMContentLoaded", () => {
  const todoInput = document.getElementById("todoInput");
  const addButton = document.getElementById("addTodo");
  const todoList = document.getElementById("todoList");
  let todos = [];

  // Load todos from server
  fetchTodos();

  // Add todo when button is clicked
  addButton.addEventListener("click", addTodo);

  // Add todo when Enter key is pressed
  todoInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      addTodo();
    }
  });

  async function fetchTodos() {
    try {
      const response = await fetch("/api/todos");
      todos = await response.json();
      renderTodos();
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  }

  async function addTodo() {
    const text = todoInput.value.trim();
    if (!text) return;

    try {
      const response = await fetch("/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      const newTodo = await response.json();
      todos.push(newTodo);
      renderTodos();
      todoInput.value = "";
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  }

  async function toggleTodo(id) {
    try {
      const todo = todos.find((t) => t.id === id);
      const response = await fetch(`/api/todos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...todo, completed: !todo.completed }),
      });

      const updatedTodo = await response.json();
      todos = todos.map((t) => (t.id === id ? updatedTodo : t));
      renderTodos();
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  }

  async function deleteTodo(id) {
    try {
      await fetch(`/api/todos/${id}`, {
        method: "DELETE",
      });

      todos = todos.filter((t) => t.id !== id);
      renderTodos();
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  }

  function renderTodos() {
    todoList.innerHTML = "";
    todos.forEach((todo) => {
      const li = document.createElement("li");
      li.className = `todo-item ${todo.completed ? "completed" : ""}`;

      li.innerHTML = `
                <input type="checkbox" class="todo-checkbox" ${
                  todo.completed ? "checked" : ""
                }>
                <span class="todo-text">${todo.text}</span>
                <button class="delete-btn">Delete</button>
            `;

      const checkbox = li.querySelector(".todo-checkbox");
      checkbox.addEventListener("change", () => toggleTodo(todo.id));

      const deleteBtn = li.querySelector(".delete-btn");
      deleteBtn.addEventListener("click", () => deleteTodo(todo.id));

      todoList.appendChild(li);
    });
  }
});
