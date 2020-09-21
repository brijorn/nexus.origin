import { FetchedApplication, GuildSettings } from "@lib/origin";
import { Message } from "discord.js";
import embed from "functions/embed";
import { editPrompt, editStart } from "prompt";

const MAX_APPLICATIONS: number = 10;
const MAX_QUESTIONS: number = 20;

export default async (
	message: Message,
	application: FetchedApplication,
	guild: GuildSettings
) => {
	application.get(message.guild!.id);
	if (application.applications.length == MAX_APPLICATIONS)
		return message.channel.send(
			embed(
				"Maximum Applications",
				`You have reach the maximum amount of applications per guild: ${MAX_APPLICATIONS}`,
				guild,
				"failure",
				false,
				true
			)
		);

	const start = await new editStart(
		message,
		embed(
			"Application Creation",
			"What is the name of the application?",
			guild,
			""
		)
	).init();
	if (!start || start.content.toLowerCase() === "cancel")
		return start!.message.delete({ timeout: 5000 });

	const getQuestions = await createQuestions(message, start.message, guild);
	if (getQuestions.cancelled === true)
		return start.message.delete({ timeout: 5000 });
	const questions: string[] = getQuestions.questions;

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

	const newApplication = {
		available: true,
		name: start.content,
		require_verification: requireVerification,
		questions: questions,
	};

	application.applications.push(newApplication);
	await application.update("applications", application.applications);

	return;
};

async function createQuestions(
	message: Message,
	msgToEdit: Message,
	guild: GuildSettings
) {
	// Declare
	let done: boolean = false;
	let cancelled: boolean = false;
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
