const embed = require("../../functions/embed")
const rbx = require('noblox.js')
const fetch = require('node-fetch')
const { MessageEmbed } = require("discord.js")
exports.addAsset = async function(message, guild, type, option, assetId, nickname, hierarchy, roles) {
    let product = ''
    if (guild.assetBinds.find(a => a.assetId === assetId)) return message.channel.send(embed('none', 'Binding already exists for this asset.', guild, 'failure', false))
    try {product = await rbx.getProductInfo(assetId)} catch { return message.channel.send(embed('none', `${type} not found, make sure you gave a valid Roblox Asset`, guild, 'failure', false))}
    console.log(product)
    const found = []
    for(i=0; i < roles.length; i++) {
        let role = roles[i]
        if (!message.guild.roles.cache.get(role)) return
        else found.push(role)
    }
    console.log(nickname)
    nickname = nickname.join('')
    console.log(nickname)
    const assetObj = {
        assetId: assetId,
        nickname: nickname,
        hierarchy: hierarchy,
        roles: found
    }

    guild.assetBinds.push(assetObj)
    // Save to Mongo
    guild.markModified('assetBinds')
    await guild.save()
    return message.channel.send(embed('none', `Successfully added the asset **${product.Name}(${assetId})** by ${product.Creator.Name} to the assetBinds list.`, guild, 'success'))

}

exports.addGroup = async function(message, guild, type, option, groupid, ranks, nickname, hierarchy, roles) {
    let group = ''
    try {group = await rbx.getGroup(groupid)}catch { return message.channel.send(embed('none', `Could not find the given group with an id of ${groupid}`, guild, 'failure', false, false))}
    let foundroles = []
    for (b=0; b < roles.length; b++) {
        const therole = roles[b]
        if (message.guild.roles.cache.find(r => r.id === therole)) foundroles.push(therole)
    }
    console.log(foundroles)
    const groupranks = await rbx.getRoles(groupid)
    let foundranks = []
    for (i=0; i < ranks.length; i++) {
        const rank = parseInt(ranks[i])
        console.log(groupranks.find(a => a.rank === rank))
        if (groupranks.find(a => a.rank === rank)) {
            const found = groupranks.find(a => a.rank === rank)
            foundranks.push(found)
        }
    }
    const newgroupObj = {
        id: group.id,
        main: false,
        binds: []
    }
    const groupobj = (guild.roleBinds.find(o => o.Id === groupid)) ? guild.roleBinds.find(o => o.Id === groupid) : newgroupObj
    for (i=0; i < foundranks.length; i++) {
        const rank = foundranks[i]
        const rankObj = {
            id: rank.id,
            rank: rank.rank,
            nickname: nickname,
            roles: foundroles,
            hierarchy: hierarchy,
        }
        groupobj.binds.push(rankObj)
    }
    if (foundranks.length < 6) {
        const endembed = new MessageEmbed()
        .setTitle('Binding Finished')
        .setDescription('Successfully bound the following roles.')
        for (i=0; i < foundranks.length; i++) {
            foundrank = foundranks[i]
            endembed.addField(foundrank.name, `**Id:** ${foundrank.ID}\n**Rank:** ${foundrank.rank}\n**Roles:** ${foundroles.map(e => `${e}`).join(', ')}\n**Nickname:** ${nickname} **Hiearchy:** ${hierarchy}`, true)
        }
        return message.channel.send(endembed)
    }
    else {
        return message.channel.send(`Successfully bound the given ranks, to view your binds run the command \`${guild.prefix}binds view group [Optional: groupid]\``)
    }
    console.log(groupobj)
}