// Base Creation Stuff
const getInfo = require('./getInfo')

const createChannel = require('./createChannel')
const createClaim = require('./createClaim')

const createTicket = require('./createTicket')
const createOngoing = require('./createOngoing')
const finish = require('./finish')

// Claim Stuff
module.exports = {
    getInfo: getInfo,
    createChannel: createChannel,
    createClaim: createClaim,
    createTicket: createTicket,
    createOngoing: createOngoing,
    finish: finish,
}