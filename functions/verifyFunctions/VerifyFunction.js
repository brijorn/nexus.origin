const Discord = require('discord.js')
const rbx = require("noblox.js")
const regprompt = require('../../prompt/prompt.js')
const dmprompt = require('../../prompt/vdmprompt')
const { cookie, logo, success, failure } = require('../../config.json')
const embed = require('../embed.js')
const verificationModel = require('../../models/verificationModel/verification.js')
const verificationUpdate = require('../../models/verificationModel/verificationUpdate')
const verificationCreate = require('../../models/verificationModel/verificationCreate')
const roleCheck = require('../../functions/verifyFunctions/roleAddCheck')
const config = require('../../config.json')
module.exports = async (message, bot, userName, guild) => {
  let verifStatus = undefined
  const sendtype = (guild.verificationSettings.dmVerifications === true) ? await message.author : await message.channel
  const prompt = (guild.verificationSettings.dmVerifications === true) ? dmprompt : regprompt
const wait = require("util").promisify(setTimeout);
const setCookie = (!guild.robloxToken) ? await rbx.setCookie(config.robloxtoken) : await rbx.setCookie(guild.robloxToken)
  const id = await rbx.getIdFromUsername(userName)


  const typeask = await prompt(message, embed('Verification', 'Would you like to verify with a `code` or `game`?\n\n`Code` -> Put a code in your roblox status or blurb to verify\n`Game` -> Join a game to verify\n\nRespond **cancel** to cancel.', guild))
  if (typeask.toLowerCase() === 'cancel') return sendtype.send('Cancelled.')
  if (typeask.toLowerCase().includes('code')) {
    const codeVerif = require('./codeVerify')
    const code = await codeVerif(message, id, sendtype, guild)
    verifStatus = code
  }
  if (typeask.toLowerCase().includes('game')) {
    const codeVerif = require('./gameVerify')
    const info = id.toString()

    const code = await codeVerif(message, info, sendtype, guild)
    verifStatus = code
  }
  if (verifStatus = false) return
    const checkforAccount = await verificationModel.exists({ userID: message.author.id })


     if (checkforAccount === true) {
       const verificationUpdate = require('../../models/verificationModel/verificationUpdate')
        const updater = await verificationUpdate(message.author.id, id)
        const user = await verificationModel.findOne({ userID: message.author.id})
            const roleAdd = await roleCheck(bot, message, guild)
            const newUsername = await rbx.getUsernameFromId(user.primaryAccount)
            const Verified = new Discord.MessageEmbed()
            .setDescription(`You were successfully verified as ${newUsername}`)
            .setColor(config.success)
            if (roleAdd !== undefined) {
                if (roleAdd.rolesAdded.length !== 0) {
                    const eachrole = roleAdd.rolesAdded.map(each => `${each}`)
                    Verified.addField('Roles Added', eachrole)
                }
                if (roleAdd.rolesRemoved.length !== 0) {
                    const eachrole = roelAdd.rolesRemoved.map(each => `${each}`)
                    Verified.addField('Roles Removed', eachrole)
                }
            }
            sendtype.send(Verified)
     }
     if (checkforAccount === false) {
       const verificationCreate = require('../../models/verificationModel/verificationCreate')
       await verificationCreate(message.author.id, id)
       const user = await verificationModel.findOne({ userID: message.author.id})
            const roleAdd = await roleCheck(bot, message, guild)
            const newUsername = await rbx.getUsernameFromId(user.primaryAccount)
            const Verified = new Discord.MessageEmbed()
            .setDescription(`You were successfully verified as ${newUsername}`)
            .setColor(config.success)
            if (roleAdd !== undefined) {
                if (roleAdd.rolesAdded.length !== 0) {
                    const eachrole = roleAdd.rolesAdded.map(each => `${each}`)
                    Verified.addField('Roles Added', eachrole)
                }
                if (roleAdd.rolesRemoved.length !== 0) {
                    const eachrole = roelAdd.rolesRemoved.map(each => `${each}`)
                    Verified.addField('Roles Removed', eachrole)
                }
            }
            sendtype.send(Verified)
     }
        message.member.roles.add(guild.verifiedRole)


  }

