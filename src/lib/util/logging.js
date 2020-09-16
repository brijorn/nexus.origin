async function expire(type) {

}

async function customChannel(type, guild) {
	let channel = guild.logging.settings.find(a => a.name === type);
	channel = type.channel;
	if (val.match(/\d+/) === null) return channel;
	channel = channel.match(/\d+/)[0];
	return channel;
}

async function checkEnabled(type, value, guild) {
	let enabled = false;
	if (!guild.logging) return;
	if (!guild.logging.settings.find(a => a.name === type)) return enabled;
	const log = guild.moderation.logging.settings.find(a => a.name === type);
	if (log.enabled.find(a => a.includes(value))) enabled = await customChannel(type, guild);
	return enabled;
}

module.exports = { checkEnabled };