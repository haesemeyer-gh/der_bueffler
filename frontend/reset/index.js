const urlParams = new URLSearchParams(window.location.search);
const searchID = urlParams.get('s');

if (searchID) {
	document.getElementById('reset-div').classList.remove('hidden');
}

const resetPassword = document.getElementById('reset-password');
const resetButton = document.getElementById('reset-button');
const resetStatus = document.getElementById('reset-status');
resetButton.addEventListener('click', () => {
	fetch(APIURL+"/auth/reset", {
		method: "POST",
		body: JSON.stringify({
			token: searchID,
			password: resetPassword.value
		}),
		headers: {
			"Content-type": "application/json; charset=UTF-8"
		}
	}).then((response) => response.json()).then((response) => {
		resetStatus.innerText = response.message;
	});
});

