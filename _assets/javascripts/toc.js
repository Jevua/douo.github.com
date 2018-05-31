import $ from 'jquery';
import M from 'materialize-css';

export default class Toc {
  setup() {
    this.initToc();
    this.toc.render();
  }

  initToc() {
    function findHeader(content) {
      return content.find('h1,h2,h3,h4,h5').map((_, header) => {
        $(header).addClass('section scrollspy');
        return {
          id: header.id,
          title: header.innerText,
          level: ~~header.tagName[1]
        };
      });
    }

    function calcPushpin() {
      console.log('calcPushpin');
      const toc = $('.section.table-of-contents');
      const wheight = $(window).height();
      const tocTop = $('nav').height();
      const footerOffset = $('footer')
        .first()
        .offset().top;
      const bottomOffset = footerOffset - toc.height();
      // Floating-Fixed table of contents
      // 只有 toc 小于 window 高度才启用 pushpin
      if (wheight > toc.height()) {
        M.Pushpin.init(
          document.querySelectorAll('.section.table-of-contents'),
          {
            top: tocTop,
            bottom: bottomOffset
          }
        );
      }
    }

    this.toc = {
      render: () => {
        const headers = findHeader($('.content'));
        const toc = $('.section.table-of-contents');
        toc.empty();
        headers.each((_, h) =>
          toc.append(
            `<li class="header-${h.level}"><a href="#${h.id}">${h.title}</li>`
          )
        );
        M.ScrollSpy.init(document.querySelectorAll('.section.scrollspy'), {});
        calcPushpin();
      }
    };

    function hide() {
      $('.content').attr(
        'class',
        'content col s12 m10 offset-m1 xl10 offset-xl1'
      );
      $('.toc-wrapper').hide();
    }

    function show() {
      $('.content').attr(
        'class',
        'content col s12 m8 offset-m1 xl7 offset-xl1'
      );
      $('.toc-wrapper').show();
    }

    $('#toc-toggle').click(() => {
      if ($('.toc-wrapper').is(':visible')) {
        hide();
      } else {
        show();
      }
    });
    $('#toc-toggle').hover(
      () => {
        $('#toc-toggle').css({ opacity: '1' });
      },
      () => {
        $('#toc-toggle').css({ opacity: '0.1' });
      }
    );
  }
}
