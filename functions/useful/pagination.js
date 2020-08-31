const embed = require('../embed')
const { MessageEmbed } = require("discord.js");
const { enabled, disabled } = require('../../config.json')
module.exports = async (bot, message, args, guild, firstpage, funcToRun, array) => {

    const pages = await funcToRun(firstpage, array)
    const maxpage = pages.length - 1
    let page = 1
    const mainpage = await message.channel.send(firstpage)
    mainpage.react('⬅️')
    mainpage.react('➡️')

    const filter = (reaction, user) => {
        return ['⬅️', '➡️'].includes(reaction.emoji.name) && user.id === message.author.id;
    };

    const collector = mainpage.createReactionCollector(filter, { time: 60000 });
    collector.on('collect', async (reaction, user) => {
        reaction.users.remove(message.author.id)
        if (reaction.emoji.name === '➡️') {
            if (!pages[page + 1]) return
            page = page + 1
            pages[page].setFooter(`Page ${page} / ${maxpage}`)
            mainpage.edit(pages[page])
        }
        if (reaction.emoji.name === '⬅️') {
            if (page - 1 < 1) return
            page = page - 1
            pages[page].setFooter(`Page ${page} / ${maxpage}`)
            mainpage.edit(pages[page])
        }
    })
    collector.on('end', async collected => {
        await mainpage.reactions.cache.map(each => each.remove())
        mainpage.edit(embed('Timeout', 'Points has timed out.', guild))
    });
}