$(document).ready(function() {
    initializeMobileNav();
    initializeAccordions();
    // Wrap all tables in a <div> with the horizontal-scroll class so that the
    // table will not be cut off on mobile
    $("table").wrap('<div class="horizontal-scroll"></div>');
});

function initializeMobileNav() {
    // Custom dropdown code for mobile browsers
    const dropdowns = document.querySelectorAll(".mobile-nav-dropdown");
    if (dropdowns.length > 0) {
        dropdowns.forEach(dropdown => {
            const [dropdownMenu] = dropdown.getElementsByClassName(
                "sgds-dropdown-menu"
            );
            const [dropdownTrigger] = dropdown.getElementsByClassName(
                "sgds-dropdown-button"
            );
            if (dropdownMenu && dropdownTrigger) {
                dropdownTrigger.onclick = () => {
                    let dropdownIcon = dropdownTrigger.querySelector(
                        ".sgds-icon"
                    );
                    if (
                        dropdownMenu.style.display === "" ||
                        dropdownMenu.style.display === "none"
                    ) {
                        dropdownMenu.style.display = "block";

                        dropdownIcon.classList.remove("sgds-icon-chevron-down");
                        dropdownIcon.classList.add("sgds-icon-chevron-up");
                    } else {
                        dropdownMenu.style.display = "";

                        dropdownIcon.classList.remove("sgds-icon-chevron-up");
                        dropdownIcon.classList.add("sgds-icon-chevron-down");
                    }
                };
                document.addEventListener("click", evt => {
                    let targetElement = evt.target; // clicked element
                    if (dropdown.contains(targetElement)) {
                        return;
                    }
                    dropdownMenu.style.display = "";
                });
            }
        });
    }
}
function initializeAccordions() {
    const accordionArray = document.getElementsByClassName("accordion");
    for (const accordion of accordionArray) {
        const toggleAccordionBody = () => {
            const [accordionHeader] = accordion.getElementsByClassName(
                "sgds-accordion-header"
            );
            const [accordionBody] = accordion.getElementsByClassName(
                "sgds-accordion-body"
            );
            const [accordionButton] = accordion.getElementsByClassName(
                "sgds-accordion-button"
            );

            if (
                accordionBody.style.display === "" ||
                accordionBody.style.display === "none"
            ) {
                accordionHeader.classList.add("is-active");
                accordionBody.style.display = "block";
                accordionButton.classList.remove("sgds-icon-plus");
                accordionButton.classList.add("sgds-icon-minus");
            } else {
                accordionHeader.classList.remove("is-active");
                accordionBody.style.display = "none";
                accordionButton.classList.remove("sgds-icon-minus");
                accordionButton.classList.add("sgds-icon-plus");
            }
        };

        accordion
            .getElementsByClassName("sgds-accordion-header")[0]
            .addEventListener("click", toggleAccordionBody);
    }
}
