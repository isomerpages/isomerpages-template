initSecondLevelNavInteraction();

function initSecondLevelNavInteraction() {
	var secondLevelNavHeaderArray = document.querySelectorAll("li.third-level-nav-header");
	for (var index = 0; index < secondLevelNavHeaderArray.length; index++) {
		function secondLevelNavClosure() {
			var closureIndex = index;
			function toggleSecondLevelNavDiv() {
				// Get the icon of the third-level-nav-header
				const secondLevelDiv = document.getElementsByClassName("third-level-nav-div")[closureIndex];

				function show(idx) {
					const secondLevelNavIcon = secondLevelNavHeaderArray[idx].getElementsByTagName("I")[0];
					const secondLevelDiv = document.getElementsByClassName("third-level-nav-div")[idx];
					secondLevelNavIcon.classList.remove("sgds-icon-chevron-down");
					secondLevelNavIcon.classList.add("sgds-icon-chevron-up");
					secondLevelDiv.classList.remove("is-hidden");
				}
				function hide(idx) {
					const secondLevelNavIcon = secondLevelNavHeaderArray[idx].getElementsByTagName("I")[0];
					const secondLevelDiv = document.getElementsByClassName("third-level-nav-div")[idx];
					secondLevelDiv.classList.add("is-hidden");
					secondLevelNavIcon.classList.remove("sgds-icon-chevron-up");
					secondLevelNavIcon.classList.add("sgds-icon-chevron-down");
				}

				if (secondLevelDiv.classList.contains("is-hidden")) {
					show(closureIndex);
					for (var index2 = 0; index2 < secondLevelNavHeaderArray.length; index2++) {
						if (index2 == closureIndex) continue;
						hide(index2);
					}
				} else {
					hide(closureIndex);
				}
			}
			return toggleSecondLevelNavDiv;
		}
		secondLevelNavHeaderArray[index].addEventListener("click", secondLevelNavClosure());
	}

	var secondLevelNavHeaderMobileArray = document.querySelectorAll("a.third-level-nav-header-mobile");

	for (var index = 0; index < secondLevelNavHeaderMobileArray.length; index++) {
		function secondLevelNavMobileClosure() {
			var closureIndex = index;
			function toggleSecondLevelNavMobileDiv() {
				const secondLevelMobileDiv = document.getElementsByClassName("third-level-nav-div-mobile")[closureIndex];

				function show(idx) {
					const secondLevelNavMobileIcon = secondLevelNavHeaderMobileArray[idx].getElementsByTagName("I")[0];
					const secondLevelMobileDiv = document.getElementsByClassName("third-level-nav-div-mobile")[idx];
					secondLevelNavMobileIcon.classList.remove("sgds-icon-chevron-down");
					secondLevelNavMobileIcon.classList.add("sgds-icon-chevron-up");
					secondLevelMobileDiv.classList.remove("is-hidden");
				}
				function hide(idx){
					const secondLevelNavMobileIcon = secondLevelNavHeaderMobileArray[idx].getElementsByTagName("I")[0];
					const secondLevelMobileDiv = document.getElementsByClassName("third-level-nav-div-mobile")[idx];
					secondLevelMobileDiv.classList.add("is-hidden");
					secondLevelNavMobileIcon.classList.remove("sgds-icon-chevron-up");
					secondLevelNavMobileIcon.classList.add("sgds-icon-chevron-down");
				}

				if (secondLevelMobileDiv.classList.contains("is-hidden")) {
					show(closureIndex);

					for (var index2 = 0; index2 < secondLevelNavHeaderMobileArray.length; index2++) {
						// Hide all other dropdowns except selected one
						if (index2 == closureIndex) continue;
						hide(index2);
					}
				} else {
					hide(closureIndex);
				}
			}
			return toggleSecondLevelNavMobileDiv;
		}
		secondLevelNavHeaderMobileArray[index].addEventListener("click", secondLevelNavMobileClosure());
	}
}