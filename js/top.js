// top.js
document.addEventListener('DOMContentLoaded', () => {
  const target = document.querySelector('.top-wrap');
  if (!target) return;

  // 見えたら .show を付与（1回だけ）
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('show');
          io.unobserve(e.target);
        }
      }
    }, { threshold: 0.5 });
    io.observe(target);
  } else {
    // フォールバック（古い環境）
    target.classList.add('show');
  }
});
