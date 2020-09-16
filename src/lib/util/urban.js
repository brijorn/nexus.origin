const axios = require('axios');

module.exports = async function(word) {
	const res = await axios({
		'method':'GET',
		'url':'http://api.urbandictionary.com/v0/define?term=' + word,
	})
		.then((response)=>{
			return response.data;
		})
		.catch((error)=>{
			console.log(error);
		});
	return res;
};
