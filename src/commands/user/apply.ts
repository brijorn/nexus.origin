import embed from "../../functions/embed";
import { Channel, Message, MessageEmbed, TextChannel } from "discord.js";
import { ApplicationSettings, GuildSettings } from "../../typings/origin";
import { prompt } from "../../lib/util/prompt";
import pmprompt from "../../lib/util/prompt/pmprompt";
import OriginClient from "../../lib/OriginClient";

export async function run(
	bot: OriginClient,
	message: Message,
	args: string[],
	guild: GuildSettings
) {
	const application = new ApplicationSettings(
		bot.handlers.database,
		await bot.handlers.database.getOne("modules", "applications", {
			guild_id: message.guild!.id,
		})
	);
	const app = application.applications;
	if (!application || application.enabled === false)
		return message.reply(
			embed(
				"Applications Disabled",
				"Applications are not enabled for this guild",
				guild
			)
		);

	const applicationList = app
		.map((app) => {
			if (app.available === false) return;
			return `${app.name}`;
		})
		.join(", ");

	let start: any;
	if (!args[0]) {
		start = await prompt(
			message,
			embed(
				"Application",
				"What is the name of the application you wish to apply for?",
				guild,
				"default"
			)
		);
		if (!start) return start.delete({ timeout: 5000 });
	}

	const arg = start ? start : args.length > 1 ? args.join(" ") : args[0];

	const findApplication = app.find(
		(one) => one.name.toLowerCase() === arg.toLowerCase()
	);

	if (!findApplication)
		return message.channel.send(
			embed(
				"Application Not Found",
				`${message.author}, could not find an application with that name.`,
				guild,
				"failure"
			)
		);
	if (findApplication.available === false)
		return message.reply(
			embed(
				"Application Unavailable",
				"The given application is currently unavailable.",
				guild,
				"failure"
			)
		);

	message.channel.send("**This will continue in DMS**");

	const responses: string[] = [];

	const startApplicationMessage = embed(
		`${name}`,
		"You are about to apply for " +
			name +
			", are you sure?\n\nRespond `y` or `n`\nSay **cancel** at any time during the application to cancel",
		guild
	);
	const startApplication = await pmprompt(message, startApplicationMessage);

	if (start.content.toLowerCase().includes("y") === false)
		return startApplication.message.delete({ timeout: 5000 });
	const questions = findApplication.questions;
	let cancelled: boolean = false;
	for (let i = 0; i < questions.length && cancelled === false; i++) {
		const question = embed(
			`${name}`,
			questions[i],
			guild,
			"",
			`Question ${i + 1}/${questions.length}`
		);

		const response = await pmprompt(message, question);
		if (response.content.toLowerCase() === "cancel") {
			cancelled = true;
		} else responses.push(response.content);
	}
	if ((cancelled = true)) return;

	let place = 1;
	let i = 0;
	const matcher = questions
		.map((r) => `\`${place++}\` **${r}**\n${responses[i++]}`)
		.join("\n");

	const confirm = embed(
		"Application Submitted",
		`Your Responses\n${matcher}`,
		guild,
		"success",
		"You will receive a response when youa application is accepted/denied."
	);

	message.author.send(confirm);

	const req = new MessageEmbed()
		.setTitle(findApplication.name)
		.setAuthor(
			`${message.author.username}#${message.author.discriminator}`,
			message.author.avatarURL()!
		)
		.setDescription(matcher)
		.setColor("#ffad3b")
		.setFooter("Application")
		.setTimestamp();
	try {
		let fetchedChannel = (await message
			.guild!.channels.cache.get(findApplication.response_channel)!
			.fetch(true)) as TextChannel;
		fetchedChannel.send(req);
	} catch {
		message.channel.send(
			embed(
				"Error",
				"I could not find or send messages to the response channel. Make sure it is valid and I have permissions.",
				guild,
				"failure",
				false,
				true
			)
		);
	}
}

module.exports.help = {
	name: "apply",
	description: "Apply for the given application",
	module: "user",
	inDepth:
		"Apply for the given application in their respective server. Only works if they are available or if you meet the set requirements.",
};
