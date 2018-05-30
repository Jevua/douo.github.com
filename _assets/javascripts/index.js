import $ from 'jquery';
import M from 'materialize-css';
import Note from './note';
import Search from './search';
import Toc from './toc';
import Pretty from './pretty';

// Detect touch screen and enable scrollbar if necessary
function isTouchDevice() {
  try {
    document.createEvent('TouchEvent');
    return true;
  } catch (e) {
    return false;
  }
}

/**
 *
 * @param {*} hash
 * @param {*} scrollDuration
 * @param {*} flashDuration
 */
function scrollTo(
  scrollContainer,
  hash,
  scrollDuration = 500,
  flashDuration = 700
) {
  if (hash.startsWith('#')) {
    hash = hash.substring(1);
  }
  const target = $(document.getElementById(hash));
  const container = scrollContainer;

  // 为 toc 添加滚动动画
  container.animate(
    {
      scrollTop: target.offset().top + container.scrollTop()
    },
    scrollDuration,
    () => {
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

function scrollToTop(
  scrollContainer,
  scrollDuration = 500,
  flashDuration = 700
) {
  scrollContainer.animate(
    {
      scrollTop: 0
    },
    scrollDuration
  );
}

function initScoll() {
  const scrollContainer = $('html, body');
  window.scrollTo = (hash, scrollDuration, flashDuration) =>
    scrollTo(scrollContainer, hash, scrollDuration, flashDuration);
  window.scrollToTop = (scrollDuration, flashDuration) =>
    scrollToTop(scrollContainer, scrollDuration, flashDuration);
  $(() => {
    $('#scroll-top').click(scrollToTop);
  });
}

function initFab() {
  const layout = $(window);
  let oldScroll = 0;
  const THREDSHOLD = 100;

  function fireDown() {
    $('#fab').addClass('scale-out');
  }

  function fireUp() {
    $('#fab').removeClass('scale-out');
  }

  $(layout).scroll(() => {
    const current = $(layout).scrollTop();
    const dif = current - oldScroll;
    if (Math.abs(dif) > THREDSHOLD) {
      dif > 0 ? fireDown() : fireUp();
      oldScroll = current;
    }
  });

  $(() => {
    $('#fab').click(scrollToTop);
  });
}

$(document).ready(() => {
  initScoll();
  initFab();
  M.AutoInit();
  if (isTouchDevice()) {
    $('#nav-mobile').css({
      overflow: 'auto'
    });
  }

  const elems = document.querySelectorAll('.sidenav');
  M.Sidenav.init(elems, {
    onOpenEnd: () => {
      $('#nav-tab').removeClass('hide-on-med-and-down');
    },
    onCloseStart: () => {
      $('#nav-tab').addClass('hide-on-med-and-down');
    }
  });

  const search = new Search();
  const toc = new Toc();
  const note = new Note();
  search.setup();
  toc.setup();
  note.setup();
  Pretty.setup();
});
