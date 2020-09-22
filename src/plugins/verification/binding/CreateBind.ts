import {
	FetchedVerification,
	NewAssetBindInterface,
    GuildSettings,
    AssetBindType
} from "@lib/origin";

import { Client, Message } from "discord.js";
import embed from "functions/embed";
import { getProductInfo, ProductInfo } from "noblox.js";
export async function NewAssetBind(
	bot: Client,
	message: Message,
	guild: GuildSettings,
	verification: FetchedVerification,
	newBindObject: NewAssetBindInterface
) {
	// Check if the roles Exist
	const roles: string[] = [];
	const missingRoles: string[] = [];
	for (let value of newBindObject.roles) {
		if (value.startsWith("<@&") && value.endsWith(">")) {
            value = value.substring(3)
            value = value.substring(0, value.length - 1);
            console.log(value)
			if (message.guild!.roles.cache.get(value)) roles.push(value);
			else missingRoles.push(value);
        } 
        else if (isNaN(value as any) == false) {
			if (message.guild!.roles.cache.get(value)) roles.push(value);
			else missingRoles.push(value);
		}
		else if (isNaN(value as any) == true) {
			if (message.guild!.roles.cache.find((role) => role.name === value))
				roles.push(value);
			else missingRoles.push(value);
		}
	}

    // Check if the asset exists
    let asset: ProductInfo;
    try {
        asset = await getProductInfo(newBindObject.assetId)
    }
    catch {
        return message.channel.send(
			embed(
				"Error",
				`Asset with ID of ${newBindObject.assetId} was not found.`,
				guild,
				"failure"
			)
		);
    }


    const AssetbindObject: AssetBindType = {
        assetId: newBindObject.assetId,
        hierarchy: newBindObject.hierarchy,
        nickname: newBindObject.nickname,
        roles: roles
    }

    if (roles.length > 0) {
        // The old bindings combined with the new one
        const newObject = verification[newBindObject.type + '_binds'].push(AssetbindObject)

        // await verification.update(newBindObject.type + '_binds', newObject)
        await message.channel.send(
            embed(
                'Bind Successfully Created',
                `A binding has successfully been created for the asset **${asset.Name}(${asset.AssetId})** by ${asset.Creator.Name}
                Hierarchy: ${AssetbindObject.hierarchy}
                Nickname: ${AssetbindObject.nickname}
                ${(roles.length > 1)?'Roles':'Role'}: ${roles.map(role => `${message.guild!.roles.cache.get(role)!.name}(${role})`).join(', ')}
                `,
                guild, 'success', true, true
            )
        );
    }
    if (missingRoles.length > 0) {
        message.channel.send(
            embed(
                'Missing Roles',
                `The following roles were not found:\n\`${missingRoles.join(', ')}\``,
                guild, 'failure'
            )
        )
    }

    return

}
