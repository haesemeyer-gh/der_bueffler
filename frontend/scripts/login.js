const APIURL = 'http://localhost:3000';

const loginEl = document.getElementById('login');
const elementsThatRequireLogin = document.getElementsByClassName('requirelogin');

let token;
function getCookie(cname) {
	let name = cname + "=";
	let decodedCookie = decodeURIComponent(document.cookie);
	let ca = decodedCookie.split(';');
	for(let i = 0; i <ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}
let cookieToken = getCookie(`token`);
if (cookieToken) {
	token = cookieToken;
	logIn();
}

const registerButton = document.getElementById('register-button');
const loginButton = document.getElementById('login-button');
const resetButton = document.getElementById('reset');
const emailEl = document.getElementById('login-mail');
const passEl = document.getElementById('login-pass');
const unameEl = document.getElementById('register-uname');
const statusEl = document.getElementById('login-status')

registerButton.addEventListener('click', () => {
	fetch(APIURL+"/auth/register", {
		method: "POST",
		body: JSON.stringify({
			uname: unameEl.value,
			email: emailEl.value,
			password: passEl.value
		}),
		headers: {
			"Content-type": "application/json; charset=UTF-8"
		}
	}).then((response) => response.json()).then((response) => {
		statusEl.innerText = response.message;
	});
});

loginButton.addEventListener('click', () => {
	fetch(APIURL+"/auth/login", {
		method: "POST",
		body: JSON.stringify({
			email: emailEl.value,
			password: passEl.value
		}),
		headers: {
			"Content-type": "application/json; charset=UTF-8"
		}
	}).then(async (response) => {
		let json = await response.json();
		if (response.status === 200) {
			token = json.message;
			document.cookie = `token=${token}`;
			logIn();
		} else {
			statusEl.innerText = json.message;
		}
	});
});

resetButton.addEventListener('click', () => {
	fetch(APIURL+"/auth/requestreset", {
		method: "POST",
		body: JSON.stringify({
			email: emailEl.value
		}),
		headers: {
			"Content-type": "application/json; charset=UTF-8"
		}
	}).then(async (response) => {
		let json = await response.json();
		statusEl.innerText = json.message;
	});
});

function logIn() {
	loginEl.classList.toggle("hidden");
	for (let i = 0; i < elementsThatRequireLogin.length; i++) {
		elementsThatRequireLogin[i].classList.toggle("hidden");
	}
}

const passwordVisibilityButton = document.getElementById('password-visibility-button');
const passwordVisibilityIndicator = document.getElementById('password-visibility-indicator');
passwordVisibilityButton.addEventListener('click', () => {
	if (passwordVisibilityIndicator.alt === "Passwort anzeigen") {
		passwordVisibilityIndicator.alt = "Passwort verstecken";
		passwordVisibilityIndicator.src = '/assets/icons/eye-hidden.svg';
		passEl.type = 'text';
	} else {
		passwordVisibilityIndicator.alt = "Passwort anzeigen";
		passwordVisibilityIndicator.src = '/assets/icons/eye.svg';
		passEl.type = 'password';
	}
})

