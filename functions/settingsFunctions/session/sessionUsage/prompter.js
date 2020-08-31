const delprompt = require('../../../../prompt/delprompt')
const embed = require('../../../embed')
const replace = require('./replacer.json')
module.exports = async (bot, message, args, guild, info) => {
    let i = 0
    let cancel = false
    const theprompts = {
        PromptOne: undefined,
        PromptTwo: undefined,
    }
    if (info.prompts.PromptOne !== undefined) {
        let ques = embed(info.message.title + ' Setup', info.prompts.PromptOne.message, guild)
        if (info.prompts.PromptOne.type === 'yesno') {
            ques = embed(info.message.title + ' Setup', info.prompts.PromptOne.message + '\n\nRespond with `yes` or `no`', guild)
        }
        const PromptOne = await delprompt(message, ques, 1, 1)
        const lower = PromptOne.toLowerCase()
        const check = (lower === 'yes' || lower === 'no') ? true : false
        if (info.prompts.PromptOne.type === 'yesno' && check === false) return message.channel.send(embed('none', 'Invalid Response, please respond with `yes` or `no`', guild))
        if (info.prompts.PromptOne.type === 'yesno') {
            replace.values.forEach(val => {
                const splitter = info.prompts.PromptOne.typekey.split(':')
                if (lower === 'yes') {
                    if (val.name === splitter[0]) {
                        return eval(val.replace)
                    }
                }
                if (lower === 'no') {
                    if (val.name === splitter[1]) {
                        return eval(val.replace)
                    }
                }
            })
        }
        theprompts.PromptOne = PromptOne
    }
    return  {
        theprompts,
        cancel
    }
}