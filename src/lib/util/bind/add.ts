import embed from "../../../functions/embed";
import rbx from "noblox.js";
import { Message, MessageEmbed } from "discord.js";
import { VerificationSettings } from "../../../db/types/verification";
import GuildSettings from "../../../db/guild/guild";
import parse from '../parse'

export async function addAsset(
	message: Message,
	guild: GuildSettings,
	verification: VerificationSettings,
	type: keyof VerificationSettings,
	option: "add" | "remove",
	assetId: number,
	nickname: string,
	hierarchy: number,
	roles: string[]
) {
	let product: any;
	if (
		verification[type] &&
		verification.assetBinds.find((a) => a.assetId === assetId)
	)
		return message.channel.send(
			embed(
				"none",
				"Binding already exists for this asset.",
				guild,
				"failure",
				false
			)
		);

	try {
		product = await rbx.getProductInfo(assetId);
	} catch {
		return message.channel.send(
			embed(
				"none",
				`${type} not found, make sure you gave a valid Roblox Asset`,
				guild,
				"failure",
				false
			)
		);
	}

	const found: string[] = [];
	for (let i = 0; i < roles.length; i++) {
		const role = roles[i];
		const parser = await parse.role(message, role)
		if (parser!.state === true) {
			found.push(parser!.value);
		}
	}
	const assetObj = {
		assetId: assetId,
		nickname: nickname,
		hierarchy: hierarchy,
		roles: found,
	};
	// Save to Database
	const bindObject = verification[type] as object[];
	bindObject.push(assetObj);
	await verification.update(message.guild!.id, type, bindObject);
	console.log('done')
	return message.channel.send(
		embed(
			"none",
			`Successfully added the asset **${product.Name}(${assetId})** by ${product.Creator.Name} to the assetBinds list.`,
			guild,
			"success"
		)
	);
}

export async function addGroup(
	message: Message,
	guild: GuildSettings,
	verification: VerificationSettings,
	groupid: number,
	ranks: string[],
	nickname: string,
	hierarchy: number,
	roles: string[]
) {
	let group: any;
	nickname = nickname.replace("'", "");
	nickname = nickname.replace("'", "");
	try {
		group = await rbx.getGroup(groupid);
	} catch {
		return message.channel.send(
			embed(
				"none",
				`Could not find the given group with an id of ${groupid}`,
				guild,
				"failure",
				false,
				false
			)
		);
	}
	const foundroles = [];
	for (let b = 0; b < roles.length; b++) {
		const therole = roles[b];
		if (message.guild!.roles.cache.find((r) => r.id === therole))
			foundroles.push(therole);
	}
	const groupranks = await rbx.getRoles(groupid);
	const foundranks = [];
	for (let i = 0; i < ranks.length; i++) {
		const rank = parseInt(ranks[i]);
		if (groupranks.find((a) => a.rank === rank)) {
			const found = groupranks.find((a) => a.rank === rank);
			foundranks.push(found);
		}
	}
	const newgroupObj = {
		id: group.id,
		main: false,
		binds: [],
	};
	if (!verification.roleBinds.find((o) => o.id === groupid))
		verification.roleBinds.push(newgroupObj);
	const groupobj = verification.roleBinds.find((o) => o.id === groupid);

	for (let i = 0; i < foundranks.length; i++) {
		const rank: any = foundranks[i];

		const rankObj: {
			id: number;
			rank: number;
			nickname: string;
			roles: string[];
			hierarchy: number;
		} = {
			id: rank!.id,
			rank: rank!.rank,
			nickname: nickname,
			roles: foundroles,
			hierarchy: hierarchy,
		};

		groupobj!.binds.push(rankObj as never);
	}

	await verification.update(
		message.guild!.id,
		"roleBinds",
		verification.roleBinds
	);
	if (foundranks.length < 6) {
		const endembed = new MessageEmbed()
			.setTitle("Binding Finished")
			.setDescription("Successfully bound the following roles.");
		for (let i = 0; i < foundranks.length; i++) {
			const foundrank = foundranks[i];
			endembed.addField(
				foundrank!.name,
				`**Id:** ${foundrank!.id}\n**Rank:** ${
					foundrank!.rank
				}\n**Roles:** ${foundroles
					.map((e) => `${e}`)
					.join(", ")}\n**Nickname:** ${nickname}\n**Hiearchy:** ${hierarchy}`,
				true
			);
		}
		return message.channel.send(endembed);
	} else {
		return message.channel.send(
			`Successfully bound the given ranks, to view your binds run the command \`${guild.prefix}binds view group [Optional: groupid]\``
		);
	}
}
