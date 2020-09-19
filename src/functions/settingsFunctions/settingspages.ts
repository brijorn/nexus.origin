import { Client, Message } from "discord.js";
import GuildSettings from "../../db/guild/types";
import { VerificationSettings } from "../../db/verification/types";

import { enabled, disabled } from '../../config.json';
import db from '../../db/index';

module.exports = async (bot: Client, message: Message, args: string[], guild: GuildSettings) => {

	// Get guild's data from tales

	const verif = await new VerificationSettings().get(message.guild!.id)
	const suggest = await db.withSchema('modules').table('suggestion_config').where('guild_id', message.guild!.id).first();

	// GLOBAL
	const prefix = guild.prefix;

	// Roblox Binding Object
	const robloxGroup = verif.roleBinds.find(o => o.main === true);
	const tokenStatus = (!guild.token || guild.token === '') ? `${disabled} None` : `${enabled} Given`;
	const roblox = {
		group: robloxGroup,
		token: tokenStatus,
	};
	// Suggestions and Application Information
	/*
	const suggestionInfo = guild.suggestionInfo;
	const sgststatus = (suggestionInfo && suggestionInfo.enabled === true) ? `${enabled} Enabled` : `${disabled} Disabled`;
	const sgstchannel = (suggestionInfo && suggestionInfo.channel) ? `\nChannel: <#${suggestionInfo.channel}>` : '';
	const sugCool = (suggestionInfo && suggestionInfo.enabled && suggestionInfo.enabled === true) ? `\nCooldown: \`${suggestionInfo.cooldown / 1000} seconds\`` : '';
	sgstInfo = {
		status: sgststatus,
		channel: sgststatus,
		cooldown: sugCool,
	};
	*/
	/*
	const points = guild.points;
	const pntstatus = (points && points.enabled === true) ? `${enabled} Enabled` : `${disabled} Disabled`;
	const pntInfo = {
		status: pntstatus,
	};
	*/
	/*
	const app = guild.applications;
	const appstatus = (app && app.enabled === true) ? `${enabled} Enabled` : `${disabled} Disabled`;
	const appInfo = {
		status: appstatus,
	};
	*/
	// Moderation Object
	/*
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
	*/
	// Logging Object
	/*
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
	*/

	return {
		roblox,
		// sgstInfo,
		// pntInfo,
		// appInfo,
		// modInfo,
		// logInfo,

	};
};