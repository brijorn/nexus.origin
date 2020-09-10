const add = require('./add');
const remove = require('./remove');
const list = require('./list');
module.exports = {
	addAsset: add.addAsset,
	removeAsset: remove.removeAsset,
	addGroup: add.addGroup,
	list: list,
};