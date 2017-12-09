---
---
/* require=jquery.js
 * require=materialize.js
 */
const note = {
    navigator : function() {
    function renderItem(parent, item, level = 0){
        let	li = $("<li></li>") // 当前项
	      let isActive  // 用于找到激活的菜单项
        if(item.children){
            li.addClass('bold')

            let header = $(`<a class="collapsible-header waves-effect waves-teal">${item.title}</a>`)

	          header.addClass(`level-h${level}`);
            let body = $("<div class=\"collapsible-body\"></div>")
            let ul = $("<ul></ul>")
            let grandchild = false;
	          for(var i=0;i<item.children.length;i++){
                grandchild |= !(item.children[i].children === "undefined");
		            isActive |= renderItem(ul,item.children[i],level+1);
	          }
            if(grandchild){
                ul.addClass("collapsible");
            }
            if(isActive){
                li.addClass('active')
	          }
            $(body).append(ul)
            li.append(header).append(body)
	      }else{
            isActive = item.url == window.location.pathname
            if(isActive){
                li.addClass('active')
            }
            li.append(`<a class="level-h${level}" href="${item.url}">${item.title}</a>`)
	      }
        parent.append(li)
        return isActive
    }

    return {
        render: function(data) {
            $('#nav-loading-indicator').removeClass("active").hide()
            data = data.children[0];
            var nav = $("#nav")
            nav.empty()
            parent =$("<ul class=\"collapsible\"></ul>")
            for(var i=0; i<data.children.length; i++){
                renderItem(parent,data.children[i]);
            }
            nav.append(parent)
            $('.collapsible').collapsible();
        }
    }
}()
}


$(document).ready(() =>{
    $.ajax({
        url: "/notes/tree.json",
        dataType: 'json'
    }).done((data) => {
        note.navigator.render(data)
    })

    $('.sidenav').sidenav();
})



// Detect touch screen and enable scrollbar if necessary
function is_touch_device() {
    try {
        document.createEvent("TouchEvent");
        return true;
    } catch (e) {
        return false;
    }
}
if (is_touch_device()) {
    $('#nav-mobile').css({ overflow: 'auto'});
}

// Floating-Fixed table of contents
setTimeout(function() {
    if ($('nav').length) {
        $('.toc-wrapper').pushpin({
            top: $('nav').height(),
        });
    }
}, 100);

