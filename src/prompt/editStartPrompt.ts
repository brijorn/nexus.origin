import { Message } from "discord.js";

const embed = require('../functions/embed');
export default class editStart implements PromptFields {
	constructor() { }

	public message!: Message
	public content!: string
	
	public async init(message: Message, prompt: any) {

	const filter = (response: any) => response.author.id === message.author.id;

	const instance = await message.channel.send(prompt);

	const collector = message.channel.awaitMessages(filter, { max: 1, time: 180000, errors: ['time'] })
		.then(collected => {
			const content = collected.first()!.content;

			collected.first()!.delete();
			this.content = content
			this.message = collected.first() as Message
			return this;
		})
		.catch(_ => {

			instance.delete();

			return undefined;
		});
	return collector
	}
}


interface PromptFields {
	content: string,
	message: Message
}