import { storage } from "./storage.js";

const CK_CITY = "weather_city";

function mapWmoToApp(wmo) {
  // https://open-meteo.com/
  if ([71,73,75,77,85,86].includes(wmo)) return { code: "snow",   label: "雪" };
  if ([51,53,55,56,57,61,63,65,66,67,80,81,82].includes(wmo)) return { code: "rain",   label: "雨" };
  if ([0,1].includes(wmo))                                   return { code: "sunny",  label: "晴れ" };
  return { code: "cloudy", label: "くもり" };
}

// 都市名
async function geocodeCity(name) {
  const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
  url.searchParams.set("name", name);
  url.searchParams.set("language", "ja");
  url.searchParams.set("count", "1");
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Geocoding failed: ${res.status}`);
  const data = await res.json();
  const hit = data && data.results && data.results[0];
  if (!hit) throw new Error("指定の都市が見つかりませんでした。");
  return {
    city: hit.name,
    lat: hit.latitude,
    lon: hit.longitude,
    country: hit.country,
  };
}

// 予報取得
async function fetchTodayForecast(lat, lon) {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", lat);
  url.searchParams.set("longitude", lon);
  url.searchParams.set("current", "weather_code,temperature_2m");
  url.searchParams.set("daily", "weather_code,temperature_2m_max,temperature_2m_min");
  url.searchParams.set("timezone", "auto");
  url.searchParams.set("forecast_days", "1");

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Forecast failed: ${res.status}`);
  const json = await res.json();

  const wmoNow = json?.current?.weather_code;
  const tempC  = json?.current?.temperature_2m;
  const wmoDay = json?.daily?.weather_code?.[0];
  const hiC    = json?.daily?.temperature_2m_max?.[0];
  const loC    = json?.daily?.temperature_2m_min?.[0];

  const { code, label } = mapWmoToApp(typeof wmoNow === "number" ? wmoNow : wmoDay);
  return { code, label, tempC, hiC, loC };
}

// 内部状態
let refs = null;
let current = null;
const listeners = new Set();

function renderStatus() {
  if (!refs?.statusEl) return;
  if (!current) { refs.statusEl.textContent = "取得中…"; return; }
  const t = (n) => (typeof n === "number" ? `${Math.round(n)}℃` : "-");
  refs.statusEl.textContent = `${current.city}：${current.label}（現在 ${t(current.tempC)} / 最高 ${t(current.hiC)} / 最低 ${t(current.loC)}）`;
}

// 都市を指定してロード
async function load(city) {
  try {
    refs.statusEl.textContent = "取得中…";
    const loc = await geocodeCity(city);
    const f = await fetchTodayForecast(loc.lat, loc.lon);
    current = { city: loc.city, ...f };
    storage.setCookie(CK_CITY, current.city);
    renderStatus();
    // 連携先に通知
    listeners.forEach((fn) => { try { fn(current); } catch {} });
  } catch (e) {
    current = null;
    refs.statusEl.textContent = `取得に失敗しました：${e.message || e}`;
  }
}

// 公開API
export function initWeather({ statusEl, cityInput, refreshBtn }) {
  refs = { statusEl, cityInput, refreshBtn };

  const saved = storage.getCookie(CK_CITY) || "Tokyo";
  cityInput.value = saved;
  // 初期ロード
  load(saved);

  refreshBtn.addEventListener("click", () => {
    const city = (cityInput.value || "Tokyo").trim();
    load(city);
  });

  return {
    getWeather() { return current; },
    onChange(handler) { if (typeof handler === "function") listeners.add(handler); return () => listeners.delete(handler); }
  };
}
