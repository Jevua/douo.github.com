---
---
!function($) {
moon.toc = function(){
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
            let toc = $(".section.table-of-contents")
            let wheight = $(window).height()
            let tocTop = $('nav').height() + $(".ribbon").height()
            let footerOffset = $('.page-footer').first().offset().top
            let bottomOffset = footerOffset - toc.height()
            console.log(`boffset${bottomOffset}`)
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
}(jQuery)

$(moon.toc.render)
