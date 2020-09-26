import { Client, Message } from "discord.js";

// Require
import embed from "../functions/embed";
import OriginClient from "../lib/OriginClient";
import OriginMessage from "../lib/extensions/OriginMessage";

// Economy

export default async (
	bot: OriginClient,
	message: OriginMessage
): Promise<void | Message> => {
	const start = Date.now();
	// Early Returns
	if (!message.guild) return;
	if (message.channel.type === "dm") return;
	if (message.author.bot) return;
	const guild = await bot.handlers.database.getOne("public", "guild", {
		guild_id: message.guild.id,
	});

	// Testing Prefix
	const prefix = "-";
	if (
		message.client.user &&
		message.client.user.id &&
		message.content.includes(message.client.user.id)
	)
		return message.channel.send(
			embed("none", `My prefix here is \`${prefix}\`.`, guild)
		);
	if (!message.content.startsWith(prefix)) return;

	// Message content array
	const messageArray = message.content.split(" ");
	// Remove command and lowerCase

	const cmd = messageArray[0].slice(prefix.length).toLowerCase();

	// Get the command file
	const cmdFile = bot.commands.fetch(cmd);

	if (!cmdFile) return;

	// Check if the command uses the command as an argument
	const args = messageArray.slice(1);
	if (cmdFile.includeCommand !== undefined && cmdFile.includeCommand === true)
		args.unshift(cmd);

	await cmdFile.run(message, args, guild);

	// Time
	const end = Date.now();
	const finish = new Date(end - start);
	return console.log(
		finish.getSeconds() +
			" Seconds " +
			finish.getMilliseconds() +
			" Milliseconds"
	);
};
