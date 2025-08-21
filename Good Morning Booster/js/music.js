const MAP = {
  great: {
    sunny:  ["Upbeat Pop", "City Pop Drive", "Morning EDM"],
    cloudy: ["Lo-fi Beats", "Indie Pop"],
    rain:   ["Jazz Morning", "Neo-Soul Chill"],
    snow:   ["Piano Bright", "Acoustic Pop"]
  },
  good: {
    sunny:  ["City Pop", "Funk Morning"],
    cloudy: ["Acoustic", "Indie Folk"],
    rain:   ["Jazz Calm", "Bossa Nova"],
    snow:   ["Piano Calm", "Lo-fi Piano"]
  },
  soso: {
    sunny:  ["Chillhop", "Ambient Pop"],
    cloudy: ["Ambient", "Downtempo"],
    rain:   ["Rainy Jazz", "Bedroom Pop"],
    snow:   ["Neo Classical", "Quiet Piano"]
  },
  bad: {
    sunny:  ["Healing", "Nature Sounds + Piano"],
    cloudy: ["Relax Piano", "Slow Jazz"],
    rain:   ["Warm Acoustic", "Soft R&B"],
    snow:   ["Calm Strings", "Cozy Piano"]
  }
};

function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

export function initMusic({ textEl }, { moodAPI, weatherAPI }) {
  function currentMood() {
    return (moodAPI?.getTodayMood?.() || "soso");
  }
  function currentWeatherCode() {
    return (weatherAPI?.getWeather?.()?.code || "cloudy");
  }

  function render() {
    if (!textEl) return;
    const m = currentMood();
    const w = currentWeatherCode();
    const list = MAP[m]?.[w] || ["Morning Mix"];
    textEl.textContent = pick(list);
  }

  // 初期表示
  render();

  weatherAPI?.onChange?.(() => render());
  moodAPI?.onChange?.(() => render());

  return { refresh: render };
}
