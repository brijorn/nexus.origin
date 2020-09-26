import { Client, Message } from "discord.js";
import {
	GuildSettings,
	NewAssetBindInterface,
	VerificationSettings,
} from "../../typings/origin";
import embed from "../../functions/embed";

import { NewAssetBind } from "../../plugins/verification/binding/CreateBind";
import { AssetBindType } from "../../typings/origin";
import OriginClient from "../../lib/OriginClient";
import OriginMessage from "../../lib/extensions/OriginMessage";
import { editStart } from "../../lib/util/prompt";
import Command from "../../lib/structures/Command";

export default class extends Command {
	constructor(bot: OriginClient) {
		super(bot, {
			name: 'assetbind',
			aliases: ['bindasset'],
			description: 'Bind a new asset to your discord server.'
		})
	}

	async execute(bot: OriginClient, message: OriginMessage, guild: GuildSettings, args: string[]): Promise<void| Message> {
		if (!guild || !message.guild?.owner) return
		if (message.author.id !== message.guild.owner.id)
			return message.channel.send("You cannot run this command.");
		const verification = await this.bot.handlers.verification.settings.fetch(message.guild.id)
		if (!verification)
			return message.error(
				"There are no verification settings for this guild, run !setup to setup."
			);
	
			const validTypes = ['asset', 'gamepass', 'rank']
			const mappedTypes = validTypes.map(each => `${each}`).join(', ')
	
			
		if (!args) {
			const start = await editStart(message, { title: 'Asset Bind Creation', description: `What type of binding is this?\nOptions: ${mappedTypes}`}, true)
			if (!start) return
			if (!validTypes.includes(start?.content)) return message.failure(`Invalid Option. Valid Options: ${mappedTypes}`)
			const type = start.content
	
	
		} else {
			// GROUP BIND REGEX /(?:(?:(asset?|gamepass?|rank?))?\s(?:(add?|remove?|edit?))?\s(?:(\d+))?\s(?:(\d+-\d+|\d+\S+))?\s(?:(\d+))?\s(?:'(.*?)')?\s(?:(\S+)))/gi;
			const getArgumentsRegex = /(?:(?:(asset?|gamepass?|rank?))?\s(?:(add?|remove?|edit?))?\s(?:(\d+))?\s(?:(\d+))?\s(?:'(.*?)')?\s(?:(\S+)))/gi;
			const getArguments = getArgumentsRegex.exec(args.join(" "));
			if (!getArguments) return message.error('Failed to parse Arguments. View the help with !help assetbind')
			console.log(getArguments);
			getArguments.shift();
			const [
				type,
				method,
				assetId,
				hierarchy,
				nickname,
				roles,
			] = getArguments;
			const bindingObject: NewAssetBindInterface = (await checkValidation(
				message,
				guild,
				{
					type: type,
					method: method,
					assetId: assetId,
					hierarchy: hierarchy,
					nickname: nickname,
					roles: roles,
				}
			)) as NewAssetBindInterface;
			if (!bindingObject) return;
	
			if (
				verification[type + "_binds"].find((bind: AssetBindType) => {
					bind.assetId === parseInt(assetId);
				})
			)
				return message.channel.send(
					embed(
						"Binding Already Exists",
						`A binding already exists for the asset ${assetId}. If you wish to edit it use the command:
					\`${guild.prefix}assetbind edit ${assetId} <role, nickname, hierarchy> <newvalue>\``,
						guild,
						"failure",
						false,
						true
					)
				);
			return await NewAssetBind(bot, message, guild, verification, bindingObject);
		}
	}
}

async function checkValidation(
	message: OriginMessage,
	guild: GuildSettings,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	opt: Record<string, any>
) {
	let valid = true;
	if (!opt.type || opt.type !== ("asset" || "gamepass" || "rank")) {
		valid = false;
		message.error(
				`Invalid/Missing type. Valid Types: asset, gamepass or rank.\n\nSee ${guild.prefix}help bind for more info.`,
			)
	}
	if (valid == false) return;

	if (!opt.method || opt.method !== ("add" || "remove" || "edit")) {
		valid = false;
		message.error(
				`Invalid/Missing. Valid Methods: add, remove or edit\n\nSee ${guild.prefix}help bind for more info.`,
		);
	}
	if (valid == false) return;

	if (!opt.assetId) {
		valid = false;
		message.channel.send(
			error(
				`Invalid/Missing assetId.\n\nSee ${guild.prefix}help bind for more info.`,
				guild
			)
		);
	} else opt.assetId = parseInt(opt.assetId);
	if (valid == false) return;

	if (!opt.hierarchy) {
		valid = false;
		message.channel.send(
			error(
				`Invalid/Missing hierarchy. Make sure there are no spaces between, example: 123456, 532123456 should be: 123456,532123456\n\nSee ${guild.prefix}help bind for more info.`,
				guild
			)
		);
	} else opt.hierarchy = parseInt(opt.hierarchy);
	if (valid == false) return;

	if (!opt.nickname) {
		valid = false;
		message.channel.send(
			error(
				`Missing Nickname. Make sure it is in singlequotes, example: 'NicknameHere'\n\nSee ${guild.prefix}help bind for more info.`,
				guild
			)
		);
	}
	if (valid == false) return;

	if (!opt.roles) {
		valid = false;
		message.channel.send(
			error(
				`Missing Role(s). Make sure there are no spaces between, example: 123456, 532123456 should be: 123456,532123456\n\nSee ${guild.prefix}help bind for more info.`,
				guild
			)
		);
	} else {
		const roles: string[] = opt.roles
			.split(",")
			.filter((v: string) => v != "")
			.map((p: string) => p.trim());
		opt.roles = roles;
	}
	if (valid == false) return valid;

	return opt as NewAssetBindInterface;
}

function error(message: string, guild: GuildSettings) {
	return embed("Error", message, guild, "failure", false, true);
}
