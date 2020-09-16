const fetch = require('node-fetch');
module.exports = function(userId, assetId) {
	const res = fetch(`http://api.roblox.com/Ownership/HasAsset?userId=${userId}&assetId=${assetId}`)
		.then(response => response.json());

	return res;
};