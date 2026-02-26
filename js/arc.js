document.addEventListener('DOMContentLoaded', function () {
  // すべての .container を取得
  const containers = document.querySelectorAll('.container');

  containers.forEach(function (container) {
    const button  = container.querySelector('.btn-box button');
    const content = container.querySelector('.more');

    if (!button || !content) return; // 念のため

    button.addEventListener('click', function () {
      const isOpen = content.classList.contains('appear'); // もともと開いていたか？

      // まず、すべて閉じる（ボタンのテキストも初期化）
      containers.forEach(function (c) {
        const otherContent = c.querySelector('.more');
        const otherButton  = c.querySelector('.btn-box button');
        if (!otherContent || !otherButton) return;

        otherContent.classList.remove('appear');
        if (otherButton.dataset.defaultText) {
          otherButton.textContent = otherButton.dataset.defaultText;
        }
      });

      // もともと閉じていた場合だけ、今回のだけ開く
      if (!isOpen) {
        content.classList.add('appear');
        this.textContent =
          this.dataset.openText ||
          this.dataset.defaultText ||
          this.textContent;
      }
      // もともと開いていた場合は、上の「全部閉じる」で閉じたまま
    });
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const imgs = document.querySelectorAll(".gray");

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const el = entry.target;

      /* 100%見えているとき */
      if (entry.isIntersecting && entry.intersectionRatio === 1) {
        // すでに予約 or カラーなら何もしない
        if (el._grayTimer || el.classList.contains("is-color")) return;

        // 1秒後にカラー
        el._grayTimer = setTimeout(() => {
          el.classList.add("is-color");
          el._grayTimer = null;
        }, 200);

      } else {
        /* 見えなくなったら */
        // 予約中ならキャンセル
        if (el._grayTimer) {
          clearTimeout(el._grayTimer);
          el._grayTimer = null;
        }
        // 白黒に戻す
        el.classList.remove("is-color");
      }
    });
  }, {
    threshold: [1.0]
  });

  imgs.forEach(img => io.observe(img));
});
// =====================
// FLOW スクロール表示
// =====================
document.addEventListener("DOMContentLoaded", () => {

  const items = document.querySelectorAll(".flow-wrap__body__item");

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {

      if(entry.isIntersecting){
        entry.target.classList.add("is-show");

        // 画像カラー化（既存gray活用）
        const imgs = entry.target.querySelectorAll(".gray");
        imgs.forEach(img=>{
          setTimeout(()=>{
            img.classList.add("is-color");
          },600);
        });

      }

    });
  },{
    threshold:0.5
  });

  items.forEach(el => io.observe(el));

});
document.addEventListener("DOMContentLoaded", () => {
  const flow = document.querySelector(".flow-wrap__body");
  if (!flow) return;

  const items = [...flow.querySelectorAll(".flow-wrap__body__item")];
  if (items.length === 0) return;

  const LINE_TOP = 75; // CSSの ::before / ::after の top と合わせる

  // 「最後の丸（step）」の位置までを最大値にする
  const getMaxLine = () => {
    const flowRect = flow.getBoundingClientRect();
    const last = items[items.length - 1];
    const lastRect = last.getBoundingClientRect();

    // lastの丸は top:18px なので、だいたい丸の中心（+18+22.5）に合わせる
    const lastDotCenterInFlow =
      (lastRect.top - flowRect.top) + 18 + 22.5;

    const max = Math.max(0, lastDotCenterInFlow - LINE_TOP);
    return max;
  };

  const update = () => {
    const flowRect = flow.getBoundingClientRect();
    const maxLine = getMaxLine();

    // 画面の中で「どこまで進んだか」
    // flowの上端が画面に入ってからの進捗を線にする
    const progressed = (window.innerHeight * 0.65) - flowRect.top - LINE_TOP;

    const line = Math.min(Math.max(progressed, 0), maxLine);
    flow.style.setProperty("--flow-line", `${line}px`);
  };

  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
});