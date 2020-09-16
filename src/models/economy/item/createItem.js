const item = require('./shop');
const mongoose = require('mongoose');

exports.create = async function(list, name, price, desc, emoji) {
	const itemlist = await item.findOne({ name: list });
	console.log(itemlist);
	const newitem = {
		name: name,
		price: price,
		desc: desc,
		emoji: (emoji) ? emoji : 'none',
	};
	itemlist.data.push(newitem);
	itemlist.markModified('data');
	await itemlist.save()
		.catch((err) => {console.log(err);});
};