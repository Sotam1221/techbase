console.log("main.js loaded");

import { initLoginBonus } from "./loginBonus.js";
import { initTodo }      from "./todo.js";
import { initQuote }     from "./quote.js";
import { initFortune }   from "./fortune.js";
import { initWeather }   from "./weather.js";
import { initRecommend } from "./recommend.js";
import { initDiary }     from "./diary.js";
import { initMood }      from "./mood.js";
import { initMusic }     from "./music.js";

window.addEventListener("DOMContentLoaded", () => {
  // 挨拶メッセージ
  const greetingEl = document.getElementById("greeting-message");
  if (greetingEl) {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      greetingEl.textContent = "おはようございます！今日も一日頑張りましょう！";
    } else if (hour >= 12 && hour < 18) {
      greetingEl.textContent = "こんにちは！一休みしたら頑張りましょう！";
    } else if (hour >= 18 && hour < 22) {
      greetingEl.textContent = "こんばんは！今日はどんな一日でしたか？";
    } else {
      greetingEl.textContent = "こんばんは！明日に備えて早寝を心がけましょう！";
    }
  }

  // ログインボーナス
  const loginAPI = initLoginBonus({
    statusEl: document.getElementById("login-status"),
    claimBtn: document.getElementById("login-claim"),
    streakEl: document.getElementById("login-streak"),
    pointsEl: document.getElementById("login-points"),
  });


  // ToDo
  const todoAPI = initTodo({
    input:  document.getElementById("todo-input"),
    date:   document.getElementById("todo-date"),
    addBtn: document.getElementById("add-todo"),
    list:   document.getElementById("todo-list"),
  });

  // 今日の格言
  const quoteAPI = initQuote({
    display: document.getElementById("quote-display"),
    getBtn:  document.getElementById("get-quote"),
    saveBtn: document.getElementById("save-favorite"),
    favSpan: document.getElementById("favorite-quote"),
  });

  // おみくじ
  const fortuneAPI = initFortune({
    display: document.getElementById("fortune-display"),
    drawBtn: document.getElementById("draw-fortune"),
    lastSpan:document.getElementById("last-fortune"),
  });

  // 天気予報
  const weatherAPI = initWeather({
    statusEl:  document.getElementById("weather-status"),
    cityInput: document.getElementById("weather-city"),
    refreshBtn:document.getElementById("weather-refresh"),
  });

  // 朝活レコメンド
  const recommendAPI = initRecommend(
    { textEl: document.getElementById("recommend-text") },
    { weatherAPI }
  );

// 一言日記
initDiary({
  inputEl:   document.getElementById("diary-input"),
  displayEl: document.getElementById("diary-last"),
  saveBtn:   document.getElementById("diary-save"),
});


  // 朝の気分登録
  const moodAPI = initMood({
    buttonsWrap: document.getElementById("mood-buttons"),
    today:       document.getElementById("mood-today"),
  });

  // 今日のおすすめ音楽
  const musicAPI = initMusic(
    { textEl: document.getElementById("music-text") },
    { moodAPI, weatherAPI }
  );

  // 連動（天気・気分の変化で更新）
  weatherAPI.onChange((w) => {
    recommendAPI.update(w);
    musicAPI.refresh();
  });
  moodAPI.onChange(() => {
    musicAPI.refresh();
  });


  // 全リセット
  const resetBtn = document.getElementById("reset-all");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if (!confirm("全データをリセットします。よろしいですか？")) return;
      quoteAPI.reset?.();
      fortuneAPI.reset?.();
      todoAPI.reset?.();
      diaryAPI.reset?.();
      moodAPI.reset?.();
      loginAPI.reset?.()
    });
  }
});
