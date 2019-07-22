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

// on load, populate the href of the three anchor links with the full URL
// so that the links work even if site.url is not configured

const fullUrl = window.location.href;
const fullUrlEncoded = encodeURIComponent(window.location.href);
const titleEncoded = encodeURIComponent(document.getElementsByTagName("title")[0].innerHTML);

document.getElementById("mail-anchor").setAttribute("href", "mailto:?Subject=" + titleEncoded + "&amp;Body=" + fullUrlEncoded);
document.getElementById("fb-anchor").setAttribute("href", "http://www.facebook.com/sharer.php?u=" + fullUrlEncoded);
document.getElementById("li-anchor").setAttribute("href", "https://www.linkedin.com/sharing/share-offsite/?url=" + fullUrlEncoded + "&title=" + titleEncoded);
document.getElementById("page-url").setAttribute("value", fullUrl);
