import { GuildSettings } from '../../typings/origin';
import { Message } from 'discord.js';
import embed, { RegularEmbed } from '../../functions/embed';
import { editPrompt, editStart } from '../../lib/util/prompt';
import OriginClient from '../../lib/OriginClient';
import { Application, ApplicationSettings } from '../../typings/origin';
import { OriginMessage } from '../../lib/extensions/OriginMessage';
import { parseChannel } from '../../lib/util/parse';
const MAX_APPLICATIONS = 10;
const MAX_QUESTIONS = 20;

export default async (
	bot: OriginClient,
	message: OriginMessage,
	application: ApplicationSettings,
	guild: GuildSettings,
): Promise<Application | undefined> => {
	if (!message.guild) return;
	if (application.applications.length == MAX_APPLICATIONS) {
		message.guildembed(
			'Maximum Applications',
			`You have reach the maximum amount of applications per guild: ${MAX_APPLICATIONS}`,
			guild,
			'failure',
			false,
			true,
		);
	}

	const start = await editStart(message, {
		title: 'Application Creation',
		description: 'What is the name of the application?',
	});
	if (!start || start.content.toLowerCase() === 'cancel') {
		start?.message.delete({ timeout: 5000 }) || undefined;
		return;
	}

	const getQuestions = await createQuestions(message, start.message, guild);
	if (getQuestions.cancelled === true) {
		start.message.delete({ timeout: 5000 });
		return;
	}
	const questions: string[] = getQuestions.questions;
	const responseChannelPrompt = await editPrompt(
		message,
		start.message,
		{
			title: 'Application Creation',
			description: 'Would channel would you like to send application responses to?'
		},
		'lower',
	);
	if (!responseChannelPrompt) {
		start.message.delete({ timeout: 5000 });
		return;
	}

	const responseChannel = parseChannel(message.guild, responseChannelPrompt);
	if (!responseChannel) {
		await message.error('Could not find the given response channel, you can set the value later.');
	}

	const requireVerificationPrompt = await editPrompt(
		message,
		start.message,
		embed(
			'Application Creation',
			'Would you like users to be verified to apply?',
			guild,
			'',
		),
		'lower',
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	);
	if (!requireVerificationPrompt) {
		start.message.delete({ timeout: 5000 });
		return;
	}

	const requireVerification =
		requireVerificationPrompt === 'true' ? true : false;

	start.message.edit(
		embed(
			'Application Created',
			`Your application ${start.content} has successfully been created.`,
			guild,
			'success',
		),
	);

	const newApplication: Application = {
		available: true,
		name: start.content,
		require_verification: requireVerification,
		questions: questions,
		response_channel: responseChannel?.id || '',
	};

	application.applications.push(newApplication);

	return newApplication;
};

async function createQuestions(
	message: OriginMessage,
	msgToEdit: Message,
	guild: GuildSettings,
) {
	// Declare
	let cancelled = false;
	const questions: string[] = [];
	let i = 0;

	// Loop
	while (questions.length < MAX_QUESTIONS) {
		i++;
		const ques = embed(
			`Question ${i}`,
			'What is the description for this question\n\nSay **done** at any time to stop or **cancel** to cancel.',
			guild,
			'',
			'The maximum number of questions is 20.',
		);
		const res = await editPrompt(message, msgToEdit, ques);
		if (!res) {
			cancelled = true;
			break;
		}
		if (res.toLowerCase() === 'cancel') {
			cancelled = true;
			msgToEdit.edit(
				RegularEmbed({
					title: 'Cancelled',
					description: 'Application Creation Cancelled.',
				}),
			);
			break;
		}
		if (res.toLowerCase() === 'done') {
			break;
		}
		questions.push(res);
	}
	return {
		cancelled,
		questions,
	};
}
