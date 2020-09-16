const editprompt = require('../../../prompt/editprompt');
const embed = require('../../embed');

module.exports = async (bot, message, args, guild, msgToEdit) => {
	let done = false;
	let i = 0;
	const questions = [];
	while (done === false) {
		i = ++i;
		const ques = embed(`Question ${i}`, 'What is the description for this question\n\nSay **done** at any time to stop.', guild);
		const res = await editprompt(message, msgToEdit, ques);
		if (res.toLowerCase() === 'done') {
			done = true;
			return questions;
		}
		questions.push(res);
	}
};