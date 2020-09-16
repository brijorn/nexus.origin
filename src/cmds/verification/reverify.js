const VerifyFunction = require('../../functions/verifyFunctions/VerifyFunction');
const embed = require('../../functions/embed');
const { prompt, dmprompt } = require('../../prompt/index');

module.exports.run = async (bot, message, args, guild) => {
	const prompt = (guild.verificationSettings.dmVerifications === true) ? dmprompt : prompt;
	const sendtype = (guild.verificationSettings.dmVerifications === true) ? message.author : message.channel;
	const ques = embed('Reverification', 'What is the **roblox username** of the new account you wish to bind?\n\nRespond **cancel** to cancel.', guild);
	const userName = await prompt(message, ques);
	if (userName.toLowerCase() === 'cancel') {
		userName.message.delete({ timeout: 1000 });
		return sendtype.send('Cancelled.');
	}
	console.log(userName);
	await VerifyFunction(message, bot, userName, guild);
};

module.exports.help = {
	name: 'reverify',
	module: 'verification',
	description: 'Change your linked roblox account',
};