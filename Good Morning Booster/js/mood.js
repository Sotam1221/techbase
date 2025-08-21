import { storage } from "./storage.js";

let refs = null;
const listeners = new Set();

// 日付＆キー
function todayStr() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function key() {
  return `mood_${todayStr()}`;
}

// ラベル変換
function label(v) {
  return v === "great" ? "最高"
    : v === "good"    ? "良い"
    : v === "soso"    ? "ふつう"
    : v === "bad"     ? "いまいち"
    : "未登録";
}

// 表示更新
function render() {
  if (!refs) return;
  const v = storage.getCookie(key());
  refs.today.textContent = label(v);
  // ボタンの選択状態
  if (refs.buttonsWrap) {
    const btns = refs.buttonsWrap.querySelectorAll("button[data-mood]");
    btns.forEach(b => {
      if (b.dataset.mood === v) {
        b.setAttribute("aria-pressed", "true");
      } else {
        b.setAttribute("aria-pressed", "false");
      }
    });
  }
}

// クリック処理
function onClick(e) {
  const btn = e.target.closest("button[data-mood]");
  if (!btn) return;
  const v = btn.dataset.mood;
  if (!["great", "good", "soso", "bad"].includes(v)) return;

  storage.setCookie(key(), v);
  render();
  // 変更通知
  listeners.forEach(fn => { try { fn(v); } catch {} });
}

// 公開API
export function initMood({ buttonsWrap, today }) {
  refs = { buttonsWrap, today };
  render();

  // イベント登録
  if (buttonsWrap) {
    buttonsWrap.addEventListener("click", onClick);
    // キーボード操作
    buttonsWrap.addEventListener("keydown", (e) => {
      if ((e.key === "Enter" || e.key === " ") && e.target.matches("button[data-mood]")) {
        e.preventDefault();
        e.target.click();
      }
    });
  }

  return {
    getTodayMood() { return storage.getCookie(key()); },

    onChange(handler) {
      if (typeof handler === "function") listeners.add(handler);
      return () => listeners.delete(handler);
    },

    reset() {
      storage.setCookie(key(), "", 1);
      render();
      listeners.forEach(fn => { try { fn(null); } catch {} });
    }
  };
}
