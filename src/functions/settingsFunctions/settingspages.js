const { enabled, disabled } = require('../../config.json');
const db = require('../../db');
module.exports = async (bot, message, args, guild) => {

	// Get guild's data from tales

	const verf = await db.withSchema('modules').table('verification').where('guild_id', message.guild.id).first();
	const binding = await db.withSchema('modules').table('bindings').where('guild_id', message.guild.id).first();
	const suggest = await db.withSchema('modules').table('suggestion_config').where('guild_id', message.guild.id).first();

	// GLOBAL
	const prefix = guild.prefix;

	// Roblox Binding Object
	console.log(guild.gamepassBinds);
	const robloxGroup = binding.RoleBinds.find(o => o.main === true);
	const assetBindings = (binding.AssetBinds.length > 0) ? binding.AssetBinds.map(obj => `${obj.name} : ${obj.assetID} : <@&${obj.roleID}>`) : 'None';
	const gamepassBindings = (binding.GamePassBinds && binding.GamePassBinds.length > 0) ? binding.GamePassBinds.map(obj => `${obj.name} : ${obj.assetID} : <@&${obj.roleID}>`) : 'None';
	const rankBindings = (binding.RankBinds && binding.RankBinds.length > 0) ? binding.RankBinds.map(obj => `${obj.name} : ${obj.assetID} : ${obj.rank}`) : 'None';
	const tokenStatus = (!guild.robloxToken || guild.robloxToken === '') ? `${disabled} None` : `${enabled} Given`;
	const roblox = {
		group: robloxGroup,
		assetBnd: assetBindings,
		gameBnd: gamepassBindings,
		rankBnd: rankBindings,
		token: tokenStatus,
	};
	// Suggestions and Application Information
	const suggestionInfo = guild.suggestionInfo;
	const sgststatus = (suggestionInfo && suggestionInfo.enabled === true) ? `${enabled} Enabled` : `${disabled} Disabled`;
	const sgstchannel = (suggestionInfo && suggestionInfo.channel) ? `\nChannel: <#${suggestionInfo.channel}>` : '';
	const sugCool = (suggestionInfo && suggestionInfo.enabled && suggestionInfo.enabled === true) ? `\nCooldown: \`${suggestionInfo.cooldown / 1000} seconds\`` : '';
	sgstInfo = {
		status: sgststatus,
		channel: sgststatus,
		cooldown: sugCool,
	};
	const points = guild.points;
	const pntstatus = (points && points.enabled === true) ? `${enabled} Enabled` : `${disabled} Disabled`;
	const pntInfo = {
		status: pntstatus,
	};
	const app = guild.applications;
	const appstatus = (app && app.enabled === true) ? `${enabled} Enabled` : `${disabled} Disabled`;
	const appInfo = {
		status: appstatus,
	};

	// Moderation Object
	const mod = guild.moderation;
	const modstatus = (mod && mod.enabled === true) ? `${enabled} Enabled` : `${disabled} Disabled`;
	const modrole = (mod && mod.modrole) ? mod.modrole.map(c => `${c} - ${message.guild.roles.cache.get(c)}`).join(', ') : 'None';
	const modlog = (mod && mod.modlog) ? `${mod.modlog} - <#${mod.modlog}>` : 'none';
	const mutedrole = (mod && mod.mutedrole) ? `${mod.mutedrole} - <@&${mod.mutedrole}>` : 'none';
	const cases = (mod) ? mod.cases : '0';
	const modInfo = {
		status: modstatus,
		modrole: modrole,
		mutedrole: mutedrole,
		cases: cases,
		modlog: modlog,
	};

	// Logging Object
	const log = guild.logging;
	const logstatus = (log && log.enabled === true) ? `${enabled} Enabled` : `${disabled} Disabled`;
	const avArray = ['moderation', 'ranking'];
	const enabledSetting = (log && log.settings.length > 0) ? log.settings.map(each => { if (each.status === true) return `${each.name}`; }) : 'None';
	const available = avArray.filter(a => !enabledSetting.includes(a));
	const avList = available.map(e => `${e}`).join(', ');
	const logInfo = {
		status: logstatus,
		enabledSettings: enabledSetting,
		available: avList,
	};


	return {
		roblox,
		sgstInfo,
		pntInfo,
		appInfo,
		modInfo,
		logInfo,

	};
};