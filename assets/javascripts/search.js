(function($) {
  $.ajax({
   url: "/index.json",
   dataType: 'json'
  }).done((data) => {
   window.index = lunr(function() {
    this.field('token');
    this.field('tags');
    this.ref('ref');
    this.pipeline.reset();
    hash = {};
    for (var i=0;i<data.length;i++){
        hash[data[i].ref] = data[i];
        this.add(data[i])
    }
    // icon click
    $('ul#nav-mobile li.search .search-wrapper i.material-icons').click(function() {
     if ($('.search-results .focused').length) {
      $('.search-results .focused').first()[0].click();
     } else if ($('.search-results').children().length) {
      $('.search-results').children().first()[0].click();
     }
    });

    var renderResults = function(results) {
     var resultsContainer = $('.search-results');
     resultsContainer.empty();
        Array.prototype.forEach.call(results, function(result) {
      var resultDiv = $('<a href="' + result[0] + '">' + result[1] + '</a>');
      resultsContainer.append(resultDiv);
     });
    };

    var debounce = function(fn) {
     var timeout;
     return function() {
      var args = Array.prototype.slice.call(arguments),
       ctx = this;

      clearTimeout(timeout);
      timeout = setTimeout(function() {
       fn.apply(ctx, args);
      }, 100);
     };
    };

    $('input#search').focus(function() {
     $(this).parent().addClass('focused');
    });
    $('input#search').blur(function() {
     if (!$(this).val()) {
      $(this).parent().removeClass('focused');
     }
    });

    $('input#search').on('keyup', debounce(function(e) {
     if ($(this).val() < 2) {
      renderResults([]);
      return;
     }

     if (e.which === 38 || e.which === 40 || e.keyCode === 13) return;

     var query = $(this).val();
     var results = window.index.search(query).slice(0, 10).map(function(result) {
         return [result.ref, hash[result.ref].title];
     });
     renderResults(results);
    }));


    $('input#search').on('keydown', debounce(function(e) {
     // Escape.
     if (e.keyCode === 27) {
      $(this).val('');
      $(this).blur();
      renderResults([]);
      return;
     } else if (e.keyCode === 13) {
      // enter
      if ($('.search-results .focused').length) {
       $('.search-results .focused').first()[0].click();
      } else if ($('.search-results').children().length) {
       $('.search-results').children().first()[0].click();
      }
      return;
     }

     // Arrow keys.
     var focused;
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
        focused = $('.search-results').children().first();
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
    }));
   });
  })
  }(jQuery));
