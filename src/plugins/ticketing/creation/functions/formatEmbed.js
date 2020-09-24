"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require('moment-timezone');
exports.default = async (data, message, panel, information) => {
    const formats = require('./formats.json');
    const user = (information.type === 'claim') ? message.guild.members.cache.get(information.userId).user : message;
    data = data.embeds[0];
    for (let [A, B] of Object.entries(data)) {
        let key = A;
        let value = B;
        if (key === 'color')
            continue;
        if (typeof value === 'object' && key !== 'fields') {
            for (let [C, D] of Object.entries(value)) {
                let fieldname = C;
                let fieldvalue = D;
                formats.forEach((e) => {
                    if (fieldvalue.includes(e.name)) {
                        fieldvalue = fieldvalue.replace(new RegExp(e.name, 'g'), eval(e.changeto));
                    }
                });
                data[key][fieldname] = fieldvalue;
            }
        }
        if (key === 'fields') {
            for (let i = 0; i < value.length; i++) {
                let fieldObj = value[i];
                for (let [D, E] of Object.entries(fieldObj)) {
                    let fieldname = D;
                    let fieldvalue = E;
                    if (typeof fieldvalue !== "boolean") {
                        formats.forEach((e) => {
                            if (fieldvalue.includes(e.name)) {
                                fieldvalue = fieldvalue.replace(new RegExp(e.name, 'g'), eval(e.changeto));
                            }
                        });
                        data[key][i][fieldname] = fieldvalue;
                    }
                }
            }
        }
        else {
            formats.forEach((e) => {
                if (value.includes(e.name)) {
                    value = value.replace(new RegExp(e.name, 'g'), eval(e.changeto));
                    data[key] = value;
                }
            });
        }
    }
    return data;
};
