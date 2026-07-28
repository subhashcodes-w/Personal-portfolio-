const menuBtn = document.getElementById("menuBtn");
const navbar = document.getElementById("navbar");
const todoInput = document.getElementById("todoInput");
const addTodoBtn = document.getElementById("addTodoBtn");
const todoList = document.getElementById("todoList");
const calcDisplay = document.getElementById("calcDisplay");

let todoItems = JSON.parse(localStorage.getItem("todoItems")) || [];

function updateMenuState(open) {
  navbar.classList.toggle("active", open);
  menuBtn.setAttribute("aria-expanded", String(open));
}

menuBtn.addEventListener("click", () => {
  updateMenuState(!navbar.classList.contains("active"));
});

document.addEventListener("click", (e) => {
  if (!navbar.contains(e.target) && !menuBtn.contains(e.target)) {
    updateMenuState(false);
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    updateMenuState(false);
  }
});

navbar.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => updateMenuState(false));
});

function appendCalc(value) {
  if (calcDisplay.value === "Error") calcDisplay.value = "";
  calcDisplay.value += value;
}

function clearCalc() {
  calcDisplay.value = "";
}

function deleteCalc() {
  calcDisplay.value = calcDisplay.value.slice(0, -1);
}

function safeCalculate(expression) {
  if (!/^[0-9+\-*/.() ]+$/.test(expression)) {
    throw new Error("Invalid expression");
  }
  return Function(`"use strict"; return (${expression})`)();
}

function calculateCalc() {
  try {
    if (!calcDisplay.value.trim()) return;
    const result = safeCalculate(calcDisplay.value);
    calcDisplay.value = Number.isFinite(result) ? result : "Error";
  } catch {
    calcDisplay.value = "Error";
  }
}

function saveTodos() {
  localStorage.setItem("todoItems", JSON.stringify(todoItems));
}

function renderTodos() {
  todoList.innerHTML = "";

  if (todoItems.length === 0) {
    const empty = document.createElement("li");
    empty.className = "todo-item";
    empty.innerHTML = "<span>No tasks added yet</span>";
    todoList.appendChild(empty);
    return;
  }

  todoItems.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = `todo-item ${task.done ? "done" : ""}`;
    li.innerHTML = `
      <span></span>
      <div class="todo-actions">
        <button type="button" class="done-btn">Done</button>
        <button type="button" class="del-btn">Delete</button>
      </div>
    `;
    li.querySelector("span").textContent = task.text;

    li.querySelector(".done-btn").addEventListener("click", () => {
      todoItems[index].done = !todoItems[index].done;
      saveTodos();
      renderTodos();
    });

    li.querySelector(".del-btn").addEventListener("click", () => {
      todoItems.splice(index, 1);
      saveTodos();
      renderTodos();
    });

    todoList.appendChild(li);
  });
}

function addTodo() {
  const text = todoInput.value.trim();
  if (!text) return;

  todoItems.push({ text, done: false });
  saveTodos();
  renderTodos();
  todoInput.value = "";
}

addTodoBtn.addEventListener("click", addTodo);

todoInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTodo();
});

window.addEventListener("load", () => {
  document.querySelector(".fill.html").style.width = "90%";
  document.querySelector(".fill.css").style.width = "85%";
  document.querySelector(".fill.js").style.width = "75%";
  document.querySelector(".fill.responsive").style.width = "80%";
  renderTodos();
});