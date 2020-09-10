const { Message } = require('discord.js');
const db = require('../');
/**
 *
 * @param { Message } message
 */
exports.get = function(message) {
	const guild = db.withSchema('modules').table('welcome').where('guild_id', '=', message.guild.id)
		.then(async res => {
			if (!res[0]) {
				const info = await db.withSchema('modules').table('welcome')
					.insert({
						guild_id: BigInt(message.guild.id),
						enabled: false,
						dm: false,
						channel: BigInt(message.channel.id),
						welcome_message: 'none',
						embed: { 'enabled': false, 'title': 'none', 'description': 'none', 'color': 'none', 'thumbnail': 'none', 'image': 'none', 'footer': 'none', 'footerlogo': 'none' },
					})
					.returning('*')
					.then(data => { return data; });
			}
			else {return res[0];}
		});
	return guild;
};

exports.update = async function(message, welcome) {
	const query = await db.withSchema('modules').table('welcome')
		.where('guild_id', '=', message.guild.id)
		.update(welcome);
	return;
};

exports.toggle = async function toggle(guild, message, welcome, type='embeds') {
	const embed = require('../../functions/embed')
    let toggle = (type === 'embeds') ? (welcome.embed.enabled === true) ? false : true : (welcome.enabled === true) ? false : true
	if (type === 'embeds') welcome.embed.enabled = true
	else welcome.enabled = true
    await this.update(message, welcome)
    const state = (toggle === true) ? 'enabled' : 'disabled'
    return message.channel.send(embed(
        'Welcome Embed Configured',
        `Successfully \`${state}\` welcome ${type}`,
        guild, 'success', false, false
    ))
}