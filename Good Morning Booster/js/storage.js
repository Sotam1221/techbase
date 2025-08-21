// LocalStorageキー管理
const KEYS = {
  TODO: "gmb_todo",
  FORTUNE: "gmb_fortune",
  MOOD: "gmb_mood",
  DIARY: "gmb_diary",
  QUOTE_FAVORITE: "gmb_quote_favorite",
  QUOTE_LAST: "gmb_quote_last",
};

// Cookie文字列取得
function _allCookies() {
  return typeof document === "undefined" ? "" : document.cookie || "";
}

// Cookie設定
function setCookie(key, value, days = 30, { path = "/", sameSite = "Lax", secure } = {}) {
  if (!key) return;
  const d = new Date();
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = "expires=" + d.toUTCString();
  const sec =
    typeof secure === "boolean"
      ? secure
      : (typeof location !== "undefined" && location.protocol === "https:");
  let str =
    encodeURIComponent(key) +
    "=" +
    encodeURIComponent(value) +
    ";" +
    expires +
    ";path=" +
    path +
    ";SameSite=" +
    sameSite;
  if (sec) str += ";Secure";
  document.cookie = str;
}

// Cookie取得
function getCookie(key) {
  if (!key) return "";
  const name = encodeURIComponent(key) + "=";
  const ca = _allCookies().split(";");
  for (let c of ca) {
    c = c.trim();
    if (c.indexOf(name) === 0) {
      return decodeURIComponent(c.substring(name.length));
    }
  }
  return "";
}

// Cookie削除
function delCookie(key, { path = "/" } = {}) {
  if (!key) return;
  document.cookie =
    encodeURIComponent(key) +
    "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=" +
    path +
    ";SameSite=Lax";
}

// CookieJSON保存
function setCookieJSON(key, obj, days = 30, opts) {
  try {
    setCookie(key, JSON.stringify(obj), days, opts);
  } catch {}
}

// CookieJSON取得
function getCookieJSON(key, fallback = null) {
  const raw = getCookie(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

// LocalStorageJSON保存
function setJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

// LocalStorageJSON取得
function getJSON(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

// ToDo保存
function saveTodoList(list) {
  setJSON(KEYS.TODO, list);
}

// ToDo読込
function loadTodoList() {
  return getJSON(KEYS.TODO, []);
}

// おみくじ保存
function saveFortune(result) {
  const today = new Date().toDateString();
  setJSON(KEYS.FORTUNE, { date: today, result });
}

// おみくじ読込
function loadFortune() {
  return getJSON(KEYS.FORTUNE, null);
}

// 気分保存
function saveMood(mood) {
  const today = new Date().toDateString();
  setJSON(KEYS.MOOD, { date: today, mood });
}

// 気分読込
function loadMood() {
  return getJSON(KEYS.MOOD, null);
}

// 日記保存
function saveDiary(text) {
  const today = new Date().toDateString();
  setJSON(KEYS.DIARY, { date: today, text });
}

// 日記読込
function loadDiary() {
  return getJSON(KEYS.DIARY, null);
}

// 名言お気に入り保存
function saveQuoteFavorite(q) {
  setJSON(KEYS.QUOTE_FAVORITE, q);
}

// 名言お気に入り読込
function loadQuoteFavorite() {
  return getJSON(KEYS.QUOTE_FAVORITE, null);
}

// 名言直近保存
function saveQuoteLast(q) {
  setJSON(KEYS.QUOTE_LAST, q);
}

// 名言直近読込
function loadQuoteLast() {
  return getJSON(KEYS.QUOTE_LAST, null);
}

// 全データ削除
function resetAll() {
  Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
}

// 名前付きエクスポート
export const storage = {
  KEYS,

  // Cookie系
  setCookie,
  getCookie,
  delCookie,
  setCookieJSON,
  getCookieJSON,

  // LocalStorage JSON系
  setJSON,
  getJSON,

  // 機能別API
  saveTodoList,
  loadTodoList,
  saveFortune,
  loadFortune,
  saveMood,
  loadMood,
  saveDiary,
  loadDiary,
  saveQuoteFavorite,
  loadQuoteFavorite,
  saveQuoteLast,
  loadQuoteLast,

  resetAll,
};
