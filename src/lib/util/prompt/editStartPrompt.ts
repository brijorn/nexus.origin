import { Message, MessageEmbed } from "discord.js";
import { EmbedFields } from "../../../typings/origin";
import OriginMessage from "../../extensions/OriginMessage";

export default async (message: OriginMessage, prompt: string | EmbedFields | MessageEmbed, lower?: boolean): Promise<PromptFields|undefined> => {
	if (!lower) lower = false
	
	const filter = (response: Message) => response.author.id === message.author.id;

	const instance = await message.channel.send(prompt);

	const collector = message.channel.awaitMessages(filter, { max: 1, time: 180000, errors: ['time'] })
		.then(collected => {
			const content = collected.first()?.content;

			collected.first()?.delete();
			if (!content || !instance) return
			const res: PromptFields = {
				content: (lower == true) ? content.toLowerCase() : content,
				message: instance
			}
			return res;
		})
		.catch(_ => {

			instance.delete();

			return undefined;
		});
		return collector
	}


interface PromptFields {
	content: string,
	message: Message
}