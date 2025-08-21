import { storage } from "./storage.js";

// 保存キー
const LS_KEY = "gmb_login_bonus";

function dateStrJST(d = new Date()) {
  const y = d.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo", year: "numeric" });
  const m = d.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo", month: "2-digit" });
  const dd = d.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo", day: "2-digit" });
  return `${y}-${m}-${dd}`;
}

function isYesterdayJST(last, today) {
  const [y1, m1, d1] = last.split("-").map(Number);
  const [y2, m2, d2] = today.split("-").map(Number);
  const a = new Date(Date.UTC(y1, m1 - 1, d1));
  const b = new Date(Date.UTC(y2, m2 - 1, d2));
  const diff = (b - a) / (1000 * 60 * 60 * 24);
  return diff === 1;
}

function loadState() {
  return storage.getJSON(LS_KEY, {
    lastDate: null,
    streak: 0,
    points: 0,
    todayClaimed: false
  });
}

function saveState(s) {
  storage.setJSON(LS_KEY, s);
}

function todayStateNormalized() {
  const today = dateStrJST();
  const s = loadState();

  // 連続状態の補正
  if (!s.lastDate) {
    s.streak = 0;
    s.todayClaimed = false;
  } else if (s.lastDate === today) {
  } else if (isYesterdayJST(s.lastDate, today)) {
    s.todayClaimed = false;
  } else {
    s.streak = 0;
    s.todayClaimed = false;
  }

  saveState(s);
  return { state: s, today };
}

function calcReward(nextStreak) {
  let base = 10;
  if (nextStreak > 0 && nextStreak % 7 === 0) base += 50;
  return base;
}

function render(refs, s) {
  if (!refs) return;
  const { statusEl, streakEl, pointsEl, claimBtn } = refs;

  // 表示
  streakEl.textContent = `${s.streak} 日`;
  pointsEl.textContent = `${s.points} pt`;

  if (s.todayClaimed) {
    statusEl.textContent = "本日のログインボーナスは受け取り済み ✅";
    claimBtn.disabled = true;
  } else {
    const reward = calcReward(s.streak + 1);
    statusEl.textContent = `本日のログインボーナス：${reward} pt`;
    claimBtn.disabled = false;
  }
}

function claim(refs) {
  const { state: s, today } = todayStateNormalized();
  if (s.todayClaimed) return;

  // 受け取り
  s.streak = s.lastDate === today ? s.streak : s.streak + 1;
  const reward = calcReward(s.streak);
  s.points += reward;
  s.lastDate = today;
  s.todayClaimed = true;

  saveState(s);
  render(refs, s);
  return { reward, streak: s.streak, points: s.points };
}

// 公開API
export function initLoginBonus({ statusEl, claimBtn, streakEl, pointsEl }) {
  const refs = { statusEl, claimBtn, streakEl, pointsEl };

  // 初期描画
  const { state: s } = todayStateNormalized();
  render(refs, s);

  // 受け取りボタン
  claimBtn?.addEventListener("click", () => {
    const res = claim(refs);
    if (res) {
    }
  });

  return {
    getState: loadState,
    reset() {
      saveState({ lastDate: null, streak: 0, points: 0, todayClaimed: false });
      const { state: s2 } = todayStateNormalized();
      render(refs, s2);
    }
  };
}
