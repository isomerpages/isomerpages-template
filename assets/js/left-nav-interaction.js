initSecondLevelNavInteraction();

function initSecondLevelNavInteraction() {
	var secondLevelNavHeaderArray = document.querySelectorAll("li.second-level-nav-header");
	for (var index = 0; index < secondLevelNavHeaderArray.length; index++) {
		
		function secondLevelNavClosure() {
			var closureIndex = index;
			function toggleSecondLevelNavDiv() {
				// Get the icon of the second-level-nav-header
				var secondLevelNavIcon = secondLevelNavHeaderArray[closureIndex].getElementsByTagName("I")[0];
				var secondLevelDiv = document.getElementsByClassName("second-level-nav-div")[closureIndex];
				if (secondLevelDiv.classList.contains("is-hidden")) {
					secondLevelNavIcon.classList.remove("sgds-icon-chevron-down");
					secondLevelNavIcon.classList.add("sgds-icon-chevron-up");
					secondLevelDiv.classList.remove("is-hidden");
				} else {
					secondLevelDiv.classList.add("is-hidden");
					secondLevelNavIcon.classList.remove("sgds-icon-chevron-up");
					secondLevelNavIcon.classList.add("sgds-icon-chevron-down");
				}
			}
			return toggleSecondLevelNavDiv;
		}

		secondLevelNavHeaderArray[index].addEventListener("click", secondLevelNavClosure());
	}
}