const { MessageEmbed } = require('discord.js');
const prompt = require('../../../prompt/index');
const sample = require('lodash.sample');
const shuffle = require('lodash.shuffle');
async function setJob(message, user, jobName, jobObj) {
	jobName = jobName.toLowerCase();
	const newjob = '';
	const old = user.job.past.find(o => o.name.toLowerCase() === jobName);
	if (old) {
		oldlevel = old.level;
		user.job.name = jobObj.name;
		user.job.level = oldlevel;
		user.job.salary = jobObj.salary;
		user.markModified('job');
		await user.save();
	}
	if (!old) {
		user.job.name = jobObj.name;
		user.job.level = 1;
		user.job.salary = 100;
		user.markModified('job');
		await user.save();
	}
	const finished = new MessageEmbed()
		.setTitle(`Hired! ${jobObj.name}`)
		.setDescription(`You have been successfully hired for a janitor.\n**Job Description:** ${jobObj.desc}\n**Salary:** ${jobObj.salary}`)
		.setFooter('Note that you cannot change jobs for another 24 hours.');
	message.channel.send(finished);
}

async function quitJob(message, user) {
	if (user.job.name === 'Unemployed') {
		const unemployed = new MessageEmbed()
			.setDescription('Unfortunately you cannot quit being unemployed.');
		return message.channel.send(unemployed);
	}
	else {
		pastObj = {
			name: user.job.name,
			level: user.job.level,
		};
		user.job.past.push(pastObj);
		user.job.name = 'Unemployed';
		user.job.salary = 0;
		user.job.level = 1;
		user.markModified('job');
		await user.save();
		const unemployed = new MessageEmbed()
			.setTitle('Fresh Start')
			.setDescription('You have successfully quit your job.');
		message.channel.send(unemployed);
	}
}


async function giveJob(message, user, jobName) {
	const economy = require('../index');
	if (user.job.name !== 'Unemployed') return message.channel.send('You already have a job.');
	const jobs = await economy.shop.findOne({ name: 'Jobs' });
	const jobObj = jobs.data.find(j => j.name.toLowerCase() === jobName.toLowerCase());
	const good = false;
	if (user.levelling.level >= jobObj.required) return await setJob(message, user, jobName, jobObj);
	else return message.channel.send('Your level is not high enough to get this job');
}

async function games(message, user, jobName) {
	const economy = require('../index');
	const jobs = await economy.shop.findOne({ name: 'Jobs' });
	const job = jobs.data.find(o => o.name.toLowerCase() === jobName.toLowerCase());
	const jobgames = job.games;
	const pickgame = sample(jobgames);
	let game = '';
	if (pickgame.type === 'unscramble') game = await unscramble(message, pickgame);
	if (pickgame.type === 'match') game = await match(message, pickgame);
	if (game === true) {
		const pay = calculatecoins(user);
		const good = new MessageEmbed()
			.setColor('#ffe926')
			.setDescription(`Good job ${message.author.username}, you have been paid **${economy.coin} ${pay}** for your efforts`);
		message.channel.send(good);
		await userUpd(user, pay, undefined, undefined, undefined, true);
	}
	else {
		const badresponses = [`You failed the minigame and therefore made **${economy.coin}0**, what a shame.`,
			`You could have done better. As a result of this you're being paid **${economy.coin} 0**`];
		const bad = new MessageEmbed()
			.setDescription(sample(badresponses))
			.setColor('#3c26ff');
		message.channel.send(bad);
	}
}

// Games

async function unscramble(message, gameObj) {
	const words = gameObj.res.split(',');
	const word = sample(words);
	let scrambled = word.split('');
	scrambled = shuffle(scrambled);
	scrambled = scrambled.join('');
	const ask = new MessageEmbed()
		.setDescription(gameObj.msg + ':' + `\n\`${scrambled}\``);
	const send = await prompt.delprompt(message, ask, 1, 10, 10);
	if (!send) return false;
	if (send.toLowerCase() === word) return true;
	else return false;
}

async function match(message, gameObj) {
	const ask = new MessageEmbed()
		.setDescription(await evalmsg(message, gameObj.msg));
	const send = await prompt.delprompt(message, ask, 1, 10, 10);
	if (!send) return;
	if (send.toLowerCase() === gameObj.res) return true;
	else return false;
}

function calculatecoins(user) {
	const level = user.levelling.level;
	const salary = user.job.salary;
	let pay = salary * (1 + (level / 20));
	pay += Math.round(Math.random() * (100 - 1) + 1);
	return pay;
}

async function evalmsg(message, msg) {
	const formats = require('../../../json/games');
	formats.gameplaceholders.forEach(e => {
		if (msg.includes(e.name)) {
			msg = msg.replace(e.name, eval(e.changeto));
		}
	});
	return msg;
}

async function userUpd(user = Object, pay = Number, item = Object, amt = Number, total = Number, xp = Boolean) {
	if (pay) user.balance += pay;

	if (item) {
		user.balance -= total;
		if (!amt || !total) return;
		console.log(amt);
		const owns = await user.inventory.items.find(i => i.name === item.name);
		if (owns) {
			user.inventory.amount += amt;
			owns.amt += amt;
		}
		if (!owns) {
			user.inventory.amount += amt;
			user.inventory.types++;
			obj = { name: item.name, amt: amt };
			user.inventory.items.push(obj);
		}
		user.markModified('inventory');
	}
	if (xp) {
		console.log('here');
		user.levelling.current++;
		user.commandsUsed++;
		console.log(user.levelling.current);
		user.markModified('levelling');
	}
	await user.save();
}

module.exports = {
	giveJob: giveJob,
	quitJob: quitJob,
	games: games,
	userUpd: userUpd,
};
