const { MessageEmbed } = require("discord.js");
const pageinfo = require('./settingspages')
const embed = require('..//embed')
module.exports = async (bot, message, args, guild) => {
    const prefix = guild.prefix
    let page = 1
    const pages = ['filler']
    const info = await pageinfo(bot, message, args, guild)
    // MainPage
    const firstpage = new MessageEmbed()
    .setTitle('Origin Server Settings')
    .setDescription(`For a more in-depth view or to change a setting you can use the command \`${prefix}settings <name>\` to configure almost all settings.`)
    .addField('Prefix', `\`${guild.prefix}\`` + '\n*Used by your guild to run commands with the bot.*')
    .addField('Roblox Token', info.roblox.token + `\n*This is used for features such as ranking in your group, these will not work without it.*`)
    .addField('Roblox Group', info.roblox.group + `\n*The group linked during the setup command. More info can be seen with \`${prefix}settings verification\`*`)
    .setFooter(`Page ${page} / 4`)
    const mainpage = await message.channel.send(firstpage)
    mainpage.react('⬅️')
    mainpage.react('➡️')
    pages.push(firstpage)
    // Second Page
    const secondpage = new MessageEmbed()
    .setTitle('Origin Server Settings')
    .setDescription(`For a more in-depth view or to change a setting you can use the command \`${prefix}settings <name>\` to configure almost all settings.`)
    .addField('Embed', '*Configure the footer, color and icon of eligible embeds.*')
    .addField('Suggestions', info.sgstInfo.status +'\n*Allow users to suggest features etc. to your guild and send them to a specified channel with customizable cooldown and accepting or denying.*')
    .addField('Moderation', info.modInfo.status + '\n*Commands such as `warn, kick, ban, mute, purge` to help moderate your Discord Server, this also works with logging.*')
    pages.push(secondpage)

    // Third Page
    const thirdpage = new MessageEmbed()
    .setTitle('Origin Server Systems')
    .setDescription(`For a more in-depth view or to change a setting you can use the command \`${prefix}settings <name>\` to configure almost all settings.`)
    .addField('Points', info.pntInfo.status + '\n*Add or remove points from users with your own currency name and have it show up on their guild profile.*')
    .addField('Applications', info.appInfo.status + '\n*Have applications for people to fill out and send to a specific channel in your guild for people to review.*')
    .addField('Logging', info.logInfo.status + '\n*Log actions done with the bot such as `ranking, moderating, permission/setting changes`*')
    pages.push(thirdpage)
    // Fourth Page
    const fourthpage = new MessageEmbed()
    .setTitle('Origin Server Binds')
    .setDescription(`Binds can be added with the \`${prefix}bind\` command and removed with \`${prefix}bind remove\``)
    .addField('Asset Bindings', info.roblox.assetBnd + '\n*Bindings that give a user a role if they own a certain asset.*')
    .addField('Gamepass Bindings', info.roblox.gameBnd + '\n*Give a user a role when they own the given gamepass.*')
    .addField('Rank Bindings', info.roblox.rankBnd + `\n*These binds rank a user to a certain rank if they own the asset in the group on running the \`${prefix}getrank <rank-name>\` All available ranks can be seen with \`${prefix}ranks\`*`)
    pages.push(fourthpage)
    const maxpage = pages.length - 1
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
            if (page - 1 < 0) return
            page = page - 1
            pages[page].setFooter(`Page ${page} / ${maxpage}`)
            mainpage.edit(pages[page])
        }
    
})
collector.on('end', async collected => {
    await mainpage.reactions.cache.map(each => each.remove())
    mainpage.edit(embed('Timeout', 'Settings has timed out.', guild))
});
}