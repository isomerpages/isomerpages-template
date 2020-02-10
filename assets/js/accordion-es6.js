const accordionArray = document.getElementsByClassName("accordion");

for (const accordion of accordionArray) {
	const toggleAccordionBody = () => {
		const [accordionBody] = accordion.getElementsByClassName("bp-accordion-body");
		const [accordionButton] = accordion.getElementsByClassName("bp-accordion-button");

		if (accordionBody.style.display === "" || accordionBody.style.display === "none") {
			accordionBody.style.display = "block";
			accordionButton.classList.remove("sgds-icon-plus");
			accordionButton.classList.add("sgds-icon-minus");
		} else {
			accordionBody.style.display = "none";
			accordionButton.classList.remove("sgds-icon-minus");
			accordionButton.classList.add("sgds-icon-plus");
		}
	}

	accordion.getElementsByClassName("bp-accordion-header")[0].addEventListener("click", toggleAccordionBody);
}
