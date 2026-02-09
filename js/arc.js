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

