import lunr from 'lunr';
import $ from 'jquery';

export default class Search {
  setup() {
    $.ajax({
      url: '/index.json',
      dataType: 'json'
    }).done(this.render);
  }

  render(data) {
    function config() {
      this.field('token');
      this.field('tags');
      this.ref('ref');
      this.pipeline.reset();
      const hash = {};
      data.forEach(item => {
        hash[item.ref] = item;
        this.add(item);
      });
      // icon click
      $('ul#nav-mobile li.search .search-wrapper i.material-icons').click(
        () => {
          if ($('.search-results .focused').length) {
            $('.search-results .focused')
              .first()[0]
              .click();
          } else if ($('.search-results').children().length) {
            $('.search-results')
              .children()
              .first()[0]
              .click();
          }
        }
      );

      function renderResults(results) {
        const resultsContainer = $('.search-results');
        resultsContainer.empty();
        results.forEach(result => {
          const resultDiv = $(`<a href="${result[0]}">${result[1]}</a>1`);
          resultsContainer.append(resultDiv);
        });
      }

      function debounce(fn) {
        let timeout;
        return function _fn(...args) {
          const ctx = this;
          clearTimeout(timeout);
          timeout = setTimeout(() => {
            fn.apply(ctx, args);
          }, 100);
        };
      }

      $('input#search').focus(function fn() {
        $(this)
          .parent()
          .addClass('focused');
      });
      $('input#search').blur(function fn() {
        if (!$(this).val()) {
          $(this)
            .parent()
            .removeClass('focused');
        }
      });

      $('input#search').on(
        'keyup',
        debounce(function fn(e) {
          if ($(this).val() < 2) {
            renderResults([]);
            return;
          }
          if (e.which === 38 || e.which === 40 || e.keyCode === 13) return;
          const query = $(this).val();
          const results = window.index
            .search(query)
            .slice(0, 10)
            .map(result => [result.ref, hash[result.ref].title]);
          renderResults(results);
        })
      );

      $('input#search').on(
        'keydown',
        debounce(function fn(e) {
          // Escape.
          if (e.keyCode === 27) {
            $(this).val('');
            $(this).blur();
            renderResults([]);
            return;
          } else if (e.keyCode === 13) {
            // enter
            if ($('.search-results .focused').length) {
              $('.search-results .focused')
                .first()[0]
                .click();
            } else if ($('.search-results').children().length) {
              $('.search-results')
                .children()
                .first()[0]
                .click();
            }
            return;
          }

          // Arrow keys.
          let focused;
          switch (e.which) {
            case 38: // up
              if ($('.search-results .focused').length) {
                focused = $('.search-results .focused');
                focused.removeClass('focused');
                focused.prev().addClass('focused');
              }
              break;

            case 40: // down
              if (!$('.search-results .focused').length) {
                focused = $('.search-results')
                  .children()
                  .first();
                focused.addClass('focused');
              } else {
                focused = $('.search-results .focused');
                if (focused.next().length) {
                  focused.removeClass('focused');
                  focused.next().addClass('focused');
                }
              }
              break;

            default:
              return; // exit this handler for other keys
          }
          e.preventDefault();
        })
      );
    }
    window.index = lunr(config);
  }
}
