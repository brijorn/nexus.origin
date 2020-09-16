const formats = require('../../json/formats.json');

module.exports = async (message, guild, newUsername, roleInfo, type = 'Def') => {
	format = guild.verificationSettings.nicknameFormat;
	if (format === 'default') format = guild.verificationSettings.nicknameFormat;

	formats.nicknameformats.forEach(each => {
		if (format.includes(each.name)) {
			format = format.replace(each.name, eval(each.changeto));
		}
	});
	const special = (type === 'rank') ? formats.rank : formats.asset;
	special.forEach(each => {
		if (format.includes(each.name)) {
			format = format.replace(each.name, eval(each.changeto));
		}
	});
	const which = (type === 'Def') ? message.member : message;
	which.setNickname(format)
		.catch((err) => {return;});
	return format;
};