"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = async (message, value) => {
    let state = false;
    if (value.startsWith('<#') && value.endsWith('>')) {
        value = value.substring(3);
        value = value.substring(0, value.length - 1);
        if (message.guild.roles.cache.get(value)) {
            value = message.guild.roles.cache.get(value).id;
            state = true;
        }
        else {
            return;
        }
    }
    if (isNaN(value) === false && state === false) {
        if (message.guild.roles.cache.get(value))
            return { value: message.guild.roles.cache.get(value).id, state: true };
        else
            return;
    }
    if (state === false) {
        if (message.guild.roles.cache.find(c => c.name === value)) {
            value = message.guild.roles.cache.find(c => c.name.toLowerCase() === value.toLowerCase()).id;
            state = true;
        }
    }
    return {
        state,
        value,
    };
};
