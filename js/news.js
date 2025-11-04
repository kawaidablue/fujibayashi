/* =========
  番号付きページネーション（次ページが必ず見える）
  - 1ページ件数: PAGE_SIZE = 5
  - SP(<=540px): 数字最大5個
  - PC: 数字最大7個
  - 常に current と current+1（存在すれば）を優先保持
========= */

(function(){
  const LIST_SELECTOR = '.news-wrap__body__list';
  const ITEM_SELECTOR = '.news-wrap__body__list__item';
  const PAGER_ID      = 'pager';
  const PAGE_SIZE     = 5;
  const ANCHOR_HASH   = '#news';

  const list  = document.querySelector(LIST_SELECTOR);
  const items = list ? Array.from(list.querySelectorAll(ITEM_SELECTOR)) : [];
  const pager = document.getElementById(PAGER_ID);
  if (!list || !items.length || !pager) return;

  // 現在ページ
  const url    = new URL(window.location.href);
  const q      = url.searchParams.get('page');
  const parsed = parseInt(q, 10);
  const current = (!isNaN(parsed) && parsed > 0) ? parsed : 1;

  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const page       = Math.min(current, totalPages);

  // レイアウト：数字リンク数（Prev/Nextはカウント外）
  const isSP = window.matchMedia('(max-width: 540px)').matches;
  const MAX_NUMS = isSP ? 5 : 7;  // 必要なら 4/5/9 などに変更OK

  // 表示切替
  function renderPage(p){
    const start = (p - 1) * PAGE_SIZE, end = start + PAGE_SIZE;
    items.forEach((el, i)=> el.style.display = (i>=start && i<end) ? '' : 'none');
    renderPager(p);
  }

  // 数字配列を作る（current & current+1 を最優先で残す）
  // 数字配列を作る（current と current+1 だけ優先保持。p+2は入れない）
// 数字配列を作る
// ルール：必ず [p] と [p+1]（存在すれば）を表示。p-1 と p+2 は入れない。
// 端(1 / totalPages)は可能な限り残し、上限を超えたら遠い番号から削る。
function buildPages(p){
  const pages = new Set();
  const must  = new Set([p]);          // 必須：現在ページ
  if (p < totalPages) must.add(p + 1); // 必須：次ページ（存在すれば）

  // 端は基本残す（必要に応じて省略）
  pages.add(1);
  pages.add(totalPages);

  // 近傍（p-1は入れない／p+2も入れない）
  pages.add(p);            // 現在
  if (p + 1 <= totalPages) pages.add(p + 1);

  // 最大表示数（数字リンクのみ。Prev/Nextは含めない）
  const isSP = window.matchMedia('(max-width: 540px)').matches;
  const MAX_NUMS = isSP ? 5 : 7;

  const normalize = () =>
    Array.from(pages).filter(x => x >= 1 && x <= totalPages).sort((a,b)=>a-b);

  let arr = normalize();

  // 超過分は現在から遠い→端→その他の順で削る
  while (arr.length > Math.min(MAX_NUMS, totalPages)) {
    // 削除候補（必須以外）
    const cand = arr.filter(n => !must.has(n));
    if (!cand.length) break;

    // 現在から遠い順（同距離なら小さい方を優先して削除）
    cand.sort((a,b)=>{
      const da = Math.abs(a - p), db = Math.abs(b - p);
      if (da !== db) return db - da; // 遠い方から
      return a - b;                  // 同距離は左から
    });

    let toRemove = cand[0];

    // 端(1 / totalPages)は極力残したい → 端が選ばれたら次候補を削る
    if ((toRemove === 1 || toRemove === totalPages) && cand.length > 1) {
      toRemove = cand[1];
    }

    pages.delete(toRemove);
    arr = normalize();
  }

  return normalize();
}



  // ページャ生成
  function renderPager(p){
    pager.innerHTML = '';

    const link = (to, label, {disabled=false, active=false}={})=>{
      const el = document.createElement('a');
      el.href = buildHref(to);
      el.textContent = label;
      if (disabled) el.classList.add('is-disabled');
      if (active)   el.classList.add('is-active');
      el.addEventListener('click', (e)=>{ e.preventDefault(); go(to); });
      return el;
    };
    const dot = ()=>{
      const d = document.createElement('span');
      d.textContent = '…';
      d.setAttribute('aria-hidden','true');
      d.style.border = 'none';
      return d;
    };

    // Prev
    pager.appendChild(link(p-1, '＜', {disabled: p<=1}));

    // 数字（必ず p+1 を含む）
    const nums = buildPages(p);
    let last = 0;
    nums.forEach(n=>{
      if (last && n - last > 1) pager.appendChild(dot());
      pager.appendChild(link(n, String(n), {active: n===p}));
      last = n;
    });

    // Next
    pager.appendChild(link(p+1, '＞', {disabled: p>=totalPages}));
  }

  function buildHref(to){
    const u = new URL(window.location.href);
    u.searchParams.set('page', to);
    u.hash = ANCHOR_HASH;
    return u.toString();
  }

  function go(to){
    const clamped = Math.min(Math.max(1,to), totalPages);
    const u = new URL(window.location.href);
    u.searchParams.set('page', clamped);
    u.hash = ANCHOR_HASH;
    history.replaceState(null, '', u.toString());
    renderPage(clamped);
    const target = document.querySelector(ANCHOR_HASH);
    if (target) target.scrollIntoView({behavior:'smooth', block:'start'});
  }

  // 初期表示
  renderPage(page);

  // 画面幅変更で再描画（レイアウトがSP/PCをまたぐ場合）
  window.addEventListener('resize', ()=> renderPager(
    Math.min(Math.max(1, parseInt(new URL(window.location.href).searchParams.get('page')||page,10)), totalPages)
  ));
})();
