const prompt = require('../../../prompt/pmprompt')
const embed = require("../../embed")
const delprompt = require("../../../prompt/delprompt")
const pmprompt = require('../../../prompt/pmprompt')

module.exports = async (bot, message, args, guild, questions, name) => {
    const res = []
    let cancel = false
    const startmsg = embed(`${name}`, 'You are about to apply for ' + name + ', are you sure?\n\nRespond `y` or `n`\nSay **cancel** at any time during the application to cancel', guild)
    const start = await pmprompt(message, startmsg)
    if (start.content.toLowerCase().includes('y') === false) return start.message.delete({ timeout: 0 })

    for (let i = 0; i < questions.length; i++) {
        let ques = questions[i]
        const ask = embed(`${name}`, ques, guild)
        ask.setFooter(`Question ${i + 1}/${questions.length}`)
        const response = await prompt(message, ask)
        if (cancel === true) return
        if (response.content.toLowerCase() === 'cancel') {
            cancel = true
            return
        }
        res.push(response.content)
    }
    return res
}