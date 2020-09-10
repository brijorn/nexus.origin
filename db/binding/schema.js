const db = require('../');
const { Message } = require('discord.js');
/**
 *
 * @param { Message } message
 */
exports.get = async function(message) {
	const info = db.withSchema('modules').table('bindings')
		.where('guild_id', '=', BigInt(message.guild.id))
		.then(async res => {
			if (!res[0]) {
				db.withSchema('modules').table('bindings')
					.insert({
						guild_id: BigInt(message.guild.id),
						RoleBinds: [],
						AssetBinds: [],
						GamePassBinds: [],
						RankBinds: [],
					});
			}
			else {return res[0];}
		});
	return info;
};

/**
 *
 * @param { Message } message
 */
exports.add = async function(message, newObj, type) {
	console.log(newObj);
	const obj = JSON.stringify(newObj);
	console.log(obj);
	const query = await db.raw(`
    UPDATE "modules"."bindings" SET "${type}" = (
        CASE
            WHEN "${type}" IS NULL THEN '[]'::JSONB
            ELSE "${type}"
        END
    ) || '[${obj}]'::JSONB WHERE guild_id = ?;
    `, [message.guild.id]);
	console.log(query);
};

exports.remove = async function(message, newObj, type, id) {
	console.log(id);
	const query = await db.raw(`
    UPDATE "modules"."bindings"
    SET "AssetBinds" = "AssetBinds" #- coalesce(('{AssetBinds,' || (
            SELECT i
              FROM generate_series(0, jsonb_array_length("AssetBinds") -1) AS i
             WHERE ("AssetBinds"->i->'assetId' = '${id}')
         ) || '}')::text[], '{}') WHERE guild_id = ?;
    
    `, [message.guild.id]);
};

