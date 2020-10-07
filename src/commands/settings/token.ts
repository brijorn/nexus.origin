import { OriginMessage } from "../../lib/extensions/OriginMessage";
import OriginClient from "../../lib/OriginClient";
import Command from "../../lib/structures/Command";

import Discord, { Message } from "discord.js";
import rbx, { LoggedInUserData } from "noblox.js";
import { GuildSettings } from "../../typings/origin";

export default class extends Command {
	constructor(bot: OriginClient) {
		super(bot, {
			name: "token",
			description: "View or set the .ROBLOSECURITY for your guild.",
			syntax: ['!token', '!token status'],
			cooldown: 300
		});
	}
	async run(
		message: OriginMessage,
		args: string[],
		guild: GuildSettings
	): Promise<Message> {
		if (message.author.id !== message.guild?.owner?.id)
			return message.error("This command is owner only.");
		if (args[0].toLowerCase() === "status") {
			// Decrypt the token
			const token = await this.bot.handlers.database.decryptToken(message.guild?.id);

			// Error If there isn't a token
			if (token === undefined) {
				return message.error(`There is no \`.ROBLOSECURITY\` setup for this guild. 
				You can set one with the \`${guild.prefix}token set\``);
			}
			// Set the token
			let setToken: LoggedInUserData;
			try {
				setToken = await rbx.setCookie(token);
			} catch {
				return message.error(
					`Token may be invalid, reset with the \`${guild.prefix}token\` command`,
					".ROBLOSECURITY Invalid"
				);
			}

			// Make an embed about the account info
			const status = new Discord.MessageEmbed()
				.setTitle(`${setToken.UserName}`)
				.addField("ID", setToken.UserID, true)
				.addField("Premium", setToken.IsPremium, true)
				.setThumbnail(setToken.ThumbnailUrl)
				.setFooter(
					guild.embed.footer,
					guild.embed.footerlogo !== "none" ? guild.embed.footerlogo : ""
				);
			return message.channel.send(status);
		}

		// Ask for the Token In dms
		const token = await message.dmprompt("", {
			title: ".ROBLOSECURITY Prompt",
			description: `What is the .ROBLOSECURITY for the account?`,
			footer: {
				text: 'We will never look at nor share this. Feel free to delete your message after.'
			}
		});
		if (!token || token.toLowerCase() === 'cancel') return message.dm('Cancelled.')

		if (token.toLowerCase().startsWith("_|WARNING:") === false)
			return message.error(
					"Token Authentication Failed: Please provide a valid `.ROBLOSECURITY` Cookie.",
				);
		await this.bot.handlers.database.encryptToken(message.guild?.id, token)
		return message.success("Token Successfully updated. Delete the mesage for safety purposes.");
	}
}