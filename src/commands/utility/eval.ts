import { config } from 'process';
import moment from 'moment-timezone';
import Command from '../../lib/structures/Command';
import OriginClient from '../../lib/OriginClient';
import { OriginMessage } from '../../lib/extensions/OriginMessage';
import { GuildSettings } from '../../typings/origin';

export default class extends Command {
	constructor(bot: OriginClient) {
		super(bot, {
			name: 'eval',
		})
	}

	async run(message: OriginMessage, args: string[], guild: GuildSettings): Promise<void> {
		if(message.author.id !== '728255006079189022' && message.author.id !== '452913357276577803') return;


	function clean(text: string) {
		if (typeof (text) === 'string') {return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));}
		else {return text;}
	}
	try {
		const code = args.join(' ');
		let evaled = eval(code);
		if (code.includes('process.env') || code.includes('config.json')) return;
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		if (typeof evaled !== 'string') {evaled = require('util').inspect(evaled);}

		message.channel.send(clean(evaled), { code:'xl' });
	}
	catch (err) {
		message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
	}
	}
}