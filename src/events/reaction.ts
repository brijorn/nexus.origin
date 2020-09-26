import { MessageReaction, User } from "discord.js";
import OriginClient from "../lib/OriginClient";
export default async (
	bot: OriginClient,
	reaction: MessageReaction,
	user: User
): Promise<void> => {
	console.log('Hello')
}