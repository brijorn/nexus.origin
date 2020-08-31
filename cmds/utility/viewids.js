const axios = require('axios')

module.exports.run = async (bot, message, args, guild) => {
    const id = args[0]
    axios
    .get(`https://api.nexusservices.co/v1/verification/ids`, {
        userId: id
    })
    .then(res => {
        console.log(`statusCode: ${res.statusCode}`)
        console.log(res)
      })
      .catch(error => {
        console.error(error)
      })
    
}
module.exports.help = {
    name: 'viewid'
}