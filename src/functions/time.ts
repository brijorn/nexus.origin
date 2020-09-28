import moment from 'moment-timezone';
import { OriginMessage } from '../typings/origin.d';
import timezones from '../lib/util/json/timezones.json'
export default async (message: OriginMessage, value: string): Promise<string|undefined> => {
	let time = '';
	try {
		time = new Date().toLocaleString('en-US', { timeZone: value });
	}
	catch {
		const obj = timezones.find(o => o.abbr.toLowerCase() === value.toLowerCase());
		if (!obj) {
			message.error('Invalid Timezone Given')
			return;
		}
		time = moment.tz().utcOffset(obj.offset).format('DD/MM/YYYY hh:mm A');
	}

	return time
};