const embed = require("../embed")
const { MessageEmbed } = require("discord.js")

module.exports = async (bot, message, guild,  msgToEdit, dir, name, content, type) => {
    if (type === 'reg') {
        if (!guild[dir].find(one => one.assetID === content)) return msgToEdit.edit(embed('Could not Find', 'I could not find the given Asset ID.', guild, '#'))
        const found = guild[dir].find(one => one.assetID === content)
        const removed = new MessageEmbed()
        .setTitle('Role Removed')
        .setDescription(`Asset Successfully Removed\n**Name:** ${found.name}\n**Asset ID:** ${found.assetID}\n**Role:** <@&${found.roleID}>`)
        msgToEdit.edit(removed)
        const index = guild[dir].indexOf(found);
        guild[dir].splice(index, 1)
        guild.markModified(dir)
        await guild.save()
    }
    if (type === 'rank') {
        if (!guild[dir].find(one => one.assetID === content)) return msgToEdit.edit(embed('Could not Find', 'I could not find the given Asset ID.', guild, '#'))
        const found = guild[dir].find(one => one.assetID === content)
        const removed = new MessageEmbed()
        .setTitle('Role Removed')
        .setDescription(`Asset Successfully Removed\n**Name:** ${found.name}\n**Asset ID:** ${found.assetID}\n**Rank:** ${found.rank}`)
        msgToEdit.edit(removed)
        const index = guild[dir].indexOf(found);
        guild[dir].splice(index, 1)
        guild.markModified(dir)
        await guild.save()
    }
}