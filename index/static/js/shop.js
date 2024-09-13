$(function(){
    $(".link_btn").click(function() {
        $(this).closest(".link_container").find(".link_text").slideToggle();     
    });
});