const urlParams = new URLSearchParams(window.location.search);
const tokenSearch = urlParams.get('t');
const deletionID = urlParams.get('d');

if (tokenID && deletionID) {
	document.getElementById('reset-div').classList.remove('hidden');
}

const resetStatus = document.getElementById('reset-status');
fetch(APIURL+"/auth/delete", {
	method: "POST",
	body: JSON.stringify({
		token: tokenSearch,
		id: deletionID,
	}),
	headers: {
		"Content-type": "application/json; charset=UTF-8"
	}
}).then((response) => response.json()).then((response) => {
	resetStatus.innerText = response.message;
});

