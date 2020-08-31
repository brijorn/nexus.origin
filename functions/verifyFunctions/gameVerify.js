const axios = require('axios')
const embed = require('../embed')
const regprompt = require('../../prompt/prompt.js')
const dmprompt = require('../../prompt/vdmprompt')
module.exports = async (message, id, sendtype, guild) => {
    const prompt = (guild.verificationSettings.dmVerifications === true) ? dmprompt : regprompt
    console.log(prompt)
    let status = false
    axios
    .post('https://api.nexusservices.co/v1/verification/add', {
        token: '6WA4-9WTK-4CFS-DQLZ',
        userId: id,
        discordId: message.author.id,
        discordUser: `${message.author.username}#${message.author.discriminator}`
    })
    .then(res => {
        console.log(`statusCode: ${res.statusCode}`)
        console.log(res)
      })
      .catch(error => {
        console.error(error)
      })

    const msg = embed('Verification', 'Join the following game: to verify.\n\nRespond `done` when finished.\nRespond **cancel** to cancel.', guild)
    msg.setFooter('The verification will timeout after 5 minutes.')
    const ask = await prompt(message, msg)
    if (ask.toLowerCase().includes('cancel')) return sendtype.send('Cancelled.')
    if (ask.toLowerCase().includes('done')) return status = true
    return status
}