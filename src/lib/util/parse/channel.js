"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = async (bot, message, value) => {
    if (value.startsWith('<#') && value.endsWith('>')) {
        value = value.substring(2);
        value = value.substring(0, value.length - 1);
        if (message.guild.channels.cache.get(value)) {
            value = message.guild.channels.cache.get(value).id;
        }
        else {
            return;
        }
    }
    if (isNaN(value) === false) {
        if (message.guild.channels.cache.get(value))
            return { channel: value = message.guild.channels.cache.get(value).id, state: true };
        else
            return;
    }
    else {
        if (message.guild.channels.cache.find(c => c.name === value)) {
            value = message.guild.channels.cache.find(c => c.name.toLowerCase() === value.toLowerCase()).id;
        }
    }
    return {
        value,
    };
};
