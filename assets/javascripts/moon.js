!function($) {
    var moon = {};
    var scrollContainer;
    moon.scrollTo = scrollTo;

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

    // 找出 mdl 下可用的滚动容器
    function setupScrollContainer(){
        if($(".mdl-layout__header--scroll").length > 0){
            scrollContainer = $(".mdl-layout");
        }else{
            scrollContainer = $(".mdl-layout__content");
        }
    }
    $(setupScrollContainer);

    // hack for https://github.com/google/material-design-lite/issues/4726
    function fixHashScroll(){
        if(window.location.hash){
            scrollTo(window.location.hash,0);
        }
    }
    // 放在 jquery 的 readyList 尾部。
    // 让其尽量延后到页面高度已经计算完毕后执行
    $(function(){$(fixHashScroll)});


    //fab
    $(function() {
        var layout = scrollContainer;
        var oldScroll = 0;
        var THREDSHOLD = 100;

        $( layout ).scroll(function() {
            current = $(layout).scrollTop();
            dif = current - oldScroll;
            if(Math.abs(dif) > THREDSHOLD){
                dif > 0? fireDown() : fireUp();
                oldScroll = current;
            }
        });

        function fireDown(){
            $("#fab-share").hide(200);
        }
        function fireUp(){
            $("#fab-share").show(200);
        }
    });

    $(function(){
        $("#scroll-top").click(scrollToTop);
    })


    this.moon = moon;
}(jQuery);
