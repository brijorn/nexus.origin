const embed = require("../../embed");
const { MessageEmbed } = require("discord.js");

module.exports = async (bot, message, guild, mainpage, mainpageembed) => {
    mainpage.react('➡️')
    let page = 0
    const secondpage = new MessageEmbed()
    .setTitle(mainpageembed.title)
    .setDescription(mainpageembed.description)
    .setColor(mainpageembed.color)
const filter = (reaction, user) => {
	return ['⬅️', '➡️'].includes(reaction.emoji.name) && user.id === message.author.id;
};
const collector = mainpage.createReactionCollector(filter, { time: 60000 });

collector.on('collect', async (reaction, user) => {
	if (page === 0 && reaction.emoji.name === '➡️') {
        page = 1
        await mainpage.reactions.cache.map(each => each.remove())
        mainpage.edit(secondpage)
        mainpage.react('⬅️')
    }
    if (page === 1 && reaction.emoji.name === '⬅️') {
        page = 0
        await mainpage.reactions.cache.map(each => each.remove())
        mainpage.edit(mainpageembed)
        mainpage.react('➡️')
    }
});

collector.on('end', async collected => {
    await mainpage.reactions.cache.map(each => each.remove())
    mainpage.edit(embed('none', 'Page has timed out.', guild))
});

}