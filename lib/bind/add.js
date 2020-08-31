const embed = require("../../functions/embed")
const rbx = require('noblox.js')
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