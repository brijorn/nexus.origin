const mongoose = require('mongoose');
const Guild = require('./guild');
const { MessageEmbed } = require('discord.js');
const { message } = require('noblox.js');
permsObj = {
    owners: [],
    admins: [],
}
module.exports = async (bot, guild) => {
    theguild = new Guild({
        _id: mongoose.Types.ObjectId(),
        guildID: guild.id,
        disabledModules: [],
        disabledCommands: [],
        robloxToken: '',
        embedInfo: {
            color: '#d138ff',
            footer: 'Nexus Origin',
            footerlogo: guild.iconURL()
        },
        verificationSettings: {
            verifiedRole: '',
            unverifiedEnabled: false,
            unverifiedRole: '',
            autoVerify: false,
            nickname: false,
            nicknameFormat: '{robloxname}',
            dmVerifications: false,
            bypass: {
                nickname: '',
            }
        },
        permissions: permsObj
    });
    const newGuild = new MessageEmbed()
    .setTitle('Guild Joined')
    .setDescription(`I have been added to the guild, ${guild.name}`)
    .addField('Owner', `${guild.ownerID} - ${bot.users.cache.get(guild.ownerID).username}`)
    .setThumbnail(guild.iconURL())
    bot.channels.cache.get('740376815599878175').send(newGuild)
    await theguild.save()
    .catch(err => console.error(err));

}