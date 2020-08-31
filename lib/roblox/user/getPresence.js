const fetch = require('node-fetch');
const { setCookie } = require('noblox.js')
const { robloxtoken } = require('../config.json')
module.exports = async (user) => {
    const URL = 'https://presence.roblox.com/v1/presence/users'
    await setCookie(robloxtoken)
    async function getPresent(user){
        const body = {
            "userIds": [user]
        };

        const response = await fetch(URL, {
            method: 'post',
            body: JSON.stringify(body),
		    headers: {'Content-Type': 'application/json'}
        });

        const json = await response.json();

        console.log(json);
        return res = json
    }
    const res = getPresent(user)
    return res
}