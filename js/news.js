/* =========
  静的HTML用：番号付きページネーション（SPで省略表示）
  - 1ページ件数: PAGE_SIZE = 5
  - SP(<=540px): 最大5リンク「＜ 1 … p-1 p p+1 … N ＞」
  - PC: 先頭/末尾 + 現在前後±2（ドット省略）
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

  // 現在ページ（10進）
  const url    = new URL(window.location.href);
  const q      = url.searchParams.get('page');
  const parsed = parseInt(q, 10);
  const current = (!isNaN(parsed) && parsed > 0) ? parsed : 1;

  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const page       = Math.min(current, totalPages);

  // 表示切替
  function renderPage(p){
    const start = (p - 1) * PAGE_SIZE;
    const end   = start + PAGE_SIZE;
    items.forEach((el, i)=> el.style.display = (i>=start && i<end) ? '' : 'none');
    renderPager(p);
  }

  // SP/PCでリンク数を切替
  function getLayout(){
    const isSP = window.matchMedia('(max-width: 540px)').matches;
    // SPは最大5リンク、PCは前後±2
    return isSP
      ? { maxLinks: 4, windowNum: 2 }   // 例：＜ 1 … p-1 p p+1 … N ＞
      : { maxLinks: 4, windowNum: 2 };  // 例：＜ 1 … p-2 p-1 p p+1 p+2 … N ＞
  }

  function renderPager(p){
    const { maxLinks, windowNum } = getLayout();
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

    // 候補集合：先頭/末尾/近傍
    const pages = new Set([1, totalPages]);
    for (let i=Math.max(1, p-windowNum); i<=Math.min(totalPages, p+windowNum); i++){
      pages.add(i);
    }

    // 上限超える場合は遠い番号から削る
    const toArraySorted = () => Array.from(pages).sort((a,b)=>a-b);
    while (pages.size > Math.min(maxLinks, totalPages)) {
      const arr = toArraySorted();
      // 端から削る（現在に遠い方を優先的に削除）
      const left  = arr[1];                       // 1 の次
      const right = arr[arr.length-2];            // N の一つ手前
      if (Math.abs(left - p) > Math.abs(right - p)) pages.delete(left);
      else pages.delete(right);
    }

    // ドットを入れながら描画
    let last = 0;
    toArraySorted().forEach(n=>{
      if (last && n - last > 1) pager.appendChild(dot());
      pager.appendChild(link(n, String(n), {active: n===p}));
      last = n;
    });

    // Next
    pager.appendChild(link(p+1, '>', {disabled: p>=totalPages}));
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

  // 画面幅が変わったら（縦横切替など）再描画
  window.addEventListener('resize', ()=> renderPager(
    Math.min(Math.max(1, parseInt(new URL(window.location.href).searchParams.get('page')||page,10)), totalPages)
  ));
})();
