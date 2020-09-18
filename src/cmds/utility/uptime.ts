import { Client, Message } from "discord.js";
import GuildSettings from "../../db/guild/types";

import embed from '../../functions/embed';
import moment from 'moment-timezone';

export async function run(bot: Client, message: Message, args: any[], guild: GuildSettings) {

	let uptime = moment().diff(bot.readyTimestamp);
	
	console.log(uptime);
	const embede = embed('Uptime', `Bot Uptime: ${uptime}`, guild, '#', true, true);
	const start = moment(bot.readyAt).tz('America/New_York').format('ddd, MMM Do YYYY hh:mm a');
	embede.setFooter(`Origin | Last Started: ${start}`);
	message.channel.send(embede);


};

module.exports.help = {
	name: 'uptime',
};