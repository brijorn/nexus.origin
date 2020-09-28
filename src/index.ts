/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
import {
	Guild,
	GuildMember,
	Message,
	MessageReaction,
	PartialGuildMember,
	PartialUser,
	User,
} from "discord.js";

import OriginClient from './lib/OriginClient';
const env = require("dotenv").config();
// New Bot
const bot = new OriginClient()
bot.commands.init()

// Command Cooldowns

bot.on("guildCreate", (guild: Guild) => {
	const guildCreate = require("./models/guildModel/guildCreate");
	guildCreate(bot, guild);
});

bot.on("ready", async () => {
	console.log("I am Ready");
});

bot.on("guildMemberAdd", async (member: GuildMember | PartialGuildMember) => {
	const welcome = await bot.handlers.database.getOne('modules', 'welcome', {
		'guild_id': member.guild.id
	})
	if (welcome && welcome.enabled === true) {
		const welcomemsg = require("./functions/settingsFunctions/Welcome/welcomesend");
		await welcomemsg(member, welcome);
	}

	const verification = await bot.handlers.database.getOne('modules', 'verification', {
		'guild_id': member.guild.id
	})

	if (verification.autoVerify === true) {
		console.log(true);
		const autoVerify = require("./functions/verifyFunctions/joinVerify");
		return autoVerify(member, verification);
	}
	if (verification.unverifiedEnabled === true) {
		member.roles
			.add(verification.unverifiedRole)
			.catch(() => {
				if (member.guild.owner) member.guild.owner.send(
					"There seems to be a problem with the **Unverified** role."
				)
				});
	}
});
