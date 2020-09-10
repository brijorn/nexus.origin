const formats = require('../../json/formats.json');
const excbadges = require('../../json/badges.json');
module.exports = async (user) => {
	let userbadges = user.badges;
	userbadges = userbadges.replace('verified', '<:verified:741302789594153040>');
	await excbadges.userarray.forEach(obj => {
		if (obj.array.includes(user.userID)) {
			userbadges = userbadges + ' ' + obj.badge;
		}
	});

	return userbadges;
};