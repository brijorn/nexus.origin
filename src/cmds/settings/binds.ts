import { Client, Message } from "discord.js";

import db from '../../db/';
import { VerificationSettings } from "../../db/verification/types";
import bind from '../../lib/bind/';

export async function run(bot: Client, message: Message, args: Array<any>, guild: object) {
	const verification = await new VerificationSettings().get(message.guild!.id)

	if (!args[0]) {
		await bind.list(message, verification);
	}

};

module.exports.help = {
	name: 'binds',
	description: 'View all of your server\'s bindings.',
	syntax: ['!binds group', '!binds asset', '!binds group <groupid>', '!binds asset <assetid>'],
};