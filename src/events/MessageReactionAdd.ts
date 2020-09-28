import { MessageReaction, User } from "discord.js";
import OriginClient from "../lib/OriginClient";
import Event from "../lib/structures/Event";

export default class extends Event {

	async execute(reaction: MessageReaction, user: User): Promise<void> {
		return console.log('Hello')
	}
}