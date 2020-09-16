const embed = require('../../functions/embed');
const rbx = require('noblox.js');
const fetch = require('node-fetch');
const { MessageEmbed } = require('discord.js');
const bind = require('../../db/binding/schema');
exports.addAsset = async function(message, guild, type, option, assetId, nickname, hierarchy, roles) {
	const binds = await bind.get(message);
	let product = '';
	if (bind.AssetBinds && binds.AssetBinds.find(a => a.assetId === assetId)) return message.channel.send(embed('none', 'Binding already exists for this asset.', guild, 'failure', false));
	try {product = await rbx.getProductInfo(assetId);}
	catch { return message.channel.send(embed('none', `${type} not found, make sure you gave a valid Roblox Asset`, guild, 'failure', false));}
	const found = [];
	for(i = 0; i < roles.length; i++) {
		const role = roles[i];
		if (!message.guild.roles.cache.get(role)) return;
		else found.push(role);
	}
	const assetObj = {
		assetId: assetId,
		nickname: nickname,
		hierarchy: hierarchy,
		roles: found,
	};
	// Save to Mongo
	await bind.add(message, assetObj, 'AssetBinds');
	return message.channel.send(embed('none', `Successfully added the asset **${product.Name}(${assetId})** by ${product.Creator.Name} to the assetBinds list.`, guild, 'success'));

};

exports.addGroup = async function(message, guild, type, option, groupid, ranks, nickname, hierarchy, roles) {
	let group = '';
	hierarchy = parseInt(hierarchy);
	nickname = nickname.replace('\'', '');nickname = nickname.replace('\'', '');
	try {group = await rbx.getGroup(groupid);}
	catch { return message.channel.send(embed('none', `Could not find the given group with an id of ${groupid}`, guild, 'failure', false, false));}
	const foundroles = [];
	for (b = 0; b < roles.length; b++) {
		const therole = roles[b];
		if (message.guild.roles.cache.find(r => r.id === therole)) foundroles.push(therole);
	}
	const groupranks = await rbx.getRoles(groupid);
	const foundranks = [];
	for (i = 0; i < ranks.length; i++) {
		const rank = parseInt(ranks[i]);
		console.log(groupranks.find(a => a.rank === rank));
		if (groupranks.find(a => a.rank === rank)) {
			const found = groupranks.find(a => a.rank === rank);
			foundranks.push(found);
		}
	}
	const newgroupObj = {
		id: group.id,
		main: false,
		binds: [],
	};
	const groupobj = (guild.roleBinds.find(o => o.id === groupid)) ? guild.roleBinds.find(o => o.id === groupid) : newgroupObj;
	for (i = 0; i < foundranks.length; i++) {
		const rank = foundranks[i];
		console.log(rank);
		const rankObj = {
			id: rank.ID,
			rank: rank.rank,
			nickname: nickname,
			roles: foundroles,
			hierarchy: hierarchy,
		};
		groupobj.binds.push(rankObj);
	}
	await bind.add(message, assetObj, 'AssetBinds')
		.catch((err) => {console.log(err);});
	if (foundranks.length < 6) {
		const endembed = new MessageEmbed()
			.setTitle('Binding Finished')
			.setDescription('Successfully bound the following roles.');
		for (i = 0; i < foundranks.length; i++) {
			foundrank = foundranks[i];
			endembed.addField(foundrank.name, `**Id:** ${foundrank.ID}\n**Rank:** ${foundrank.rank}\n**Roles:** ${foundroles.map(e => `${e}`).join(', ')}\n**Nickname:** ${nickname}\n**Hiearchy:** ${hierarchy}`, true);
		}
		return message.channel.send(endembed);
	}
	else {
		return message.channel.send(`Successfully bound the given ranks, to view your binds run the command \`${guild.prefix}binds view group [Optional: groupid]\``);
	}
};
