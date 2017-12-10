---
---

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
        console.log("down")
        $("#fab").addClass("scale-out")
    }
    function fireUp(){
        console.log("up")
        $("#fab").removeClass("scale-out")
    }
});
$(function(){
    $("#fab").click(moon.scrollToTop);
})
$(moon.toc.render)
