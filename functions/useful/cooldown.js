const Discord = require('discord.js')
module.exports = async (message, cooldowns, command, prefix) => {
    let status = false
    if (!command.help.cooldown) return status
if (!cooldowns.has(command.help.name)) {
		cooldowns.set(command.help.name, new Discord.Collection());
    }
    

	const now = Date.now();
	const timestamps = cooldowns.get(command.help.name);
	const cooldownAmount = (command.help.cooldown || 3) * 1000;

	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            status = true
            const cooldownMsg = new Discord.MessageEmbed()
            .setTitle('Slow Down!')
            .setDescription(`Please wait **${timeLeft.toFixed(1)}** second(s) before reusing \`${prefix}${command.help.name}\`\nCommand Cooldown: \`${command.help.cooldown}\``)
            .setFooter('Powered by Nexus Origin')
            return message.reply(cooldownMsg)
		}
	}

	timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    return status
}