import { OriginMessage } from "../../lib/extensions/OriginMessage";
import OriginClient from "../../lib/OriginClient";
import Command from "../../lib/structures/Command";
import VerifyFunction from '../../functions/verifyFunctions/VerifyFunction';
import { GuildSettings } from "../../typings/origin";

export default class extends Command {
	constructor(bot: OriginClient) {
		super(bot, {
			name: 'reverify',
			description: 'Change your linked verification account'
		})
	}
	async run(message: OriginMessage, args: string[], guild: GuildSettings): Promise<void> {
		const verification = await this.bot.handlers.verification.settings.fetch(message.guild?.id as string)
		if (!verification) {
			message.error('Verification is not setup for this guild.')
			return;
		}
		const promptType = (verification.dm_verification == true) ? message.dmprompt : message.prompt
		const sendType = (verification.dm_verification == true) ? message.author : message.channel
		const userName = await promptType('', { title: 'Verification', description: 'What is the roblox username of the account?\n\nSay **cancel** to cancel'});
		if (userName.toLowerCase() === 'cancel') {
			userName.message.delete({ timeout: 1000 });
			sendType.send('Cancelled.');
			return;
		}
		await VerifyFunction(message, this.bot, userName, guild, verification);
	}
}