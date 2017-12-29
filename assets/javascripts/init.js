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

}(jQuery);


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



//fab
$(function() {
    var layout = $(window);
    var oldScroll = 0;
    var THREDSHOLD = 100;
    console.log("before scroll")
    $( layout ).scroll(function() {
        let current = $(layout).scrollTop();
        let dif = current - oldScroll;
        if(Math.abs(dif) > THREDSHOLD){
            dif > 0? fireDown() : fireUp();
            oldScroll = current;
        }
    });

    function fireDown(){
        console.log("fireDown")
        $("#fab").addClass("scale-out")
    }
    function fireUp(){
        console.log("fireUp")
        $("#fab").removeClass("scale-out")
    }
});
$(function(){
    $("#fab").click(moon.scrollToTop);
})

