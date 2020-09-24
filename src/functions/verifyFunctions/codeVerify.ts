const rbx = require('noblox.js');
import prompts from '../../lib/util/prompt'
import { Message, MessageEmbed } from "discord.js";
import { VerificationSettings, GuildSettings } from '../../typings/origin'
import embed from '../embed';
import OriginClient from '../../lib/OriginClient';

export default async (bot: OriginClient, message: Message, guild: GuildSettings, verification: VerificationSettings, userId: any, sendtype: any) => {
	const prompt = (verification.DmVerification === true) ? prompts.dmprompt : prompts.prompt;
	let status = false;
	const keywords = ['cow', 'moo', 'nexus', 'origin', 'bear', 'goose', 'jack', 'supreme'];
	let keywordjoin = '';
	keywords.forEach(v => {
		keywordjoin += keywords[Math.floor(Math.random() * keywords.length)] + ' ';
	});
	keywordjoin = keywordjoin.slice(0, -1);
	const daembed = new MessageEmbed()
		.setTitle('Verification')
		.setDescription(`Please put this code in your bio or status.\n\`\`\`${keywordjoin}\`\`\``)
		.setImage('https://cdn.discordapp.com/attachments/730101792716882041/730228540301246486/info.png')
		.setFooter('Say done when completed')
		.setColor('#f79a36');
	const mobile = await sendtype.send(`Mobile Users: \`${keywordjoin}\` `);
	const done = await prompt(message, daembed) as any;
	if (done.content.toLowerCase() === 'cancel') {
		done.message.delete({ timeout: 1 });
		mobile.delete({ timeout: 1 });
		return message.channel.send('Cancelled.');
	}
	if (done.content.toLowerCase() === 'done') {
		const getblurb = await rbx.getBlurb(userId);
		const getstatus = await rbx.getStatus(userId);
		const blurbcheck = getblurb.includes(keywordjoin);
		const statuscheck = getstatus.includes(keywordjoin);
		if (blurbcheck === true || statuscheck === true) {
			return status = true;
		}
	}
	else {
		const errorembed = embed(
			'Error',
			'Verification failed. Please try again with the `!verify` command.',
			guild, 'failure', false, true
		)
		sendtype.send(errorembed);
	}
	return status;
};