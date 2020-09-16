exports.newLevel = function(newlevel) {
	return (newlevel + 1) ^ 2 * 10;
};

exports.levelBar = function(current, required) {
	const fullbox = '■';
	const emptybox = '□';
	const num = Math.round((current / required) * 10);
	let bar = '';
	console.log(num);
	for (i = 0; i < num; i++) bar += fullbox;
	while (bar.length < 10) bar += emptybox;
	return bar = `[${bar}](https://www.youtube.com/watch?v=0v8Oenh0vWA)`;
};