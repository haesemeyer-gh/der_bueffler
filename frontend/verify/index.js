const urlParams = new URLSearchParams(window.location.search);
const searchID = urlParams.get('s');

if (searchID) {
	document.getElementById('reset-div').classList.remove('hidden');
}

const resetStatus = document.getElementById('reset-status');
fetch(APIURL+"/auth/verify", {
	method: "POST",
	body: JSON.stringify({
		mailtoken: searchID
	}),
	headers: {
		"Content-type": "application/json; charset=UTF-8"
	}
}).then((response) => response.json()).then((response) => {
	resetStatus.innerText = response.message;
});

