const mongoose = require('mongoose');
const Guild = require('./guild');


module.exports = async (guild) => {
	await Guild.findOneAndDelete({
		guildID: guild.id,
	}, (err, res) => {
		if(err) console.error(err);
	});
};