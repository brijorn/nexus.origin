import { parseChannel } from '../../lib/util/parse';
import { Client, Guild, Message, TextChannel } from 'discord.js';
import Command from "../../lib/structures/Command";
import OriginClient from '../../lib/OriginClient';
import { OriginMessage } from '../../lib/extensions/OriginMessage';
import { GuildSettings } from '../../typings/origin';


export default class extends Command {
	constructor(bot: OriginClient) {
		super(bot, {
			name: 'embed',
			syntax: ['!embed <json-data>', '!embed {"title":"Embed Title", "description": "Embed Description"}'],
			description: 'Create and send a bot embed using JSON data, [click here for an Embed Visualizer](https://leovoel.github.io/embed-visualizer/)',
		})
	}
	async run(message: OriginMessage, args: string[], guild: GuildSettings): Promise<void|Message> {
		if (!message.guild) return;
		let json_data = '';
	try {
		json_data = (args.includes('-channel')) ?
			args.splice(0, args.indexOf('-channel')).join(' ')
			:
			args.splice(0).join(' ');
		json_data = JSON.parse(json_data);
	}
	catch {return message.channel.send('Invalid Json Data, for help use the visualizer here: https://leovoel.github.io/embed-visualizer/');}
	const channel = (args.includes('-channel')) ? args.slice(args.indexOf('-channel') + 1).join('') : undefined;

	if (channel) {
		try {
		const textChannel = parseChannel(message.guild, channel);
		if (!textChannel) return message.error('Could not find the given channel')
		textChannel.send({ embed: json_data });
		}
		catch {
			return message.error(`Could not find the channel ${channel}`)
		}
	}
	else return message.channel.send({ embed: json_data });
	}
}