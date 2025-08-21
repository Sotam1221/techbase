export function initRecommend({ textEl }, { weatherAPI }) {
  // 天気コード
  const RECOMMENDATIONS = {
    sunny:  ["朝ランニングで1日をスタート！", "ベランダでコーヒータイム☕", "軽くストレッチ＆日光浴"],
    cloudy: ["カフェで読書タイム📚", "軽くウォーキング", "計画の整理に充てよう"],
    rain:   ["おうちで読書📖", "日記を書く", "朝勉に挑戦！"],
    snow:   ["温かい飲み物でリラックス☕", "おうちトレーニング", "防寒して短い散歩"],
    default:["瞑想で集中力アップ🧘‍♂️", "今日のToDoを整理", "お気に入り音楽を聴く"],
  };

  function getRecommendation(code) {
    const list = RECOMMENDATIONS[code] || RECOMMENDATIONS.default;
    return list[Math.floor(Math.random() * list.length)];
  }

  // 初期表示
  const cur = weatherAPI?.getWeather?.();
  if (cur && textEl) textEl.textContent = getRecommendation(cur.code);

  return {
    update: (weatherData) => {
      if (!weatherData || !textEl) return;
      textEl.textContent = getRecommendation(weatherData.code);
    }
  };
}

