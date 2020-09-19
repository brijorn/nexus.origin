import pagination from '../forEachPagination';
import { MessageEmbed, Message } from 'discord.js';
import { VerificationSettings } from '../../db/verification/types';


export default async function menu(message: Message, verification: VerificationSettings) {
	const menu = new MessageEmbed()
		.setTitle('Server Bindings');
	for (let i = 0;i < verification.roleBinds.length; i++) {
		const group = verification.roleBinds[i];
		const name = (group.main === true) ? `📌${group.id}` : group.id;
		menu.addField(name, `Type: **Group**\nBindings: **${group.binds.length}**`, true);
	}
	for (let i = 0; i < verification.assetBinds.length && verification.assetBinds; i++) {
		const asset = verification.assetBinds[i];
		menu.addField(asset.assetId, `
        Type: **Asset**
        Nickname: **${asset.nickname}**
        Hierarchy: **${asset.hierarchy}**
        Roles: **${asset.roles.length}**`, true);
	}
	message.channel.send(menu);
};