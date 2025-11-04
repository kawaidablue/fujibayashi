$(function () {
    var moreNum = 10; // 1回で出す数（最初は10件表示）
  
    var $items = $('.news-wrap__body__list__item');
  
    // 11件目以降を隠す
    $items.slice(moreNum).addClass('is-hidden').hide();
  
    // 初期：総件数が少なければボタン非表示
    if ($items.length <= moreNum) {
      $('.news-wrap__body__more').addClass('is-btn-hidden');
    }
  
    // もっと見る（a でも button でもOKに）
    $('.news-wrap__body__more').on('click', 'a, button', function (e) {
      e.preventDefault();
  
      var $hidden = $('.news-wrap__body__list__item.is-hidden');
  
      // 次の10件を開く
      $hidden.slice(0, moreNum).each(function () {
        $(this).removeClass('is-hidden').slideDown(220);
      });
  
      // 残りがなければボタンをフェードアウト
      if ($('.news-wrap__body__list__item.is-hidden').length === 0) {
        $('.news-wrap__body__more').fadeOut(180);
      }
    });
  });
  