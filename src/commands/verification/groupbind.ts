/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	VerificationSettings,
	GuildSettings,
	NewRoleBindInterface,
} from "../../typings/origin";
import { Client, Message } from "discord.js";
import embed from "../../functions/embed";
import { getRoles, Role } from "noblox.js";
import { NewRoleBind } from "../../plugins/verification/binding/CreateBind";
import OriginClient from "../../lib/OriginClient";
import Command from "../../lib/structures/Command";
import { OriginMessage } from "../../lib/extensions/OriginMessage";
export default class extends Command {
	constructor(bot: OriginClient) {
		super(bot, {
			name: 'groupbind',
			aliases: ['bindgroup', 'gb'],
			description: 'Add a new group bind'
		})
	}

	async run(message: OriginMessage, args: string[], guild: GuildSettings): Promise<void|Message> {
		if (message.author.id !== message.guild?.owner?.id)
		return message.channel.send("You cannot run this command.");
	const verification = await this.bot.handlers.verification.settings.fetch(message.guild?.id)
	if (!verification)
		return message.channel.send(
			embed(
				"Error",
				"There are no verification settings for this guild, run !setup to setup.",
				guild,
				"failure",
				false,
				true
			)
		);

	if (!args) {
		console.log('Hey')
	} else {
		const getArgumentsRegex = /(?:\s?(?:(add?|remove?|edit?))?\s(?:(\d+))?\s(?:(\S+))?\s(?:(\d+))?\s(?:'(.*?)')?\s(?:(\S+(?=--)?))?\s?(?:(.*)?))/gim;
		const getArguments = getArgumentsRegex.exec(args.join(" "));
		try {
			getArguments?.shift();
		} catch {
			return message.error("Missing a value.");
		}

		const [
			method,
			groupId,
			ranks,
			hierarchy,
			nickname,
			roles,
			flags,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		] = getArguments as any[];
		const groupRanks = await getRoles(groupId).catch(() => {
			return message.channel.send(
				error(`Could not find the group ${groupId}`, guild)
			);
		});
		const bindingObject: NewRoleBindInterface = (await checkValidation(
			message,
			guild,
			groupRanks as Role[],
			{
				method: method,
				groupId: groupId,
				ranks: ranks,
				hierarchy: hierarchy,
				nickname: nickname,
				roles: roles,
				flags: flags,
			}
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		)) as any;
		if (!bindingObject) return;
		return NewRoleBind(
			this.bot,
			message,
			guild,
			verification,
			bindingObject,
			groupRanks as Role[]
		);
	}
	}
}

