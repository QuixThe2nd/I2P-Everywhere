'use strict';

var browser = typeof browser !== 'undefined' ? browser : chrome;

function validate_i2p_host(hostname) {
	if (!hostname.endsWith('i2p'))
		// I2P addresses dont follow a format due to their DNS address book system, so this is the only real validation I can think of
		throw new URIError('not an i2p host:' + hostname);
}

function i2p_redirect(details) {
	var i2p_location_header = details.responseHeaders.find(function (header) {
		return header['name'].toLowerCase() == 'i2p-location';
	});
	if (i2p_location_header === void 0) return;

	// TODO: this may throw an error on an invalid URL... should that be caught?
	var i2p_location = new URL(i2p_location_header.value);

	// The i2p-Location value must be a valid URL with http: or https: protocol and a .i2p hostname.
	if (i2p_location.protocol !== 'http:' && i2p_location.protocol !== 'https:') {
		console.log('Invalid i2p-Location uri: unexpected scheme:', i2p_location.protocol);
		return;
	}

	try {
		validate_i2p_host(i2p_location.hostname);
	} catch (e) {
		console.log('Invalid i2p-Location uri:' + e.message);
		return;
	}

	// The webpage defining the i2p-Location header must be served over HTTPS.
	var old_location = new URL(details.url);
	if (old_location.protocol !== 'https:') {
		console.log('Ignoring i2p-Location: not served over HTTPS');
		return;
	}

	// The webpage defining the i2p-Location header must not be an i2p site.
	if (old_location.hostname.endsWith('i2p')) {
		console.log('Ignoring i2p-Location uri: already an i2p host:', old_location.hostname);
		return;
	}

	console.log('Redirecting to i2p-Location: ', i2p_location.href);
	return {
		redirectUrl: i2p_location.href
	};
}

browser.webRequest.onHeadersReceived.addListener(i2p_redirect, {urls: ['<all_urls>']}, ['blocking', 'responseHeaders']);

browser.runtime.onMessage.addListener(function (message, sender, sendResponse) {
	if (message.type === 'I2P_LOCATION_FOUND') {
		const details = {
			url: sender.tab.url,
			responseHeaders: [{name: 'i2p-Location', value: message.i2pLocation}]
		};
		const redirect = i2p_redirect(details);
		if (redirect) {
			browser.tabs.update(sender.tab.id, {url: redirect.redirectUrl});
		}
	}
});
