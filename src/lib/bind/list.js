const pagination = require('../forEachPagination');
const { MessageEmbed, Message } = require('discord.js');
/**
 *
 * @param { Object } binds
 * @param { Message } message
 */
exports.menu = async function(message, binds) {
	console.log(binds);
	const menu = new MessageEmbed()
		.setTitle('Server Bindings');
	for (let i = 0;i < binds.RoleBinds.length; i++) {
		const group = binds.RoleBinds[i];
		const name = (group.main === true) ? `📌${group.id}` : group.id;
		menu.addField(name, `Type: **Group**\nBindings: **${group.binds.length}**`, true);
	}
	for (let i = 0; i < binds.AssetBinds.length && binds.AssetBinds; i++) {
		const asset = binds.AssetBinds[i];
		menu.addField(asset.assetId, `
        Type: **Asset**
        Nickname: **${asset.nickname}**
        Hierarchy: **${asset.hierarchy}**
        Roles: **${asset.roles.length}**`, true);
	}
	message.channel.send(menu);
};