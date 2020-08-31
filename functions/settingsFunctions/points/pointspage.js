const embed = require('../../embed')
const { MessageEmbed } = require("discord.js");
const { enabled, disabled } = require('../../../config.json')
module.exports = async (bot, message, args, guild) => {
    function getSystem(firstpage) {
        const values = ['filler', firstpage]
        if (guild.points.amount === 1) {
            const sys = guild.points.systems[0]
            const page2 = new MessageEmbed()
            .setTitle(`${sys.name} System`)
            .setDescription('Systems are not currently editable.')
            .addField('Users', sys.users.length, true)
            .setFooter(`To delete a system run "${prefix}settings points delete <system-name>" This cannot be undone.`)
            return values.push(page2)
        }
        else {
            for (i=0; i < guild.points.systems.length; ++i) {
                console.log(i)
                const found = guild.points.systems[i]
                values[i + 2] = new MessageEmbed()
                .setTitle(`${found.name} System`)
                .setDescription('Systems are not currently editable.')
                .addField('Users', found.users.length, true)
                .setFooter(`To delete a system run "${prefix}settings points delete <system-name>" This cannot be undone.`)

            }
        }
        return values
    }

    let page = 1
    const maxpage = guild.points.amount + 1
    const firstpage = new MessageEmbed()
    .setTitle('Points Menu')
    .setDescription('Use the pagination arrow to view each of your points one at a time.')
    .addField('Status', pntstatus)
    .addField('Point Systems', `\`${points.systems.map(sys => `${sys.name} - Users: ${sys.users.length}`).join(', ')}\``, true)
    const mainpage = await message.channel.send(firstpage)
    mainpage.react('⬅️')
    mainpage.react('➡️')

    const pages = await getSystem(firstpage)
    console.log(pages)

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