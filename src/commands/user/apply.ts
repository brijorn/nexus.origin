import embed from "../../functions/embed";
import { Channel, Message, MessageEmbed, TextChannel } from "discord.js";
import { Application, ApplicationSettings, GuildSettings } from "../../typings/origin";
import { editStart, prompt } from "../../lib/util/prompt";
import pmprompt from "../../lib/util/prompt/pmprompt";
import OriginClient from "../../lib/OriginClient";
import { OriginMessage } from "../../lib/extensions/OriginMessage";
import Command from "../../lib/structures/Command";

export default class extends Command {
	constructor(bot: OriginClient) {
		super(bot, {
			name: 'apply',
			description: 'Apply for the given application'
		})
	}

	async run(message: OriginMessage, args: string[], guild: GuildSettings): Promise<void|Message> {
		const application: ApplicationSettings =
		await this.bot.handlers.database.getOne("modules", "application", {
			guild_id: message.guild?.id,
		})
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

	let promptArgument = '';
	if (!args[0]) {
		const start = await editStart(
			message,
			{
				title: "Application",
				description: "What is the name of the application you wish to apply for?",
				color: guild.embed.color as unknown as number
			}, true
		);
		if (!start) return;
		promptArgument = start.content
	}

	const argument = (args.length > 1) ? args.join(' ') : args[0]
	const findApplication = app.find(form => form.name.toLowerCase() == (argument.toLowerCase() || promptArgument))

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
	const startApplication = await message.dmprompt(startApplicationMessage);
	if (startApplication.includes("y") === false)
		return startApplication.message.delete({ timeout: 5000 });
	const questions = findApplication.questions;
	let cancelled = false;
	for (let i = 0; i < questions.length && cancelled === false; i++) {
		const question = embed(
			`${name}`,
			questions[i],
			guild,
			"",
			`Question ${i + 1}/${questions.length}`
		);

		const response = await message.dmprompt(question);
		if (response.content.toLowerCase() === "cancel") {
			cancelled = true;
		} else responses.push(response.content);
	}
	if ((cancelled == true)) return;

	let place = 1;
	let i = 0;
	const matcher = questions
		.map((r: string) => `\`${place++}\` **${r}**\n${responses[i++]}`)
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
			message.author.avatarURL() as string
		)
		.setDescription(matcher)
		.setColor("#ffad3b")
		.setFooter("Application")
		.setTimestamp();
	try {
		const fetchedChannel = (await message
			.guild?.channels.cache.get(findApplication.response_channel)?.fetch(true)) as TextChannel;
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
}
