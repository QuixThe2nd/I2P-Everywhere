function checkForI2PMeta() {
	const meta = document.querySelector('meta[http-equiv="I2P-Location"]');
	if (meta && meta.content) {
		return meta.content;
	}
	return null;
}

const i2pLocation = checkForI2PMeta();
if (i2pLocation) {
	// Send a message to the background script with the i2p location.
	browser.runtime.sendMessage({type: 'I2P_LOCATION_FOUND', i2pLocation});
}
