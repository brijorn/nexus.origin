const Discord = require('discord.js')
const pmprompt = require('../../prompt/index').pmprompt
const guildModel = require('../../models/guildModel/guild')
const embed = require('../../functions/embed')
module.exports.run = async (bot, message, args, guild) => {
    const tokenprompt = embed('Token Prompt', 'What is the .ROBLOSECURITY for the account?\n\nIf you don\'t know what that is, look it up.\n\nTo cancel respond **cancel**', guild)
    .setFooter('We will never look at nor share this. Feel free to delete your message after.')
    const ask = await pmprompt(message, tokenprompt)
    const res = ask.content.toLowerCase()
    if (res === 'cancel') return message.author.send(embed('none', 'Cancelled.', guild))
    if (ask.content.startsWith('_|WARNING:') === false) return message.author.send(embed('none', 'Token Authentication Failed: Please provide a valid token.', '#e02222', guild))
    await guildModel.findOne({ guildID: message.guild.id}, function(err, info) {
        if (!info) {return message.author.send('Could not Load Document')}
        else {
            info.robloxToken = ask.content
        }
        info.save(function(err) {
            if (err) {console.log(err)}
        });
    })
    const successful = new Discord.MessageEmbed()
    .setDescription('Token Successfully updated. Delete the mesage for safety purposes.')
    .setColor('#4eed4e')
    message.author.send(successful)


    }

module.exports.help = {
    name: 'token',
    module: 'settings',
    description: 'Token for the account used for ranking etc.'
}