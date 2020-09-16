module.exports = async (message, args, slice = true) => {
	let mentioned = '';
	if (args[0].startsWith('<@') && args[0].endsWith('>')) {
		const channelb = args[0].substring(3);
		const finished = channelb.substring(0, channelb.length - 1);
		console.log(finished);
		mentioned = message.guild.members.cache.get(finished);
		return mentioned;
	}
	if (isNaN(args[0]) === false) {
		mentioned = message.guild.members.cache.get(args[0]);
		if (mentioned === undefined && returnNum === true) mentioned = args[0];
	}
	if (!(args[0].startsWith('<@') && !args[0].endsWith('>')) && isNaN(args[0]) === true) {
		async function findUser(givenuser) {
			givenuser = givenuser.toLowerCase();
			let founduser = undefined;
			message.guild.members.cache.find(user => {
				if (user.nickname === null) {
					if (user.user.username.toLowerCase() === givenuser) return founduser = user;
				}
				if (user.nickname !== null) {
					if (user.nickname.toLowerCase() === givenuser) return founduser = user;
					if (user.user.username.toLowerCase() === givenuser) return founduser = user;
				}
			});
			return founduser;
		}
		const givenuser = (args.length > 1 && slice === true) ? args.slice(0).join(' ') : args[0];
		mentioned = await findUser(givenuser);
		if (!mentioned) return;
	}
	return mentioned;
};