import { Message, MessageEmbed, Role } from 'discord.js';
import { OriginMessage } from '../../lib/extensions/OriginMessage';
import OriginClient from '../../lib/OriginClient';
import {
	askForBoolean,
	askForChannel,
	askForRole,
} from '../../lib/util/askFor';
import { GuildSettings, ModerationSettings } from '../../typings/origin';
import { CreateModerationSettings } from './laws';
export default async (
	bot: OriginClient,
	message: OriginMessage,
	args: string[],
	guild: GuildSettings,
): Promise<Message | void> => {
	if (!message.guild) return;

	let moderation: ModerationSettings = await bot.handlers.database.getOne(
		'modules',
		'moderation',
		{
			guild_id: message.guild?.id,
		},
	);
	if (!moderation) {
		moderation = await CreateModerationSettings(
			bot.handlers.database,
			message.guild?.id,
		);
	}

	if (!args[1]) {
		const moderationSettingsEmbed = new MessageEmbed()
			.setTitle('Moderation Settings')
			.setDescription(
				`To configure a value use ${guild.prefix}settings moderation <setting> or ${guild.prefix}settings moderation <setting> [value]`,
			)
			.addFields(
				{ name: 'Enabled', value: moderation.mod_enabled, inline: true },
				{ name: 'ModLog', value: moderation.mod_log ? `<#${moderation.mod_log}>` : 'none', inline: true },
				{
					name: 'ModRoles',
					value:
						moderation.mod_roles?.length == 0
							? 'none'
							: moderation.mod_roles
									.map((role) => `${message.guild?.roles.cache.get(role)}`)
									.join(', '),
					inline: true,
				},
				{ name: 'MutedRole', value: moderation.muted_role ? `<@&${moderation.muted_role}>` : 'none', inline: true},
				{ name: 'Cases', value: moderation.cases, inline: true },
			);
		return message.send(moderationSettingsEmbed);
	}

	const argument = args[1].toLowerCase();
	// Options

	if (argument.includes('log')) {
		const channel = await askForChannel(message, 'Modlog', args[2]);
		if (!channel) return;
		moderation.mod_log = channel.id;
		await bot.handlers.database.save(
			'modules',
			'moderation',
			{ guild_id: message.guild.id },
			moderation,
		);
	}

	if (argument.startsWith('modrole')) {
		if (!args[2])
			return message.error(
				`Do you want to add or remove a role?\n**Correct Usage**: \`${guild.prefix}settings moderation modroles add [role]\``,
			);

		const childArgument = args[2].toLowerCase() ?? undefined;
		if (childArgument == 'add') {
			const alphaRole = await askForRole(message, 'ModRoles', 'add', args[3]);
			if (alphaRole == undefined || typeof alphaRole == 'string') return;

			moderation.mod_roles.push(alphaRole.id);

			return await save(bot, moderation);
		}
		if (childArgument == 'remove') {
			const alphaRole = await askForRole(
				message,
				'ModRoles',
				'remove',
				args[3],
			);
			if (alphaRole == undefined || typeof alphaRole == 'string') return;

			const index = moderation.mod_roles.indexOf(alphaRole.id);
			if (index === -1) return message.error('Role not found.');

			moderation.mod_roles.splice(index);

			return await save(bot, moderation);
		}
	}

	if (argument.startsWith('mutedrole')) {
		const role = await askForRole(message, 'MutedRole', 'set', args[2], false)
		if (role == undefined || typeof role == 'string') return;

		moderation.muted_role = role.id
		return await save(bot, moderation)
	}
	if (argument == 'enable' || argument == 'disable') {
		const options = [];
		for (const [key] of Object.entries(moderation)) {
			if (key.includes('_') && key.includes('enabled')) {
				const splitkey = key.split('_');
				options.push({
					name: splitkey[0].charAt(0).toUpperCase() + splitkey[0].slice(1),
					column: key,
				});
			}
		}
		const validOptions = options.map((opt) => `${opt.name}`).join(',');

		if (!args[2])
			return message.error(
				`Give the value you wish to enable or disable.\n**Options**: ${validOptions}`,
			);
		const childArgument = args[2].toLowerCase();

		const setting = options.find((opt) => opt.name.toLowerCase() == childArgument);
		if (!setting)
			return message.error(`Invalid Option.\n**Options**: ${validOptions}`);

		moderation[setting.column] = (argument.includes('enable')) ? true : false
		const enabled_disabled = (argument.includes('enable')) ? 'enabled' : 'disabled'
		message.success(`Successfully ${enabled_disabled} ${setting.name}`)
		return await save(bot, moderation)
	}
};

async function save(bot: OriginClient, moderation: ModerationSettings) {
	return await bot.handlers.database.save(
		'modules',
		'moderation',
		{ guild_id: moderation.guild_id },
		moderation,
	);
}
