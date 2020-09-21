"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = async (message, value, slice = true) => {
    let mentioned = '';
    if (value.startsWith('<@') && value.endsWith('>')) {
        const channelb = value.substring(3);
        const finished = channelb.substring(0, channelb.length - 1);
        console.log(finished);
        mentioned = message.guild.members.cache.get(finished);
        return mentioned;
    }
    if (isNaN(value) === false) {
        mentioned = message.guild.members.cache.get(value);
        if (!mentioned)
            return;
        return mentioned;
    }
    if (!(value.startsWith('<@') && !value.endsWith('>')) && isNaN(value) === true) {
        async function findUser(givenuser) {
            givenuser = givenuser.toLowerCase();
            let founduser = undefined;
            message.guild.members.cache.find((user) => {
                if (user.nickname === null) {
                    if (user.user.username.toLowerCase() === givenuser)
                        return founduser = user;
                }
                if (user.nickname !== null) {
                    if (user.nickname.toLowerCase() === givenuser)
                        return founduser = user;
                    if (user.user.username.toLowerCase() === givenuser)
                        return founduser = user;
                }
            });
            return founduser;
        }
        mentioned = await findUser(value);
        if (!mentioned)
            return;
    }
    return mentioned;
};
