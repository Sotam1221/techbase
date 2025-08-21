// quote.js
import { storage } from "./storage.js";

const QUOTES = [
  "成し遂げんとした志をただ一回の敗北によって捨ててはいけない。（シェイクスピア）",
  "うしろをふり向く必要はない。あなたの前にはいくらでも道があるのだから。（魯迅）",
  "なりたかった自分になるのに遅すぎるということはない。（ジョージ・エリオット）",
  "何も後悔することがなければ、人生はとても空虚なものになるだろう。（ゴッホ）",
  "今日という日は、残りの人生の最初の日である。（チャールズ・ディードリッヒ）",
  "下を向いていたら、虹を見つけることは出来ないよ。（チャップリン）",
  "現状維持では、後退するばかりである。（ウォルト・ディズニー）",
  "凧が一番高く上がるのは、風に向かっている時である。風に流されている時ではない。（ウィンストン・チャーチル）",
  "為せば成る　為さねば成らぬ　何事も　成らぬは人の　為さぬなりけり（上杉鷹山）",
  "挫折を経験したことが無い者は、何も新しい事に挑戦したことが無いということだ。（アインシュタイン）",
  "天才とは、1%のひらめきと99%の努力である。（トーマス・エジソン）",
  "一日生きることは、一歩進むことでありたい。（湯川秀樹）",
  "もうこれで満足だという時は、すなわち衰える時である。（渋沢栄一）",
  "落ちたら、またはいあがってくればいいだけのこと。（アントニオ猪木）",
  "失敗を恐れているなら、おそらく君は失敗するだろう。（コービー・ブライアント）",
  "努力は必ず報われる。もし報われない努力があるのならば、それはまだ努力と呼べない。（王貞治）",
  "千里の道も一歩から（老子）",
  "努力する人は希望を語り、怠ける人は不満を語る。（井上靖）",
  "一流と二流の違いは、才能よりも習慣だ。（セリーナ・ウィリアムズ）",
  "勝利者とは、最後まであきらめなかった人である。（ナポレオン）",
  "やめなければ失敗は存在しない。（エルバート・ハバード）",
  "今日やらなければ、明日もできない。（ヨハン・クライフ）",
  "毎日1%の改善を積み重ねれば、1年後には37倍の成果になる。（ジェームズ・クリア）",
];

const COOKIE_FAV = "favorite_quote";

let refs = null;
let current = "";

function pickRandom() {
  const i = Math.floor(Math.random() * QUOTES.length);
  return QUOTES[i];
}

function showQuote(q) {
  current = q;
  refs.display.textContent = q;
}

function loadFavorite() {
  const fav = storage.getCookie(COOKIE_FAV);
  refs.favSpan.textContent = fav || "なし";
}

function saveFavorite() {
  if (!current) return;
  storage.setCookie(COOKIE_FAV, current);
  loadFavorite();
}

export function initQuote({ display, getBtn, saveBtn, favSpan }) {
  refs = { display, getBtn, saveBtn, favSpan };
  loadFavorite();

  getBtn.addEventListener("click", () => showQuote(pickRandom()));
  saveBtn.addEventListener("click", saveFavorite);

  return {
    reset() {
      storage.delCookie(COOKIE_FAV);
      loadFavorite();
      display.textContent = "ここに名言が表示されます。";
      current = "";
    }
  };
}
