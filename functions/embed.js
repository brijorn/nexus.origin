const Discord = require('discord.js');
module.exports = (title, description, guild, color = '#ab2db3', footer=true) => {
    if (color === 'def') color = guild.embedInfo.color

    // Convert word to color so I dont have to fucking require config.json
    if (color === 'success') color = '#3bff86'
    if (color === 'failure') color = '#ff6257'

    // Convert title of 'none' to no title
    if (title === 'none') {
        const embed = new Discord.MessageEmbed()
        .setDescription(description)
        if (footer === true) embed.setFooter(guild.embedInfo.footer, guild.embedInfo.footerlogo)
        if (color === '#ab2db3') {
            embed.setColor(guild.embedInfo.color)
        }
        else {
            embed.setColor(color)
        }
        
        return embed
    }

    else {
        const embed = new Discord.MessageEmbed()
        .setTitle(title)
        .setDescription(description)
        if (footer === true) embed.setFooter(guild.embedInfo.footer, guild.embedInfo.footerlogo)
        if (color === '#ab2db3') {
            embed.setColor(guild.embedInfo.color)
        }
        else {
            embed.setColor(color)
        }
        return embed;
    }

};

module.exports.help = {
    name: "embed",
}