import { Client, Message } from "discord.js";
import { GuildSettings, VerificationSettings } from "@lib/origin";
import embed from "../../functions/embed";

export async function run(
	bot: Client,
	message: Message,
	args: string[],
	guild: GuildSettings,
) {
	if (message.author.id !== message.guild!.owner!.id)
		return message.channel.send("You cannot run this command.");
	const verification = await new VerificationSettings().get(message.guild!.id);
	if (!verification)
		return message.channel.send(embed(
			"Error",
			"There are no verification settings for this guild, run !setup to setup.",
			guild, 'failure', false, true
		));

	if (!args) {
	} else {
		// GROUP BIND REGEX /(?:(?:(asset?|gamepass?|rank?))?\s(?:(add?|remove?|edit?))?\s(?:(\d+))?\s(?:(\d+-\d+|\d+\S+))?\s(?:(\d+))?\s(?:'(.*?)')?\s(?:(\S+)))/gi;
		const getArgumentsRegex = /(?:(?:(asset?|gamepass?|rank?))?\s(?:(add?|remove?|edit?))?\s(?:(\d+))?\s(?:(\d+))?\s(?:'(.*?)')?\s(?:(\S+)))/gi;
		const getArguments = getArgumentsRegex.exec(args.join(" "))!;
		console.log(getArguments)
		getArguments.shift();
		let [type, method, assetId, hierarchy, nickname, roles] = getArguments as any;
		const bindingObject: BindingInterface = await checkValidation(message, guild,
			{
				type: type,
				method: method,
				assetId: assetId,
				hierarchy: hierarchy,
				nickname: nickname,
				roles: roles
			}) as any
		if (!bindingObject) return
		console.log(bindingObject)
	}
}

module.exports.help = {
	name: "assetbind",
	description: "Add, remove or edit a group, asset, gamepass or badge bind",
	aliases: ["binds"],
	syntax: [
		"!bind group create `5845349 1-50`",
		"!bind group add 5845349, 100-200 [Staff]{{s}}{robloxname} 5 Staff",
		"!bind asset add <asset-id> <role-id>",
		"!bind gamepass remove <asset-id> or <rank-id> with groups",
		"!bind group remove all",
	],
	inDepth:
		"Use this command to add, remove or edit bindings to a group, asset gamepass or badge." +
		"\nWhen using group the following are available:\n\n`bind group add 5845349 1-255 create` to create bindings for all the ranks in the given group." +
		"This will skip those that already exist. You can also create custom settings using the nicknameformat placeholders.\nSyntax: `bind group add [groupid: 5845349] [rank: 100] [nickname: '[STAFF]{{s}}{robloxname}'] [hierarchy: the higher the number the more important] [role, roles]`\n Example: `bind group add 100 '[Owner]{roblox-name}' 1 749748861651779695,740596178177097880`\n Other Methods: `bind group clear [groupid]` - clear all group binds" +
		"\n\nWhen using any other type of bind the syntax is fairly the same:\n\n" +
		"Syntax: `bind [asset-type] add [assetId] [nickname] [hiearchy] [role, roles]`" +
		"\nExample: `bind asset add 3196348 '[Adopt Me Vip]{robloxname}' 1 738249753581846538`" +
		"\n\n**Use quotations for nickname for both group and asset nicknames if they are more than one character. To use the default nickname put `default` for the nickname value**\nTo include a space in the nickname use `{{s}}`",
	module: "settings",
};

async function checkValidation(
	message: Message,
	guild: GuildSettings,
	opt: any
) {

	let valid: boolean = true
		if (!opt.type || opt.type !== ('asset' || 'gamepass' || 'rank') ) {
			valid = false
			message.channel.send(error(`Invalid/Missing type. Valid Types: asset, gamepass or rank.\n\nSee ${guild.prefix}help bind for more info.`, guild))
		}
		if (valid==false) return

		if (!opt.method || opt.method !== ('add' || 'remove' || 'edit')) {
			valid = false
			message.channel.send(error(`Invalid/Missing. Valid Methods: add, remove or edit\n\nSee ${guild.prefix}help bind for more info.`, guild))
		}
		if (valid==false) return

		if (!opt.assetId) {
			valid = false
			message.channel.send(error(`Invalid/Missing assetId.\n\nSee ${guild.prefix}help bind for more info.`, guild))
		}
		else opt.assetId = parseInt(opt.assetId)
		if (valid==false) return

		if (!opt.hierarchy) {
			valid = false
			message.channel.send(error(`Invalid/Missing hierarchy. Make sure there are no spaces between, example: 123456, 532123456 should be: 123456,532123456\n\nSee ${guild.prefix}help bind for more info.`, guild))
		}
		else opt.hierarchy = parseInt(opt.hierarchy)
		if (valid==false) return

		if (!opt.nickname) {
			valid = false
			message.channel.send(error(`Missing Nickname. Make sure it is in singlequotes, example: 'NicknameHere'\n\nSee ${guild.prefix}help bind for more info.`, guild))
		}
		if (valid==false) return

		if (!opt.roles) {
			valid = false
			message.channel.send(error(`Missing Role(s). Make sure there are no spaces between, example: 123456, 532123456 should be: 123456,532123456\n\nSee ${guild.prefix}help bind for more info.`, guild))
		}
		else {

			const roles: string[] =
			opt.roles.split(',')
			.filter((v: any)=>v != '')
			.map((p: any) => p.trim());
			opt.roles = roles
		}
		if (valid==false) return valid

		return opt as BindingInterface
}

function error(message: string, guild: GuildSettings) {
	return embed('Error', message, guild, 'failure', false, true)
}
interface BindingInterface {
	type: 'asset' | 'gamepass' | 'rank';
	method: 'add' | 'remove' | 'edit';
	assetId: number;

	
	hiearchy: number;
	nickname: string;
	roles: string[];
}