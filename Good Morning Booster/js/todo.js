import { storage } from "./storage.js";

let todos = [];
let refs = null;

function load() {
  const data = storage.loadTodoList();
  if (Array.isArray(data)) {
    todos = data
      .filter(v => v && typeof v === "object")
      .map(v => ({ number: Number(v.number)||0, todo: String(v.todo||""), date: String(v.date||"") }));
  } else {
    todos = [];
  }
}

function persist() {
  storage.saveTodoList(todos);

}

function nextNumber() {
  return todos.length === 0 ? 1 : Math.max(...todos.map(t => Number(t.number)||0)) + 1;
}

function render() {
  const ul = refs.list;
  ul.innerHTML = "";

  if (todos.length === 0) {
    const li = document.createElement("li");
    li.textContent = "ToDoは未登録です。";
    li.style.color = "#666";
    ul.appendChild(li);
    return;
  }

  // ソート
  const sorted = [...todos].sort((a,b)=>{
    const ad = a.date || "9999-12-31";
    const bd = b.date || "9999-12-31";
    return ad === bd ? a.number - b.number : ad.localeCompare(bd);
  });

  for (const item of sorted) {
    const li = document.createElement("li");
    li.dataset.number = String(item.number);

    const left = document.createElement("div");
    left.style.display = "flex";
    left.style.flexDirection = "column";

    const title = document.createElement("span");
    title.textContent = `#${item.number} ${item.todo}`;
    title.style.fontWeight = "600";

    const meta = document.createElement("small");
    meta.textContent = item.date ? `期限: ${item.date}` : "期限: （未設定）";
    meta.style.color = "#555";

    left.appendChild(title);
    left.appendChild(meta);

    const right = document.createElement("div");
    const delBtn = document.createElement("button");
    delBtn.textContent = "削除";
    delBtn.className = "btn-delete";
    right.appendChild(delBtn);

    li.appendChild(left);
    li.appendChild(right);
    ul.appendChild(li);
  }
}

function addTodo() {
  const text = (refs.input.value || "").trim();
  const d = (refs.date.value || "").trim();
  if (!text) {
    alert("タスク内容を入力してください。");
    refs.input.focus();
    return;
  }
  todos.push({ number: nextNumber(), todo: text, date: d });
  persist();
  render();
  refs.input.value = "";
  refs.input.focus();
}

function removeTodoByNumber(num) {
  const idx = todos.findIndex(t => t.number === num);
  if (idx !== -1) {
    todos.splice(idx, 1);
    persist();
    render();
  }
}

// 初期化
export function initTodo({ input, date, addBtn, list }) {
  refs = { input, date, addBtn, list };
  load();
  render();

  addBtn.addEventListener("click", addTodo);
  input.addEventListener("keydown", e => { if (e.key === "Enter") addTodo(); });
  date.addEventListener("keydown", e => { if (e.key === "Enter") addTodo(); });

  list.addEventListener("click", e => {
    const btn = e.target.closest(".btn-delete");
    if (!btn) return;
    const li = e.target.closest("li");
    const num = Number(li?.dataset?.number);
    if (num) removeTodoByNumber(num);
  });

  return {
    reset() {
      todos = [];
      storage.saveTodoList(todos);
      render();
    }
  };
}
