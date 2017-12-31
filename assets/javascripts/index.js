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
            isActive = item.url.toUpperCase() == window.location.pathname.toUpperCase()
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
            var nav = $("#note-nav")
            nav.empty()
            parent =$("<ul class=\"collapsible\"></ul>")
            for(var i=0; i<data.children.length; i++){
                renderItem(parent,data.children[i]);
            }
            nav.append(parent)
            $('.collapsible').collapsible();
        }
    }

    }(),
    toc : function(){
        function findHeader(content){
            return content.find("h1,h2,h3,h4,h5").map((_,header) => {
                $(header).addClass("section scrollspy")
                return {
                    id    : header.id,
                    title : header.innerText,
                    level : ~~header.tagName[1]
                }
            })
        }
        function calcPushpin(){
            console.log("calcPushpin")
            let toc = $(".section.table-of-contents")
            let wheight = $(window).height()
            let tocTop = $('nav').height()
            let footerOffset = $('footer').first().offset().top
            let bottomOffset = footerOffset - toc.height()
            // Floating-Fixed table of contents
            // 只有 toc 小于 window 高度才启用 pushpin
            if(wheight > toc.height()){
                toc.pushpin({
                    top: tocTop,
                    bottom: bottomOffset
                });
            }
        }
        return {
            render: function(){
                let headers = findHeader($(".content"))
                let toc = $(".section.table-of-contents")
                toc.empty()
                headers.each(
                    (_,h) => toc.append(`<li class="header-${h.level}"><a href="#${h.id}">${h.title}</li>`))
                $(".section.scrollspy").scrollSpy()
                calcPushpin()
            }
        }
    }()
}


$(document).ready(() =>{
    var elem = document.querySelector('.sidenav');
    var instance = new M.Sidenav(elem, {
        onOpenEnd: ()=>{
            $("#nav-tab").removeClass("hide-on-med-and-down")
        },
        onCloseStart:()=>{
            $("#nav-tab").addClass("hide-on-med-and-down")
        }
    });

    $.ajax({
        url: "/notes/tree.json",
        dataType: 'json'
    }).done((data) => {
        var instance = new M.Tabs(document.getElementsByClassName("tabs")[0],
                                  {onShow: (e) => {
                                      if(e.id == "note-nav"){
                                          if(!e.hasChildNodes()){
                                              note.navigator.render(data)
                                          }
                                          $("#logo-container").attr("href","/notes")
                                          $("#front-page-logo").attr("data", "/assets/images/materialize.svg")
                                      }else{
                                          $("#logo-container").attr("href","/")
                                          $("#front-page-logo").attr("data", "/assets/images/blog.svg")
                                      }
                                  }});
        if(window.location.pathname.startsWith("/notes")){
            instance.select("note-nav")
        }else{
            instance.select("blog-nav")
        }
    })
    note.toc.render()
})

