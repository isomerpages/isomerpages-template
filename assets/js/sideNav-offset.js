$(document).ready(function(){
    $('.sidenav').stickySidebar({
        topSpacing: 40,
        bottomSpacing: 40,
        containerSelector: '.has-side-nav',
        innerWrapperSelector: '.sidebar__inner'
    });

    $('.float-buttons').stickySidebar({
        topSpacing: 40,
        bottomSpacing: 40,
        containerSelector: '.has-float-btns',
        innerWrapperSelector: '.action__inner'
    });
});
