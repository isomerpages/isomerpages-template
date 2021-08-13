function showBannerContent() {
    document.getElementById("banner-content").classList.toggle("is-hidden")
    document.getElementById("masthead-chevron").classList.toggle("sgds-icon-chevron-down")
    document.getElementById("masthead-chevron").classList.toggle("sgds-icon-chevron-up")

    if (document.body.clientWidth < 1023) document.getElementById("masthead-divider").classList.toggle("is-hidden")
}

document.getElementById("masthead-dropdown-button").addEventListener("click", () => {
    if (document.body.clientWidth >= 1024) showBannerContent()
})
document.getElementById("bp-masthead").addEventListener("click", () => {
    if (document.body.clientWidth < 1023) showBannerContent()
})
