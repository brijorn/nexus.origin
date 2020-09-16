const fetch = require('node-fetch');
module.exports = async (universeId) => {
	const universe = await fetch(`https://games.roblox.com/v1/games?universeIds=${universeId}`).then(response => response.json())
		.then(data => {
			const finished = data.data[0];
			return finished;
		});
	return universe;
};