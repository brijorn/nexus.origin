const editprompt = require('../../prompt/editprompt');
const embed = require('../embed');
const config = require('../../config.json');
module.exports = async (bot, message, guild, profile, ques) => {
	console.log('here');
	const imgask = embed('Thumbnail Configuration', 'What is the Image URL of the item you want as your thumbnail?\nIf you have a file I suggest uploading to [imgur](https://imgur.com/) and copying the image address.\n*Try not to be inapporpriate*\n\nRespond **cancel** to cancel\nRespond **none** to disable', guild);
	const img = await editprompt(message, ques, imgask);
	if (img.toLowerCase() === 'cancel') {
		ques.delete({ timeout: 1000 });
		return message.channel.send('Cancelled');
	}
	if (img.toLowerCase() === 'none') {
		profile.thumbnail = 'none';
		await profile.save();
		return;
	}
	profile.thumbnail = img;
	await profile.save();
	const done = embed('Thumbnail Configured', 'Successfully set your thumbnail to the given image URL.\n\nP.S: If you don\'t see a thumbnail on this message it didn\'t work.', guild, config.success);
	done.setThumbnail(img);
	return ques.edit(done);

};