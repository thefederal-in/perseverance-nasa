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
    $("body").addClass("mission-landing-pg")
    $(".bgtext").addClass("rotatetxt")
})
$(".atlasbtn").on("click", function(){
    $(this).css("display", "none")
    $(".atlasclose").css("display", "none")
    $(".atlasopen").css("display", "block")
})

// $("#contact_form").fadeIn("slow");