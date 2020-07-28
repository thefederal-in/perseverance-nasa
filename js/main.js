//preloader js
var width = 100,
perfData = window.performance.timing, // The PerformanceTiming interface represents timing-related performance information for the given page.
EstimatedTime = -(perfData.loadEventEnd - perfData.navigationStart),
time = parseInt((EstimatedTime/1000)%60)*100;

// Loadbar Animation
$(".loadbar").animate({
    width: width + "%"
}, time);

// Loadbar Glow Animation
$(".glow").animate({
    width: width + "%"
}, time);

// Percentage Increment Animation
var PercentageID = $("#precent"),
start = 0,
end = 100,
durataion = time;
animateValue(PercentageID, start, end, durataion);
    
function animateValue(id, start, end, duration) {

    var range = end - start,
    current = start,
    increment = end > start? 1 : -1,
    stepTime = Math.abs(Math.floor(duration / range)),
    obj = $(id);

    var timer = setInterval(function() {
        current += increment;
        $(obj).text(current + "%");
    //obj.innerHTML = current;
        if (current == end) {
            clearInterval(timer);
        }
    }, stepTime);
}

// Fading Out Loadbar on Finised
setTimeout(function(){
    $('.preloader-wrap').fadeOut(300);
}, time);

// var swup = new Swup();

$(".mission-overview-btn").on("click", function(){
    $(".mission-home").css("display", "none")
    $(".mission-landing").css("display", "none")
    $(".mission-overview").css("display", "grid")
    $(".mission-objectives").css("display", "none")
    $("body").removeClass()
    $("body").addClass("mission-pg")
    $(".bgtext").addClass("rotatetxt")
})
$(".mission-landing-btn").on("click", function(){
    $(".mission-home").css("display", "none")
    $(".mission-overview").css("display", "none")
    $(".mission-landing").css("display", "grid")
    $(".mission-objectives").css("display", "none")
    $("body").removeClass()
    $("body").addClass("mission-landing-pg").fadeIn(1000)
    $(".bgtext").addClass("rotatetxt")
})
$(".mission-objectives-btn").on("click", function(){
    $(".mission-home").css("display", "none")
    $(".mission-overview").css("display", "none")
    $(".mission-landing").css("display", "none")
    $(".mission-objectives").css("display", "grid")
    $(".bgtext").addClass("rotatetxt")
    $("body").removeClass()
    $("body").addClass("mission-objective-pg")
    $(".bgtext").addClass("rotatetxt")
})
$(".atlasbtn").on("click", function(){
    $(this).css("display", "none")
    $(".atlasclose").css("display", "none")
    $(".atlasopen").css("display", "block")
})
$(".atlasopen").on("click", function(){
    $(this).css("display", "none")
    $(".atlasclose").css("display", "block")
    $(".atlasbtn").css("display", "block")
})
$("#closevideomodel").on("click", function(){
    $(".video-one-model").css("display", "none")
})
$(".videoone").on("click", function(){
    $(".video-one-model").css("display", "block")
})
$("#warning-icon").on("click", function(){
    $(".warning-text-model").css("display", "block")
})
$("#closewarntxtmodel").on("click", function(){
    $(".warning-text-model").css("display", "none")
})

// var warningbtnclicked = 0
// $("#warning-icon").on("click", function(){
    
//     if(warningbtnclicked === 0){
//         $(".warning-text").css("display", "block");
//         $(".warnicon p").css("display", "none");
//         $('.warning-text').addClass('animate__fadeInRight');
//         $('.warning-text').removeClass('animate__fadeOutRight');
//         warningbtnclicked = 1;
//     }else{
//         // $(".warning-text").css("display", "none")
//         $(".warnicon p").css("display", "block");
//         $('.warning-text').removeClass('animate__fadeInRight');
//         $('.warning-text').addClass('animate__fadeOutRight');
//         warningbtnclicked = 0;
//     }
// })

// $("#contact_form").fadeIn("slow");
