const rbx = require('noblox.js');
const regprompt = require('../../prompt/prompt.js');
const dmprompt = require('../../prompt/vdmprompt');

module.exports = async (message, userId, sendtype, guild) => {
	const prompt = (guild.verificationSettings.dmVerifications === true) ? dmprompt : regprompt;
	const status = false;
	const keywords = ['cow', 'moo', 'nexus', 'origin', 'bear', 'goose', 'jack', 'supreme'];
	let keywordjoin = '';
	keywords.forEach(v => {
		keywordjoin += keywords[Math.floor(Math.random() * keywords.length)] + ' ';
	});
	keywordjoin = keywordjoin.slice(0, -1);
	const daembed = new Discord.MessageEmbed()
		.setTitle('Verification')
		.setDescription(`Please put this code in your bio or status.\n\`\`\`${keywordjoin}\`\`\``)
		.setImage('https://cdn.discordapp.com/attachments/730101792716882041/730228540301246486/info.png')
		.setFooter('Say done when completed', logo)
		.setColor('#f79a36');
	const mobile = await sendtype.send(`Mobile Users: \`${keywordjoin}\` `);
	const done = await prompt(message, daembed);
	if (done.content.toLowerCase() === 'cancel') {
		done.message.delete({ timeout: 1 });
		mobile.delete({ timeout: 1 });
		return message.channel.send('Cancelled.');
	}
	if (done.content.toLowerCase() === 'done') {
		const blurb = await rbx.getBlurb(id);
		const status = await rbx.getStatus(id);
		const blurbcheck = blurb.includes(keywordjoin);
		const statuscheck = status.includes(keywordjoin);
		if (blurbcheck === true || statuscheck === true) {
			return status = true;
		}
	}
	else {
		const errorembed = new Discord.MessageEmbed()
			.setTitle('Error')
			.setDescription('Verification failed. Please try again with the `!verify` command.')
			.setColor(failure);
		sendtype.send(errorembed);
	}
	return status;
};