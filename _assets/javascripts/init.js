const moon = {};
!(function($) {
  const scrollContainer = $('html, body');
  moon.scrollTo = scrollTo;
  moon.scrollToTop = scrollToTop;
  /**
   * scrollDuration 为 0 是，表示关闭动画
   * */
  function scrollTo(hash, scrollDuration, flashDuration) {
    if (hash.startsWith('#')) {
      hash = hash.substring(1);
    }
    const target = $(document.getElementById(hash));
    scrollDuration = scrollDuration || 500;
    flashDuration = flashDuration || 700;
    const container = scrollContainer;

    // 为 toc 添加滚动动画
    container.animate(
      {
        scrollTop: target.offset().top + container.scrollTop()
      },
      scrollDuration,
      () => {
        console.log('finish');
        // 滚动完成，闪动 header
        target
          .addClass('glowheader')
          .delay(flashDuration)
          .queue(function() {
            $(this)
              .removeClass('glowheader')
              .dequeue();
          });
      }
    );
  }

  function scrollToTop(scrollDuration, flashDuration) {
    scrollDuration = scrollDuration || 500;
    flashDuration = flashDuration || 700;
    scrollContainer.animate(
      {
        scrollTop: 0
      },
      scrollDuration
    );
  }

  $(() => {
    $('#scroll-top').click(scrollToTop);
  });
})(jQuery);

// Detect touch screen and enable scrollbar if necessary
function is_touch_device() {
  try {
    document.createEvent('TouchEvent');
    return true;
  } catch (e) {
    return false;
  }
}
if (is_touch_device()) {
  $('#nav-mobile').css({ overflow: 'auto' });
}

// fab
$(() => {
  const layout = $(window);
  let oldScroll = 0;
  const THREDSHOLD = 100;
  $(layout).scroll(() => {
    const current = $(layout).scrollTop();
    const dif = current - oldScroll;
    if (Math.abs(dif) > THREDSHOLD) {
      dif > 0 ? fireDown() : fireUp();
      oldScroll = current;
    }
  });

  function fireDown() {
    $('#fab').addClass('scale-out');
  }
  function fireUp() {
    $('#fab').removeClass('scale-out');
  }
});
$(() => {
  $('#fab').click(moon.scrollToTop);
});
