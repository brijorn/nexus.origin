const db = require('..');


exports.add = async function(message, amount, msg) {
	await db.withSchema('logs').table('suggestion_log').where('case', '<', 10)
		.insert({
			guild_id: BigInt(message.guild.id),
			case: amount,
			message_id: BigInt(msg.id),
			channel_id: BigInt(msg.channel.id),
		});
	console.log('done');
};
exports.get = async function() {
	console.log('hi');
};
