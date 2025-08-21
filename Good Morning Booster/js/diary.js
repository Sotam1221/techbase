import { storage } from "./storage.js";

let refs = null;
const listeners = new Set();

// 日付キー
function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}
function key() {
  return `diary_${todayStr()}`;
}

// 表示更新
function render() {
  const val = storage.getCookie(key()) || "";
  if (refs.displayEl) refs.displayEl.textContent = val || "（未記入）";
  if (refs.inputEl) refs.inputEl.value = val;
}

// 保存処理
function save() {
  const text = (refs.inputEl?.value || "").trim();
  storage.setCookie(key(), text);
  render();
  listeners.forEach(fn => { try { fn(text); } catch {} });
}

// 公開API
export function initDiary({ inputEl, displayEl, saveBtn }) {
  refs = { inputEl, displayEl, saveBtn };
  render();

  if (saveBtn) {
    saveBtn.addEventListener("click", save);
  }
  if (inputEl) {
    inputEl.addEventListener("keydown", (e) => {
      if (e.ctrlKey && e.key === "Enter") save();
    });
  }

  return {
    getTodayDiary() { return storage.getCookie(key()) || ""; },
    onChange(handler) { if (typeof handler === "function") listeners.add(handler); return () => listeners.delete(handler); },
    reset() {
      storage.setCookie(key(), "", 1);
      render();
      listeners.forEach(fn => { try { fn(""); } catch {} });
    }
  };
}
