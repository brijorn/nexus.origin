const db = require('../');
const guild = require('../../models/guildModel/guild');

/*
CREATE TABLE IF NOT EXISTS guilds (
    guild_id BIG INT NOT NULL
    prefix BIG INT NOT NULL
)
*/

exports.createGuild = async function(guildid) {

	db.schema.hasTable('guilds', async function(table) {
		if (!table) {
			await db.schema.createTable('guild', function(doc) {
				doc.bigInteger('guild_id');
				doc.string('prefix');
				doc.bigInteger('embed_color');
				doc.string('embed_footer');
				doc.string('embed_footerlogo');
			});
		}
	});

	db.table('guild').where('guild_id', '=', guildid)
		.then(async (res) => {
			if (!res[0]) {
				await db.table('guild')
					.insert({
						guild_id: guildid,
						prefix: '!',
						embed_color: 'a33bff',
						embed_footer: 'Nexus Origin',
						embed_footerlogo,
					});
			}
		});

};
exports.viewGuilds = function() {
	db.table('guild')
		.select()
		.then((res) => {
			console.table(res);
		});
};

module.exports = {
	createGuild: this.createGuild,
	updateGuilds: this.updateGuilds,

};
