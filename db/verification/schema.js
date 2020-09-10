const db = require('../');

exports.create = function(message) {
	const guild = db.withSchema('modules').table('verification').where('guild_id', '=', message.guild.id)
		.then(async res => {
			if (!res[0]) {
				console.log('here');
				const info = db.withSchema('modules').table('verification')
					.insert({
						guild_id: BigInt(message.guild.id),
						enabled: true,
						VerifiedRole: '',
						UnVerifiedRole: '',
						AutoVerify: false,
						NicknameFormat: '{{robloxname}}',
						DmVerification: false,
						Roles: {
							BypassNickname: '',
							Update: '',
						},
					});
				return info;
			}
			else {return res[0];}
		});
	return guild;
};

exports.get = async function(message) {
	const guild = await exports.create(message);
	return guild;
};