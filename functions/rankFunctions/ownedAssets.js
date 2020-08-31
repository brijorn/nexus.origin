const Discord = require('discord.js')
const fetch = require('node-fetch')
module.exports = async (bot, message, guild, userID) => {
    function checkifI(val) {
        return age >= 18;
      }
     let ownedAssets = new Discord.MessageEmbed()
        .setTitle('Guild Rank Assets')
        .setFooter('Nexus Origin')
        .setDescription(`Run the command ${guild.prefix}getrank \`<rank-name>\` to receive the specific rank.`)
        .setFooter('Nexus Origin | Key: 🔒 Unavailable to you 🔓 Available to you')
        const assets = guild.rankBinds
        const numbers = new RegExp('^[0-9]+$');

    for (i = 0; i < assets.length; i++) {
        let asset = assets[i]
        const checkOwned = await fetch(`http://api.roblox.com/Ownership/HasAsset?userId=${userID}&assetId=${asset.assetID}`).then(response => response.json())
        if (checkOwned == false) ownedAssets.addField(`**🔒${asset.name}**`, `Rank: ${asset.rank}\n Asset ID: ${asset.assetID}`, true)
        if (checkOwned === true) ownedAssets.addField(`**🔓${asset.name}**`, `Rank: ${asset.rank}\n Asset ID: ${asset.assetID}`, true)
     }

    return ownedAssets
    
}