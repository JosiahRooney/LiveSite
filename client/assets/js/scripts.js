function loader () {
	console.log('Load the gif');
	var healthContainer = document.querySelector(".site-health");
	healthContainer.innerHtml = "<img class='loader-gif' src='https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif'>";
}