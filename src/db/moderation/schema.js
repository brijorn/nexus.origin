const db = require('..');
const { Message } = require('discord.js');
async function exist() {
	db.withSchema('modules').hasTable('moderation', async function(table) {
		if (!table) {
			await db.withSchema('modules').createTable('guild', function(doc) {
				// Main Settings
				doc.string('guild_id');
				doc.boolean('enabled');
				doc.specificType('ModRoles', 'text Array');

				// Kick Command
				doc.boolean('KickEnabled');
				doc.specificType('KickRoles', 'text Array');
				doc.boolean('KickRequireReason');
				doc.string('KickMessage', 2000);

				// Ban Command
				doc.boolean('BanEnabled');
				doc.specificType('BanRoles', 'text Array');
				doc.boolean('BanRequireReason');
				doc.string('BanMessage', 2000);

				// Mute Command
				doc.boolean('MuteEnabled');
				doc.specificType('MuteRoles', 'text Array');
				doc.string('MutedRole');
				doc.string('MuteMessage');
				doc.string('UnmuteMessage');

				// Warn Command
				doc.boolean('WarnEnabled');
				doc.specificType('WarnRoles', 'text Array');
				doc.string('WarnMessage');

				// Other
				doc.boolean('PurgeEnabled');
				doc.string('ModLog');
			});
		}
	});
}

/**
 * @param { Message } message
 */

exports.enable = async function(message) {
	await this.exist();
	db.table('moderation')
		.where('guild_id', '=', message.guild.id)
		.then((res) => {
			if (!res[0]) {
				db.table('moderation')
					.insert({
						enabled: true,
						ModRoles: [],
						// Kick
						KickEnabled: true,
						KickRoles: [],
						KickRequireReason: false,
						KickMessage: 'You have been kicked in {{Server.Name}} for {{Reason}}',
						// Ban
						BanEnabled: true,
						BanRoles: [],
						BanRequireReason: true,
						BanMessage: 'You have been banned in {{Server.Name}} {{Reason}}\nDuration: {{Duration}}',
						// Mute
						MuteEnabled: true,
						MuteRoles: [],
						MutedRole: '',
						MuteMessage: 'You have been muted for {{Reason}} in {{Server.Name}} for {{Duration}}',
						UnmuteMessage: 'You have been unmuted in {{Server.Name}}',
						// Warn
						WarnEnabled: true,
						WarnRoles: [],
						WarnMessage: 'You have been warned for {{Reason}} in {{Server.Name}}',
						// Other
						PurgeEnabled: true,
						Modlog: '',
					});
			}
			else {return;}
		});
};