async function checkValidation(
	message: Message,
	guild: GuildSettings,
	groupRanks: Role[],
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	opt: any
) {
	let valid = true;
	if (!opt.method || opt.method !== ("add" || "remove" || "edit")) {
		valid = false;
		message.channel.send(
			error(
				`Invalid/Missing. Valid Methods: add, remove or edit\n\nSee ${guild.prefix}help bind for more info.`,
				guild
			)
		);
	}
	if (valid == false) return;

	if (!opt.groupId || isNaN(opt.groupId) == true) {
		valid = false;
		message.channel.send(
			error(
				`Invalid/Missing groupId.\n\nSee ${guild.prefix}help bind for more info.`,
				guild
			)
		);
	} else opt.groupId = parseInt(opt.groupId);

	if (!opt.ranks) {
		valid = false;
		message.channel.send(
			error(
				`Missing Ranks. Ranks can be names, numbers or betweens. Example: \`Owner,1-100,100\` **Include no spaces**\n\nSee ${guild.prefix}help bind for more info.`,
				guild
			)
		);
	} else {
		const newRanks: Role[] = [];
		opt.ranks = opt.ranks.split(",");
		// Loop through all of the given ranks
		for (const value of opt.ranks) {
			if (valid == false) return;
			console.log(value);
			// if its a between value
			if (value.includes("-")) {
				const splitRanks = value.split("-");
				// Check if any of them are names
				let betweenRoles: number[] = [];
				console.log(splitRanks);
				for (const item of splitRanks) {
					// Name
					if (isNaN(item as any) == true) {
						const rank = ((item as any) = groupRanks.find(
							(rank) => rank.name === item
						));
						if (!rank) {
							valid = false;
							message.channel.send(
								error(`Could not find a rank with the name of ${item}`, guild)
							);
						}
						betweenRoles.push(rank?.rank as any);
					}
					// ID
					else {
						const rank = ((item as any) = groupRanks.find(
							(rank) => rank.rank === parseInt(item)
						));
						if (!rank) {
							valid = false;
							message.channel.send(
								error(`Could not find a rank with a rank of ${item}`, guild)
							);
						}
						betweenRoles.push(rank?.rank as any);
					}
				}
				betweenRoles = betweenRoles.sort((a: number, b: number) => a - b);
				for (let i: number = betweenRoles[0]; i <= betweenRoles[1]; i++) {
					const rank = groupRanks.find((rank) => rank.rank === i);
					if (rank) newRanks.push(rank);
				}
			}
			// If its a rank or a name
			else {
				// Name
				if (isNaN(value as any) == true) {
					const rank = groupRanks.find((i) => i.name === value);
					if (!rank) {
						valid = false;
						message.channel.send(
							error(`Could not find a rank with the name of ${value}`, guild)
						);
					}
					newRanks.push(rank?.rank as any);
				}
				// ID
				else {
					const rank = groupRanks.find((i) => i.rank === parseInt(value));
					if (!rank) {
						valid = false;
						message.channel.send(
							error(`Could not find a rank with a rank of ${value}`, guild)
						);
					}
					newRanks.push(rank?.rank as any);
				}
			}
		}
		opt.ranks = newRanks.sort((a: any, b: any) => a.rank - b.rank) as Role[];
	}
	if (valid == false) return;

	if (!opt.hierarchy || isNaN(opt.hierarchy) == true) {
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

	if (opt.roles) {
		const roles: string[] = opt.roles
			.split(",")
			.filter((v: any) => v != "")
			.map((p: any) => p.trim());
		opt.roles = roles;
	}

	if (opt.flags) {
		const validFlags: string[] = [
			"--createroles",
			"--deleteprev",
			"--editexisting",
		];
		const mapFlags = validFlags.map((flag) => `${flag}`).join(", ");
		opt.flags = opt.flags.split(" ");
		opt.flags.forEach((element: string) => {
			if (validFlags.find(e => e.startsWith(element)) as any === false) {
				valid = false;
				return message.channel.send(
					error(
						`Could not find the flag \`${element}\`\nValid flags: \`${mapFlags}\``,
						guild
					)
				);
			}
			if (element.includes("--editexisting")) {
				const options: string[] = ["all", "nickname", "hierarchy", "roles", "rolesjoin", "rolesreplace"];
				const mapOptions: string = options.map(e => `${e}`).join(', ')
				const BRACKET_REGEX = /\((.*?)\)/g;
				const insideBrackets = BRACKET_REGEX.exec(element);
				if (insideBrackets == null) {
					valid = false;
					return message.channel.send(
						error(
							`Could not find any brackets within flag \`--editexisting\`
							Valid Format: --editexisting(all)
							Options: \`${mapOptions}\``,
							guild
						)
					);
				} else {
					const values = insideBrackets[1].split(",")
					values.forEach((val: string) => {
						if (!options.includes(val)) {
							valid = false;
							return message.channel.send(
								error(
									`Could not find the \`--editexisting\` option \`${val}\`
								Example: --editexsting(nickname,hierarchy)
								Options: \`${mapOptions}\``,
									guild
								)
							);
						}
					});
					opt.editexistingFlags = values
				}
			}
		});
	}

	if (valid as boolean == false) return;

	return opt as NewRoleBindInterface;
}

function error(message: string, guild: GuildSettings) {
	return embed("Error", message, guild, "failure", false, true);
}

module.exports.help = {
	name: "groupbind",
	description: "Bind a new group or roles to your server",
};