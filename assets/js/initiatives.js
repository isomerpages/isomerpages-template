document.getElementById("citizens-button").addEventListener("click", displayCitizens);

function displayCitizens() {
	document.getElementById("citizens").style.display = "block";
	document.getElementById("business").style.display = "none";
	document.getElementById("government").style.display = "none";

	document.getElementById("citizens-button").classList.add("selected");
	document.getElementById("business-button").classList.remove("selected");
	document.getElementById("government-button").classList.remove("selected");
}

document.getElementById("business-button").addEventListener("click", displayBusiness);

function displayBusiness() {
	document.getElementById("citizens").style.display = "none";
	document.getElementById("business").style.display = "block";
	document.getElementById("government").style.display = "none";

	document.getElementById("citizens-button").classList.remove("selected");
	document.getElementById("business-button").classList.add("selected");
	document.getElementById("government-button").classList.remove("selected");
}

document.getElementById("government-button").addEventListener("click", displayGovernment);

function displayGovernment() {
	document.getElementById("citizens").style.display = "none";
	document.getElementById("business").style.display = "none";
	document.getElementById("government").style.display = "block";

	document.getElementById("citizens-button").classList.remove("selected");
	document.getElementById("business-button").classList.remove("selected");
	document.getElementById("government-button").classList.add("selected");
}