const embed = require('../../functions/embed');
const bind = require('../../db/binding/schema');
exports.removeAsset = async function(message, guild, option, type, id) {
	console.log('here');
	const binds = await bind.get(message);
	let obj = '';
	let array = '';
	if (option === 'asset') array = binds.AssetBinds;
	if (option === 'gamepass') array = binds.GamePassBinds;
	if (option === 'rank') array = binds.RankBinds;
	obj = array.find(o => o.assetId === id);
	if (!obj) return message.channel.send(embed('none', `Could not find a ${option} binding with the Id of ${id}`, guild, 'failure', false));
	await bind.remove(message, obj, 'RoleBinds', id);
	return message.channel.send(embed('none', `Successfully deleted ${id} from ${option} bindings.`, guild, 'success', false));
};

exports.removeGroup = async function(message, guild, option, type, id) {
	const obj = guild.roleBinds.find(a => a.id === id);
	if (!obj) return message.channel.send(embed('none', `Could not find a ${option} binding with the Id of ${id}`, guild, 'failure', false));
	await bind.remove(message, obj, 'AssetBinds', id);
	return message.channel.send(embed('none', `Successfully deleted ${id} from ${option} bindings.`, guild, 'success', false));
};