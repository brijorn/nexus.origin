const moment = require('moment-timezone')
module.exports = async (data, message, panel, type, supportObj) => {
    const formats = require('./formats.json')
    data = data.embeds[0]
    for (let [key, value] of Object.entries(data)) {
        if (key === 'color') continue;
        
            if (typeof value === 'object' && key !== 'fields') {
                for (let [fieldname, fieldvalue] of Object.entries(value)) {
                    formats.forEach(e => {
                        if (fieldvalue.includes(e.name)) {
                            fieldvalue = fieldvalue.replace(new RegExp(e.name, 'g'), eval(e.changeto));
                        }

                    })
                    data[key][fieldname] = fieldvalue
                }
            }
            if (key === 'fields') {
                for (i=0; i < value.length; i++) {
                    let fieldObj = value[i]
                     for (let [fieldname, fieldvalue] of Object.entries(fieldObj)) {
                         if (typeof fieldvalue !== "boolean") {
                            formats.forEach(e => {
                                if (fieldvalue.includes(e.name)) {
                                    fieldvalue = fieldvalue.replace(new RegExp(e.name, 'g'), eval(e.changeto));
                                }
                             })
                             data[key][i][fieldname] = fieldvalue
                         }
                     }
                }
            }
            else {
            formats.forEach(e => {
                if (value.includes(e.name)) {
                    value = value.replace(new RegExp(e.name, 'g'), eval(e.changeto));
                    data[key] = value
                }
            })
        }
    }
    return data
}