document.getElementById('copy-link').addEventListener("click", copyUrl);

function copyUrl(){
	var inputBox = document.getElementById('page-url');
	if (inputBox.classList.contains("hide")){
		inputBox.classList.remove("hide");
	}
	inputBox.select();
	document.execCommand('copy');
	inputBox.classList.add("hide");
}