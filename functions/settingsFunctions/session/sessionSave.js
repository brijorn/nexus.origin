const embed = require('../../embed');
module.exports = async (bot, message, guild, authorInfo, messageInfo, mainMenu) => {
    const start = await message.channel.send(embed('none', 'Saving Session..', guild));
    const main = mainMenu.embeds[0].fields;
    if (!guild.sessions) {
        sessionobj = {
            enabled: false,
            sessions: []
        }
        guild.sessions = sessionobj
        await guild.save()

    }
    let newSessionObj = {
        name: main[0].value,
        message: {
            title: main[1].value,
            description: main[2].value,
            author: {
                icon: '',
                name: '',

            },
        },
        prompts: {},
    };

    if (main[6].value !== 'N/A') {
        start.edit(embed('none', 'Saving `footer` Info', guild))
        newSessionObj.message.footer = main[6].value;
    };
    const author = authorInfo.fields;
    if (author[0].value === 'true') {
        start.edit(embed('none', 'Saving `Author` Info', guild))
        if (author[1].value !== 'none') {
            newSessionObj.message.author.icon = author[1].value
        };
        if (author[2].value !== '{{MessageAuthor.username}} {{MessageAuthor}} are valid placeholders') {
            newSessionObj.message.author.name = author[2].value
        };
    }
    if (main[4].value !== 'N/A') {
        start.edit(embed('none', 'Saving `Image` Info', guild))
        newSessionObj.message.image = main[4].value
    }
    if (main[5].value !== 'N/A') {
        start.edit(embed('none', 'Saving `Thumbnail` Info', guild))
        newSessionObj.message.thumbnail = main[5].value
    }
    const msg = messageInfo.fields
    if (msg[0].value === 'true') {
        start.edit(embed('none', 'Saving `PromptOne` Info', guild))
        if (msg[2].value.includes(',') == true) {
            const splittype = msg[2].value.split(",")
        newSessionObj.prompts.PromptOne = {
            message: msg[1].value,
            type: splittype[0],
            typekey: splittype[1],
        }
        }
        else {
            newSessionObj.prompts.PromptOne = {
                message: msg[1].value,
                type: msg[2].value,
        }
    }
    }
    if (msg[3].value === 'true') {
        start.edit(embed('none', 'Saving `PromptTwo` Info', guild))
        if (msg[2].value.includes(',') == true) {
            const splittype = msg[5].value.split(",")
        newSessionObj.prompts.PromptTwo = {
            message: msg[4].value,
            type: splittype[0],
            typekey: splittype[1],
        }
        }
        else {
            newSessionObj.prompts.PromptTwo = {
                message: msg[4].value,
                type: msg[5].value,
        }
    }
    }
    if (msg[6].value === 'true') {
        start.edit(embed('none', 'Saving `PromptThree` Info', guild))
        if (msg[2].value.includes(',') == true) {
            const splittype = msg[8].value.split(",")
            newSessionObj.prompts.PromptThree = {
                message: msg[7].value,
                type: splittype[0],
                typekey: splittype[1],
        }
        }
        else {
            newSessionObj.prompts.PromptThree = {
                message: msg[7].value,
                type: msg[8].value,
        }
    }
};

    console.log(newSessionObj)
    guild.markModified('sessions')
    guild.sessions.sessions.push(newSessionObj)
    await guild.save(function(err) {
        if (err) {console.log('error')}
        else {
            start.edit(embed('none', 'Session successfully saved.', guild))
        }
    });
}