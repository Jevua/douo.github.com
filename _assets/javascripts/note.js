import $ from 'jquery';
import M from 'materialize-css';

export default class Note {
  constructor() {
    this.initNavigator();
  }

  setup() {
    $.ajax({
      url: '/notes/tree.json',
      dataType: 'json'
    }).done(data => {
      const instance = new M.Tabs(document.getElementsByClassName('tabs')[0], {
        onShow: e => {
          if (e.id === 'note-nav') {
            if (!e.hasChildNodes()) {
              this.navigator.render(data);
            }
            $('#logo-container').attr('href', '/notes');
            $('#front-page-logo').attr(
              'data',
              '/assets/images/materialize.svg'
            );
          } else {
            $('#logo-container').attr('href', '/');
            $('#front-page-logo').attr('data', '/assets/images/blog.svg');
          }
        }
      });
      if (window.location.pathname.startsWith('/notes')) {
        instance.select('note-nav');
      } else {
        instance.select('blog-nav');
      }
    });
  }

  initNavigator() {
    function renderItem(parent, item, level = 0) {
      const li = $('<li></li>'); // 当前项
      let isActive = false; // 用于找到激活的菜单项
      if (item.children) {
        li.addClass('bold');
        const header = $(
          `<a class="collapsible-header waves-effect waves-teal">${
            item.title
          }</a>`
        );

        header.addClass(`level-h${level}`);
        const body = $('<div class="collapsible-body"></div>');
        const ul = $('<ul></ul>');
        let grandchild = false;
        item.children.forEach(child => {
          grandchild = grandchild || !(child.children === 'undefined');
          const childActive = renderItem(ul, child, level + 1);
          isActive = isActive || childActive
        });

        if (grandchild) {
          ul.addClass('collapsible');
        }
        if (isActive) {
          li.addClass('active');
        }
        $(body).append(ul);
        li.append(header).append(body);
      } else {
        isActive =
          item.url.toUpperCase() === window.location.pathname.toUpperCase();
        if (isActive) {
          li.addClass('active');
        }
        li.append(
          `<a class="level-h${level}" href="${item.url}">${item.title}</a>`
        );
      }
      parent.append(li);
      return isActive;
    }

    this.navigator = {
      render: _data => {
        $('#nav-loading-indicator')
          .removeClass('active')
          .hide();
        const data = _data.children[0];
        const nav = $('#note-nav');
        nav.empty();
        const parent = $('<ul class="collapsible"></ul>');
        data.children.forEach(child => renderItem(parent, child));
        nav.append(parent);
        M.Collapsible.init(document.querySelectorAll('.collapsible'));
      }
    };
  }
}
