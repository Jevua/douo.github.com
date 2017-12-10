---
---
const moon = {}
!function($) {
    let scrollContainer = $("html, body");
    moon.scrollTo = scrollTo;
    moon.scrollToTop = scrollToTop;
    /**
     * scrollDuration 为 0 是，表示关闭动画
    **/
    function scrollTo(hash, scrollDuration, flashDuration) {
        if(hash.startsWith("#")){
            hash = hash.substring(1);
        }
        var target =  $(document.getElementById(hash));
        scrollDuration = scrollDuration || 500;
        flashDuration = flashDuration || 700;
        var container = scrollContainer;

        //为 toc 添加滚动动画
        container.animate({
            scrollTop: target.offset().top + container.scrollTop()
        }, scrollDuration, function() {
            console.log("finish");
            //滚动完成，闪动 header
            target.addClass('glowheader').delay(flashDuration).queue(function() {
                $(this).removeClass('glowheader').dequeue();
            });
        });
    }

    function scrollToTop(scrollDuration, flashDuration){
        scrollDuration = scrollDuration || 500;
        flashDuration = flashDuration || 700;
        scrollContainer.animate({
            scrollTop: 0
        }, scrollDuration);
    }

    $(function(){
        $("#scroll-top").click(scrollToTop);
    })

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
            // Floating-Fixed table of contents
            // 只有 toc 小于 window 高度才启用 pushpin
            if(wheight > toc.height()){
                toc.pushpin({
                    top: tocTop
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

}(jQuery);


$(document).ready(() =>{
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


