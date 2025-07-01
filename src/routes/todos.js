import express from "express";
const router = express.Router();
// Database
const todos = [];

// Read
router.get("/todos", (_req, res) => {
  res.status(200).json(todos);
});

// create
router.post("/todos", (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).send("Bad Request, text needed");
  }
  const newTodo = {
    text,
    id: todos.length ? todos[todos.length - 1].id + 1 : 1,
    completed: false,
  };
  todos.push(newTodo);
  res.status(200).json(newTodo);
});

//update
router.put("/todos/:id", (req, res) => {
  const { completed } = req.body;
  const todoId = parseInt(req.params.id);
  const foundTodo = todos.find((todo) => todo.id === todoId);
  if (!foundTodo) {
    return res.status(404).json({ error: "Todo not found" });
  }
  foundTodo.completed = completed;
  res.json(foundTodo);
});

// delete
router.delete("/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = todos.findIndex((todo) => todo.id === id);
  console.log({ id, index });
  if (index === -1) {
    return res.status(404).json({ message: "Todo not found" });
  }
  todos.splice(index, 1);
  return res.status(200).json({ message: `Todo with id ${id} deleted` });
});

export default router;
