const embed = require('../../functions/embed')
const config = require('../../config.json')
const { MessageEmbed } = require('discord.js')
const guildModel = require('../../models/guildModel/guild')

module.exports.run = async (bot, message, args, guild) => {
    function fancyTimeFormat(duration)
{   
    // Hours, minutes and seconds
    var hrs = ~~(duration / 3600);
    var mins = ~~((duration % 3600) / 60);
    var secs = ~~duration % 60;

    // Output like "1:01" or "4:03:59" or "123:03:59"
    var ret = "";

    if (hrs > 0) {
        ret += "" + hrs + " hours " + (mins < 10 ? "0" : "");
    }

    ret += "" + mins + " minutes and " + (secs < 10 ? "0" : "");
    ret += "" + secs + "";
    return ret;
}
    console.log(bot.suggestionCooldown)
    if (bot.suggestionCooldown.has(message.author.id)) {
        return message.channel.send(embed('Cooldown', `The suggestion command can only be used once every \`${fancyTimeFormat(guild.suggestionInfo.cooldown / 1000)} seconds.\``, guild));
} else {


    // Adds the user to the set so that they can't talk for a minute
    bot.suggestionCooldown.set(message.author.id);
    setTimeout(() => {
      // Removes the user from the set after a minute
      bot.suggestionCooldown.delete(message.author.id);
    }, guild.suggestionInfo.cooldown);
}
    if (guild.suggestionInfo.enabled === false || !guild.suggestionInfo) return message.reply(embed('none', 'Suggestions are not enabled for this guild.', config.failure))
    else {
        const content = args.slice(0).join(' ')
        if (content.length <= 5) return message.reply(embed('none', 'Suggestions must be more than 5 words long.'))
        const channel = message.client.channels.cache.get(guild.suggestionInfo.channel)
        const suggestion = new MessageEmbed()
        .setTitle('Suggestion')
        .setAuthor(`${message.author.username}#${message.author.discriminator}`, message.author.avatarURL())
        .setDescription(content)
        .setFooter('Nexus Origin')
        .setTimestamp()
        channel.send(suggestion).then(msg => {
            msg.react('739276114542985278')
            msg.react('739276149800304643')
        })
    }
}

module.exports.help = {
    name: 'suggest',
    module: 'user',
    description: 'Send a suggestion to the guild suggestions chanenl',
    syntax: ['!suggest suggestion'],
    inDepth: 'Send a suggestion to the guild suggestions chanenl, requires suggestions to be enabled with a channel'

}