import { Message } from "discord.js";
import GuildSettings from "../../../db/guild/guild";
import { AssetBindType, VerificationSettings } from "../../../db/types/verification";

import embed from '../../../functions/embed';
export async function removeAsset(message: Message, guild: GuildSettings, verification: VerificationSettings, option: (keyof VerificationSettings), id: number) {
	
	const setting = verification[option] as any[]
	
	let obj: any;
	obj = await setting.find((o: any) => o.assetId === id.toString());

	if (!obj) return message.channel.send(embed('none', `Could not find a ${option} binding with the Id of ${id}`, guild, 'failure', false));
	
	setting.splice(
		setting.indexOf(obj), 1
	);

	await verification.update(message.guild!.id, option, setting)

	return message.channel.send(embed('none', `Successfully deleted ${id} from ${option} bindings.`, guild, 'success', false));
};

exports.removeGroup = async function(message: Message, guild: GuildSettings, verification: VerificationSettings, option: (keyof VerificationSettings), id: number) {
	const setting = verification[option] as any[]

	const obj = setting.find(a => a.id === id);
	
	if (!obj) return message.channel.send(embed('none', `Could not find a ${option} binding with the Id of ${id}`, guild, 'failure', false));
	
	setting.splice(
		setting.indexOf(obj), 1
	)
	
	await verification.update(message.guild!.id, option, setting)
	return message.channel.send(embed('none', `Successfully deleted ${id} from ${option} bindings.`, guild, 'success', false));
};