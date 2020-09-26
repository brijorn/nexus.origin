import { GuildSettings } from "../../typings/origin";
import { Message } from "discord.js";
import embed from "../../functions/embed";
import { editPrompt, editStart } from "../../lib/util/prompt";
import OriginClient from "../../lib/OriginClient";
import { Application, ApplicationSettings } from "../../typings/origin";
import OriginMessage from "../../lib/extensions/OriginMessage";
import { channel } from "../../lib/util/parse";
const MAX_APPLICATIONS = 10;
const MAX_QUESTIONS = 20;

export default async (
	bot: OriginClient,
	message: OriginMessage,
	application: ApplicationSettings,
	guild: GuildSettings
): Promise<Message|undefined> => {
	if (application.applications.length == MAX_APPLICATIONS)
		return message.guildembed(
				"Maximum Applications",
				`You have reach the maximum amount of applications per guild: ${MAX_APPLICATIONS}`,
				guild,
				"failure",
				false,
				true
		);

	const start = await editStart(
		message,
		{
			title: "Application Creation",
			description: "What is the name of the application?"
		}
		)
	if (!start || start.content.toLowerCase() === "cancel") return start?.message.delete({ timeout: 5000 }) || undefined;

	const getQuestions = await createQuestions(message, start.message, guild);
	if (getQuestions.cancelled === true)
		return start.message.delete({ timeout: 5000 });
	const questions: string[] = getQuestions.questions;
	const responseChannelPrompt = editPrompt(
		message,
		start.message,
		embed(
			"Application Creation",
			"Would channel would you like to send application responses to?",
			guild,
			""
		),
		"lower"
	);
	const responseChannel = await channel(message, responseChannelPrompt as unknown as string) as string

	let requireVerification = editPrompt(
		message,
		start.message,
		embed(
			"Application Creation",
			"Would you like users to be verified to apply?",
			guild,
			""
		),
		"lower"
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	) as any;

	requireVerification =
		requireVerification.content === "true" ? true : (false as boolean);

	start.message.edit(
		embed(
			"Application Created",
			`Your application ${start.content} has successfully been created.`,
			guild,
			"success"
		)
	);

	if (!responseChannel) return message.error('Could not find the given response channel.')
	const newApplication: Application = {
		available: true,
		name: start.content,
		require_verification: requireVerification,
		questions: questions,
		response_channel: responseChannel
	};

	application.applications.push(newApplication);
	await bot.handlers.database.updateOne('modules', 'applications', { guild_id: message.guild?.id }, application)

	return;
};

async function createQuestions(
	message: Message,
	msgToEdit: Message,
	guild: GuildSettings
) {
	// Declare
	let done= false;
	let cancelled = false;
	const questions: string[] = [];
	let i = 0;

	// Loop
	while (
		done === false &&
		cancelled === false &&
		questions.length > MAX_QUESTIONS
	) {
		i = i++;
		const ques = embed(
			`Question ${i}`,
			"What is the description for this question\n\nSay **done** at any time to stop or **cancel** to cancel.",
			guild,
			"",
			"The maximum number of questions is 20."
		);
		const res = (await editPrompt(message, msgToEdit, ques)) as string;
		if (!res) cancelled = true;
		if (res.toLowerCase() === "done") {
			done = true;
		}
		questions.push(res);
	}
	return {
		cancelled,
		questions,
	};
}
