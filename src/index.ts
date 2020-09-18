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

// Import Discord Creat Client
const bot: Client = new Client({ partials: ["REACTION", "MESSAGE"] });
// File System
import fs from "fs";

import db from "./db";

const env = require("dotenv").config();
// Command Cooldowns
(bot as any).suggestionCooldown = new Collection();

// Collection of all the commands
(bot as any).cmds = new Collection();
(bot as any).disabledMod = new Collection();

bot.on("guildCreate", (guild: Guild) => {
	const guildCreate = require("./models/guildModel/guildCreate");
	guildCreate(bot, guild);
});
const folders = [
	"verification",
	"utility",
	"settings",
	"user",
	"ranking",
	"group",
	"moderation",
	"fun",
	"economy",
	"suggestion",
	"ticketing",
];

folders.forEach((c) => {
	fs.readdir(`./src/cmds/${c}`, (err: any, files: any) => {
		if (err) throw err;
		const arr = [];
		for (let i = 0; i < 100; i++) arr.push(i);
		const tsfile = files.filter((f: any) => f.split(".").pop() === "ts");
		tsfile.forEach((f: any, i: any) => {
			const prop = require(`./cmds/${c}/${f}`);
			(bot as any).cmds.set(prop.help.name, prop);
		});
	});
});

import handlers from "./handlers";

bot.on("ready", async () => {
	console.log("I am Ready");
});

bot.on("guildMemberAdd", async (member: GuildMember | PartialGuildMember) => {
	const welcome = await db
		.withSchema("modules")
		.table("welcome")
		.where("guild_id", "=", member.guild.id)
		.first();
	if (welcome && welcome.enabled === true) {
		const welcomemsg = require("./functions/settingsFunctions/Welcome/welcomesend");
		await welcomemsg(member, welcome);
	}
	const verification = await db
		.withSchema("modules")
		.table("verification")
		.where("guild_id", "=", member.guild.id)
		.first();
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
		return await handlers.reaction(bot, reaction, user);
	}
);

bot.on("message", async (message: Message) => {
	handlers.message(bot, message);
});

bot.login(process.env.TOKEN);