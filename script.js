const input = document.getElementById("todo-input");
const addBtn = document.getElementById("add-btn");
const list = document.getElementById("todo-list");

async function loadTodos() {
  const res = await fetch("/api/todos");
  const todos = await res.json();

  list.innerHTML = "";

  todos.forEach((t) => {
    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = t.text;

    const delBtn = document.createElement("button");
    delBtn.className = "delete";
    delBtn.textContent = "✕";
    delBtn.onclick = async () => {
      await fetch(`/api/todos/${t.id}`, { method: "DELETE" });
      loadTodos();
    };

    li.appendChild(span);
    li.appendChild(delBtn);
    list.appendChild(li);
  });
}

addBtn.onclick = async () => {
  const text = input.value.trim();
  if (!text) return;

  await fetch("/api/todos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  input.value = "";
  loadTodos();
};

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addBtn.click();
});

// initial load
loadTodos();
