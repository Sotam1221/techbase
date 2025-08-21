import { storage } from "./storage.js";

const RESULTS = [
  { k: "大吉", m: "朝の光を浴びよ。" },
  { k: "大吉", m: "積極的に挑戦する日。" },

  { k: "中吉", m: "短い散歩が冴えを生む。" },
  { k: "中吉", m: "忘れ物に注意。" },
  { k: "中吉", m: "大切な人に感謝を伝えよう。" },
  { k: "中吉", m: "計画を見直すと吉。" },
  { k: "中吉", m: "新しいことを試してみよう。" },

  { k: "小吉", m: "水分補給で集中力維持。" },
  { k: "小吉", m: "小さな善い事をしよう。" },
  { k: "小吉", m: "整理整頓で気分が晴れる。" },

  { k: "吉",   m: "小さな片付けが吉。" },
  { k: "吉",   m: "行き詰ったら深呼吸。" },

  { k: "凶",   m: "無理を避け、整える日。" }
];

const COOKIE_TODAY_RESULT = "last_fortune";
const COOKIE_TODAY_DATE   = "last_fortune_date";
const COOKIE_YES_RESULT   = "yesterday_fortune";
const COOKIE_YES_DATE     = "yesterday_fortune_date";

let refs = null;

function todayStr() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth()+1).padStart(2,"0");
  const day = String(d.getDate()).padStart(2,"0");
  return `${y}-${m}-${day}`;
}
function yesterdayStr() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const y = d.getFullYear();
  const m = String(d.getMonth()+1).padStart(2,"0");
  const day = String(d.getDate()).padStart(2,"0");
  return `${y}-${m}-${day}`;
}

function isDrawnToday() {
  return storage.getCookie(COOKIE_TODAY_DATE) === todayStr();
}

function updateButtonState() {
  if (!refs?.drawBtn) return;
  if (isDrawnToday()) {
    refs.drawBtn.disabled = true;
    refs.drawBtn.textContent = "本日は引き済み";
    refs.drawBtn.title = "おみくじは1日1回までです";
  } else {
    refs.drawBtn.disabled = false;
    refs.drawBtn.textContent = "引く";
    refs.drawBtn.title = "";
  }
}

// 「昨日の運勢」を表示
function showYesterday() {
  const yDate = storage.getCookie(COOKIE_YES_DATE);
  const yText = storage.getCookie(COOKIE_YES_RESULT);
  refs.lastSpan.textContent = (yDate === yesterdayStr() && yText) ? yText : "なし";
}

function draw() {
  if (isDrawnToday()) return;


  const prevDate = storage.getCookie(COOKIE_TODAY_DATE);
  const prevText = storage.getCookie(COOKIE_TODAY_RESULT);
  if (prevDate === yesterdayStr() && prevText) {
    storage.setCookie(COOKIE_YES_RESULT, prevText);
    storage.setCookie(COOKIE_YES_DATE, prevDate);
  } else {

    storage.delCookie(COOKIE_YES_RESULT);
    storage.delCookie(COOKIE_YES_DATE);
  }

  // 抽選
  const fortune = RESULTS[Math.floor(Math.random() * RESULTS.length)];
  const text = `結果：${fortune.k} 「${fortune.m}」`;

  // 表示
  refs.display.textContent = text;

  // 今日の結果を保存
  storage.setCookie(COOKIE_TODAY_RESULT, text);
  storage.setCookie(COOKIE_TODAY_DATE, todayStr());

  // 「昨日の運勢」
  showYesterday();

  updateButtonState();
}

export function initFortune({ display, drawBtn, lastSpan }) {
  refs = { display, drawBtn, lastSpan };

  showYesterday();
  updateButtonState();

  drawBtn.addEventListener("click", draw);

  return {
    reset() {
      storage.delCookie(COOKIE_TODAY_RESULT);
      storage.delCookie(COOKIE_TODAY_DATE);
      storage.delCookie(COOKIE_YES_RESULT);
      storage.delCookie(COOKIE_YES_DATE);
      display.textContent = "結果がここに表示されます";
      showYesterday();
      updateButtonState();
    }
  };
}
