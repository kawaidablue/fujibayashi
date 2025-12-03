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

jQuery(function($) {
  if ($('.sound').length > 0) {
    $(document).on('click', '.sound', function() {
      const $sound = $(this);
      const $icon  = $sound.find('.sound-icon');
      const video  = $('.top-wrap__video video').get(0); // 生のDOM

      if (!video) return;

      if ($sound.hasClass('active')) {
        // 今：音あり → 音なしにする
        video.muted = true;
        $sound.removeClass('active').addClass('sound-mute');
        $icon.removeClass('fa-volume-up').addClass('fa-volume-off');
      } else {
        // 今：音なし → 音ありにする
        video.muted = false;

        // iOS/Safari対策：クリック(ユーザー操作)の中で play() を明示的に呼ぶ
        const p = video.play();
        if (p !== undefined) {
          p.catch(() => {
            // もし失敗しても無視（自動再生ブロックなど）
          });
        }

        $sound.addClass('active').removeClass('sound-mute');
        $icon.removeClass('fa-volume-off').addClass('fa-volume-up');
      }
    });
  }
});



