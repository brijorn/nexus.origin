import { Client, Message } from "discord.js";
import GuildSettings from "../../db/guild/types";
import { VerificationSettings } from "../../db/verification/types";

import bind from '../../lib/bind/index';
import embed from '../../functions/embed';
function escapeRegExp(string: string) {
	return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export async function run(bot: Client, message: Message, args: string[], guild: GuildSettings) {
	if (message.author.id !== message.guild!.owner!.id) return message.channel.send('You cannot run this command.')
	const verification = await new VerificationSettings().get(message.guild!.id);
	if (!verification) return message.channel.send('There are no verification settings for this guild, run !setup to setup.')
	if (!args[0] || !args[1] || !args[2]) return message.channel.send(embed('none', `Missing Arguments, run ${guild.prefix}help bind for help with this command`, guild, 'failure', false));
	const option = args[0].toLowerCase();
	const type = args[1].toLowerCase();
	if (option === 'asset' || option === 'gamepass' || option === 'rank') {
		let bindType: any;
		if (option !== 'gamepass') bindType = option + 'Binds'
		else bindType = 'gamePassBinds'
		const id = args[2].toLowerCase();

		const types = ['add', 'remove', 'edit', 'create'];
		if (!types.includes(type)) return message.channel.send(embed('none', 'Invalid Option Given, Options: `add, remove, edit`', guild, 'failure', false));

		if (type === 'add') {
			const roleId = args[3];
			if (!args.find(o => o.startsWith('\'')) || !args.find(o => o.endsWith('\''))) return message.channel.send(embed('none', 'Missing nickname, make sure it is inside quotations.\nExample: `\'[VIP]{robloxname}\'`' + `\nFor more information run \`${guild.prefix}help binds\``, guild, 'failure', false));
			// Find argument with quotes, get the index then split
			const quotestart = args.find(o => o.startsWith('\'')) as string; 
			const quoteEnd = args.find(o => o.endsWith('\'')) as string;
			const startIndex = args.indexOf(quotestart);
			const endIndex = args.indexOf(quoteEnd);

			let nickname = args.splice(startIndex, endIndex - 2).join('');
			nickname = nickname.replace('{{s}}', ' ');
			nickname = nickname.replace(new RegExp(escapeRegExp('\''), 'g'), '');

			const hierarchy = parseInt(args[3]);
			// Get the roles then create a new array with them
			let roles: any = args
			.splice(4)
			.join('')
			.split(',')
			.filter((v: any)=>v != '')
			.map((p) => p.trim());
			await bind.addAsset(message, guild, verification, bindType, type, parseInt(id), nickname, hierarchy, roles);
		}

		if (type === 'remove') await bind.removeAsset(message, guild, verification, bindType, parseInt(id));
	}
	if (option === 'group') {
		if (type === 'add') {
			// Group Id
			const id = args[2].toLowerCase();
			// Ranks to Bind
			let ranks: string[] = args[3].split(',');
			// Nickname
			const quotestart = args.find(o => o.startsWith('\'')) as string; 
			const quoteEnd = args.find(o => o.endsWith('\'')) as string;
			const startIndex = args.indexOf(quotestart);
			const endIndex = args.indexOf(quoteEnd);

			let nickname = args.splice(startIndex, endIndex - 4).join('');
			nickname = nickname.replace('{{s}}', ' ');

			// Hierarchy Point
			const hierarchy = args[5];
			let roles: any = args
			.splice(4)
			.join('')
			.split(',')
			.filter((v: any)=>v != '')
			.map((p) => p.trim());

			await bind.addGroup(message, guild, verification, parseInt(id), ranks, nickname, parseInt(hierarchy), roles);
		}
	}
};

module.exports.help = {
	name: 'bind',
	description: 'Add, remove or edit a group, asset, gamepass or badge bind',
	aliases: ['binds'],
	syntax: [
		'!bind group create `5845349 1-50`',
		'!bind group add 5845349, 100-200 [Staff]{{s}}{robloxname} 5 Staff',
		'!bind asset add <asset-id> <role-id>',
		'!bind gamepass remove <asset-id> or <rank-id> with groups',
		'!bind group remove all',
	],
	inDepth: 'Use this command to add, remove or edit bindings to a group, asset gamepass or badge.' +
    '\nWhen using group the following are available:\n\n`bind group add 5845349 1-255 create` to create bindings for all the ranks in the given group.' +
    'This will skip those that already exist. You can also create custom settings using the nicknameformat placeholders.\nSyntax: `bind group add [groupid: 5845349] [rank: 100] [nickname: \'[STAFF]{{s}}{robloxname}\'] [hierarchy: the higher the number the more important] [role, roles]`\n Example: `bind group add 100 \'[Owner]{roblox-name}\' 1 749748861651779695,740596178177097880`\n Other Methods: `bind group clear [groupid]` - clear all group binds' +
    '\n\nWhen using any other type of bind the syntax is fairly the same:\n\n' +
    'Syntax: `bind [asset-type] add [assetId] [nickname] [hiearchy] [role, roles]`' +
    '\nExample: `bind asset add 3196348 \'[Adopt Me Vip]{robloxname}\' 1 738249753581846538`' +
    '\n\n**Use quotations for nickname for both group and asset nicknames if they are more than one character. To use the default nickname put `default` for the nickname value**\nTo include a space in the nickname use `{{s}}`',
	module: 'settings',

};