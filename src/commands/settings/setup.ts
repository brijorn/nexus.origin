import embed from '../../functions/embed';
import fetch from 'node-fetch';
import Command from '../../lib/structures/Command';
import { GroupBinds, GuildSettings, RoleBindGroup } from '../../typings/origin';
import { OriginMessage } from '../../lib/extensions/OriginMessage';
import { Message } from 'discord.js';
import OriginClient from '../../lib/OriginClient';
import { editPrompt, editStart } from '../../lib/util/prompt';
import thumbnail from '../../functions/thumbnailFunction';
// Steps
import { createRoles, deleteRoles  } from '../../plugins/verification/setup/BindRoles';
import { createVerificationRole, customVerificationRole } from '../../plugins/verification/setup/VerifiedRole';
import { getGroup, getRoles, Role } from 'noblox.js';
export default class extends Command {
	constructor(bot: OriginClient) {
		super(bot, {
			name: 'setup',
			description: 'Bind a new main role bind group to your Discord Server to enable ranking, verification and more.',
			cooldown: 60
		})
	}
	async run(message: OriginMessage, args: string[], guild: GuildSettings): Promise<Message> {
		if (message.author.id !== message.guild?.owner?.id) {
			return message.error(
					'Only the owner can bind a group the discord for safety purposes.',
			);
		}
		const ownerUser = await this.bot.handlers.verification.users.fetch(message.author.id)
		if (!ownerUser) return message.error('You must be verified to setup a group.')
		const numbers = new RegExp('^[0-9]+$');

		const groupid = await editStart(message, {
			title: 'Group Setup',
			description: 'What is the **ID** of the group?\nThis will wipe all bindings for the group with this id or previous main group.\n\nRespond **cancel** to cancel'
		});

		if (!groupid) return message.error('Setup has timed out.');
		if (groupid.content.toLowerCase() === 'cancel') { groupid.message.delete({ timeout: 10 }); return message.channel.send('Cancelled');}
		const numbercheck = numbers.test(groupid.content);
		if (numbercheck === false) {
			return message.error(
			'Please give a valid group ID.'
			);
		}
		const groupId = parseInt(groupid.content)
		try {
			const checkGroupOwner = await getGroup(groupId)
			if (checkGroupOwner.owner.userId !== ownerUser.primary_account) return message.error(
				'You must be the owner of a group to set it as your main group bind.'
			)
		}
		catch {
			return message.error('Could not find the given group.')
		}

		const newGroupObject: RoleBindGroup = {
			id: groupId,
			main: true,
			binds: []
		}

		let binding = false;
		// Ask them if they want to bind the guild ranks
		const askToBind = embed(
			'Rank Binding',
			`Would you like to bind your group ranks to the Server?\n*Note:* If you do not create them now, you can create them later with the command \`${guild.prefix}bind group [rank] [tag: tag or none] [role, roles]\`\n\nRespond \`yes\` or \`no\`\nRespond **cancel** to cancel.`,
			guild,
			'def', false,
		);
		const bindingask = await editPrompt(message, groupid.message, askToBind, 'lower');
		if (!bindingask) return message.error('Setup Timeout') ;
		// Check their response
		if (bindingask.startsWith('y')) {binding = true;}

		if (bindingask === 'cancel') { 
			groupid.message.delete({ timeout: 10 }); 
			return message.channel.send('**Cancelled Setup**');
		}
		
		let binds: GroupBinds[] = [];
		if (binding === true) {
			// Ask them to bind if true
			const bindingPrompt = embed(
				'Group Setup',
				'Would you like me to ``merge`` or ``replace`` your group ranks?\n**This will not delete any roles associated with the bot, such as: assetbinds, gamepassbinds and moderation roles.**\n\n Say `cancel` to cancel.',
				guild,
				'def',
				false,
			);
			const rankask = await editPrompt(message, groupid.message, bindingPrompt, 'lower');
			const groupRoles = await getRoles(parseInt(groupid.content))
			if (rankask === 'merge') {
				const createRoleBinds = await createRoles(
					message,
					groupid.message,
					groupRoles
				);
				if (!createRoleBinds) return message.error(
					'There was an error creating binds for this group. Make sure I have the manage roles permission.'
					);
				binds = createRoleBinds
			}
			if (rankask === 'replace') {
				const deleteRolesThenBind = await deleteRoles(message, groupid.message, groupRoles)
				if (!deleteRolesThenBind) return message.error(
					'There was an error creating binds for this group. Make sure I have the manage roles permission.'
					);
				binds = deleteRolesThenBind
			}
		}
		if (binding == true) newGroupObject.binds = binds
	
		// Ask them if they want to change the Verified Role
	
		const setup2 = embed(
			'Group Setup',
			'Would you like to change the Verified role to something else? \n\nRespond `yes` or `no` or `skip` to skip\nRespond `cancel` to cancel.',
			guild,
		);
		const verifiedcheck = await editPrompt(message, groupid.message, setup2, 'lower');

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		let verifiedRole: any;
		if (!verifiedcheck || verifiedcheck === 'cancel') {return message.channel.send('**Cancelled Setup**');}

		if (verifiedcheck.startsWith('y')) {
			const customRole = await customVerificationRole(message, groupid.message)
			if (!customRole) return message.error('Cancelled due to no response.')
			verifiedRole = customRole
		}
		if (verifiedcheck.startsWith('n')) {
			verifiedRole = await createVerificationRole(message.guild);
		}
		if (verifiedcheck === 'skip') verifiedRole = 'skipped';

	
		const setup4 = embed(
			'Group Setup Complete',
			`You're Discord has been successfully bound to group \`${groupid.content}\`
			Verified Role: ${verifiedRole.name}
			Bound Roles: ${newGroupObject.binds.length}`,
			guild,
		);
		
		const groupThumb = await thumbnail(groupid.content, 512, 'group')
		setup4.setThumbnail(groupThumb);

		const verification = await this.bot.handlers.verification.settings.fetch(message.guild.id)
		const previousMainGroup = verification.role_binds.find(group => group.id == groupId || group.main == true)
		if (previousMainGroup) verification.role_binds.splice(verification.role_binds.indexOf(previousMainGroup))
		verification.verified_role = verifiedRole.id
		verification.role_binds.push(newGroupObject)
		await verification.save()

		return groupid.message.edit(setup4);
	}
}
