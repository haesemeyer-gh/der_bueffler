const subscribeBtn = document.getElementById("subscribe-to-push");

subscribeBtn.addEventListener("click", () => {
	registerServiceWorker();
})

async function registerServiceWorker() {
	const publicVapidKey = "BHm1GIUIGMm3R47i5qRCPCo6oU4Z7dlc_g2JkXptkvcZOFLlobRAgJWpAmzKOrbiKBtBR69J4iB9-ISA_X8suNc";

	if (cookieToken) {
		const register = await navigator.serviceWorker.register('/worker.js');
		console.log(register.scope)

		const subscription = await register.pushManager.subscribe({
			userVisibleOnly: true,
			applicationServerKey: publicVapidKey,
		});

		const subscriptionObject = JSON.parse(JSON.stringify(subscription));

		await fetch(APIURL+"/push/subscribe", {
			method: "POST",
			body: JSON.stringify({
				"token": cookieToken,
				"subendpoint": subscriptionObject.endpoint,
				"subauth": subscriptionObject.keys.auth,
				"subp256dh": subscriptionObject.keys.p256dh
			}),
			headers: {
				"Content-Type": "application/json",
			}
		})
	}
}

