const Discord = require('discord.js')
const bot = new Discord.Client()
const fs = require('fs')
const config = require('./config.json')
const embed = require('./functions/embed')
const guildModel = require('./models/guildModel/guild')
const cooldownCheck = require('./functions/useful/cooldown')
const { EventEmitter } = require('events')
const guild = require('./models/guildModel/guild')
const { message } = require('noblox.js')

// Command Cooldowns
const cooldowns = new Discord.Collection()
bot.suggestionCooldown = new Discord.Collection()
// Collection of all the commands
bot.cmds = new Discord.Collection();
bot.disabledMod = new Discord.Collection();
bot.mongoose = require('./util/mongoose')



  bot.on("guildCreate", guild => {
   const guildCreate = require('./models/guildModel/guildCreate')
   guildCreate(bot, guild)
});
const folders = ['verification', 'utility', 'settings', 'user', 'ranking', 'group', 'moderation'];
folders.forEach(c => {
    fs.readdir(`./cmds/${c}/`, (err, files) => {
        if (err) throw err;
        console.log(`loaded ${c}`)
        const jsfile = files.filter(f => f.split(".").pop() === 'js')

        jsfile.forEach((f, i) => {
            const prop = require(`./cmds/${c}/${f}`);
            console.log(`${f} loaded!`);
            bot.cmds.set(prop.help.name, prop);
        });
    })
})

bot.on('ready', async () => {
    console.log('ready')
    const moderate = require('./lib/moderation')
    await moderate.querying.query(bot)

})

bot.on("guildMemberAdd" , async (member) => {
    const guild = await guildModel.findOne({ guildID: member.guild.id })
    if (guild.welcome.enabled === true) {
        const welcomemsg = require('./functions/settingsFunctions/Welcome/welcomesend')
        await welcomemsg(member, guild)
    }
    if (guild.verificationSettings.autoVerify === true) {
        console.log(true)
        const autoVerify = require('./functions/verifyFunctions/joinVerify')
        return autoVerify(member, guild)
    }
    if (guild.verificationSettings.unverifiedEnabled === true) {
        member.roles.add(unverifiedRole)
        .catch(() => message.guild.owner.send('There seems to be a problem with the **Unverified** role.'))
    }
});

bot.on('message', async message => {
    if (message.channel.type === "dm") return;

    if (message.author.bot) return;

    const guild = await guildModel.findOne({ guildID: message.guild.id })
    const prefix = '-'
    if (message.content.includes(message.client.user.id)) return message.channel.send(embed('none', `My prefix here is \`${prefix}\`.`, guild))
    if (!message.content.startsWith(prefix)) return;
    const messageArray = message.content.split(" ");

    const cmdget = messageArray[0].slice(prefix.length)
    const cmd = cmdget.toLowerCase()
    const args = messageArray.slice(1);
    const cmdFile = bot.cmds.get(cmd)
    || bot.cmds.find(c => c.help.aliases && c.help.aliases.includes(cmd));

    if (!cmdFile) return
    if (bot.disabledMod.get(cmd)) return;
    if (guild.disabledCommands.includes(cmd)) return;
    const cooldown = await cooldownCheck(message, cooldowns, cmdFile, prefix);
    if (cmdFile && cooldown === false) return cmdFile.run(bot, message, args, guild);

})
bot.mongoose.init()
bot.login(config.token)
