document.getElementById("senior-leadership-button").addEventListener("click", displaySeniorLeadership);

function displaySeniorLeadership() {
	document.getElementById("board-of-directors").style.display = "none";
	document.getElementById("senior-leadership").style.display = "flex";
	document.getElementById("organisational-structure").style.display = "none";
	document.getElementById("board-of-directors-button").classList.remove("selected");
	document.getElementById("senior-leadership-button").classList.add("selected");
	document.getElementById("organisational-structure-button").classList.remove("selected");
}

document.getElementById("board-of-directors-button").addEventListener("click", displayBoard);

function displayBoard() {
	document.getElementById("board-of-directors").style.display = "flex";
	document.getElementById("senior-leadership").style.display = "none";
	document.getElementById("organisational-structure").style.display = "none";
	document.getElementById("board-of-directors-button").classList.add("selected");
	document.getElementById("senior-leadership-button").classList.remove("selected");
	document.getElementById("organisational-structure-button").classList.remove("selected");
}

document.getElementById("organisational-structure-button").addEventListener("click", displayOrganisation);

function displayOrganisation() {
	document.getElementById("board-of-directors").style.display = "none";
	document.getElementById("senior-leadership").style.display = "none";
	document.getElementById("organisational-structure").style.display = "block";
	document.getElementById("board-of-directors-button").classList.remove("selected");
	document.getElementById("senior-leadership-button").classList.remove("selected");
	document.getElementById("organisational-structure-button").classList.add("selected");
}
