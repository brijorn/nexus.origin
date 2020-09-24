import {
	Guild,
	GuildMember,
	Message,
	MessageReaction,
	Collection,
	Client,
	PartialGuildMember,
	PartialUser,
	User,
} from "discord.js";

import OriginClient from './lib/OriginClient';
import ReactionHandler from './handlers/ReactionHandler';
import MessageHandler from './handlers/MessageHandler';
// Import Discord Creat Client
const bot = new OriginClient()

const env = require("dotenv").config();
// Command Cooldowns

bot.on("guildCreate", (guild: Guild) => {
	const guildCreate = require("./models/guildModel/guildCreate");
	guildCreate(bot, guild);
});

bot.on("ready", async () => {
	console.log("I am Ready");
	console.log(await bot.commands.init())
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
			.catch(() =>
				member.guild.owner!.send(
					"There seems to be a problem with the **Unverified** role."
				)
			);
	}
});

bot.on(
	"messageReactionAdd",
	async (reaction: MessageReaction, user: User | PartialUser) => {
		if (reaction.partial) reaction = await reaction.fetch();
		if (user.partial) user = await user.fetch();
		return ReactionHandler(bot, reaction, user)
	}
);

bot.on("message", async (message: Message) => {
	return MessageHandler(bot, message)
});

bot.login(process.env.TOKEN!);