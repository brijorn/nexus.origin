export default (args: any[], arrayOfValues: number[]) => {
	let time = 0;
	const newarrayOfValues = arrayOfValues;
	function Check(val: any) {
		if (val.match(/\d+/) === null) return false;

		else return true;
	}
	// Conv Days
	if (args.find(o => o.includes('d'))) {
		let days = args.find(o => o.includes('d'));
		if (Check(days) !== false) {
			days = days.match(/\d+/)[0];
			days = days * 86400000; // 86,400,000
			time = time + days;
			newarrayOfValues.splice(args.indexOf(args.find(o => o.includes('d'))), 1);
		}
	}
	// Conv Hours
	if (args.find(o => o.includes('h'))) {
		let hours = args.find(o => o.includes('h'));
		if (Check(hours) !== false) {
			hours = hours.match(/\d+/)[0];
			hours = (hours * 3600000); //  3,600,000
			time = time + hours;
			newarrayOfValues.splice(newarrayOfValues.indexOf(args.find(o => o.includes('h'))), 1);
		}

	}
	// Conv Minutes
	if (args.find(o => o.includes('m'))) {
		let minutes = args.find(o => o.includes('m'));
		if (Check(minutes) !== false) {
			minutes = minutes.match(/\d+/)[0];
			minutes = parseInt(minutes);
			minutes = minutes * 60000; // 60,000
			time = time + minutes;
			newarrayOfValues.splice(newarrayOfValues.indexOf(args.find(o => o.includes('m')), 1), 1);
		}
	}
	function dhm(t: number) {
		var cd = 24 * 60 * 60 * 1000,
			ch = 60 * 60 * 1000,
			d = Math.floor(t / cd),
			h = Math.floor((t - d * cd) / ch),
			m = Math.round((t - d * cd - h * ch) / 60000),
			pad = function(n: number) { return n < 10 ? '' + n : n; };
		if(m === 60) {
			h++;
			m = 0;
		}
		if(h === 24) {
			d++;
			h = 0;
		}
		(d as any) = (d !== 0) ? d + 'd' : '';
		(h as any) = (h !== 0) ? h + 'h' : '';
		(m as any) = (m !== 0) ? m + 'm' : '';
		return [d, pad(h), pad(m)].join('');
	}
	const readable = dhm(time);
	return {
		newarrayOfValues,
		time,
		readable,
	};
};