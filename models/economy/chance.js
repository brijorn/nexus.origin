const sample = require('lodash.sample');
const { MessageEmbed } = require('discord.js');

exports.minievent = async function(message) {
	const economy = require('./index');
	const i = Math.random();
	if (i < 0.01) {
		const event = sample(events);
		const eventmsg = new MessageEmbed()
			.setTitle('Event!')
			.setColor('#61100c')
			.setDescription(event.description);
		message.channel.send(eventmsg);
		const filter = async m => m.content === event.res && await economy.user.exists({ userId: m.author.id });
		const collector = message.channel.awaitMessages(filter, { max: 1, time: 15000 })
			.then(collected => {
				const message = collected.first();
				const coins = Math.round(Math.random() * (Math.random() > 0.1) ? (500 - 100) : (1000 - 500) + 1);
				const winner = new MessageEmbed()
					.setColor('random')
					.setDescription(`Congratulations ${message.author}, you won the event! Those thugs even has some things on them:\n${economy.coin} ${coins} and [REDACTED]`);
				message.channel.send(winner);
			});
	}
	else {return;}
};

const events = [
	{
		name: 'fight',
		description: 'You got jumped on your way home by some hooligans, say `fight` to defend yourself!',
		res: 'fight',
	},
];

module.exports = {
	minievent: this.minievent,
};