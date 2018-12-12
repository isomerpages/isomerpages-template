$(document).ready(function(){
    $('.sidenav').stickySidebar({
        topSpacing: 40,
        bottomSpacing: 40,
        containerSelector: '.has-side-nav',
        innerWrapperSelector: '.sidebar__inner',
        resizeSensor: true
    });

    $('.float-buttons').stickySidebar({
        topSpacing: 40,
        bottomSpacing: 40,
        containerSelector: '.has-float-btns',
        innerWrapperSelector: '.action__inner'
    });
});
