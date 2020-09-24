"use strict";
exports.__esModule = true;
var discord_js_1 = require("discord.js");
var Colors;
(function (Colors) {
    Colors["GREEN_SUCCESS"] = "#3bff86";
    Colors["RED_FAILURE"] = "#ff6257";
})(Colors || (Colors = {}));
function default_1(title, description, guild, color, footer, timestamp) {
    var construct = new discord_js_1.MessageEmbed();
    if (title !== 'none')
        construct.setTitle(title);
    construct.setDescription(description);
    if (timestamp === true)
        construct.setTimestamp();
    construct.setFooter((guild.embed.footer !== 'none') ? (typeof footer === 'string') ? footer : guild.embed.footer : '', (guild.embed.footerlogo !== 'none') ? guild.embed.footerlogo : '');
    construct.setColor((!color || color === 'default') ?
        (guild.embed.color !== 'none') ? guild.embed.color : ''
        :
            (color === 'success') ? Colors.GREEN_SUCCESS : (color === 'failure') ? Colors.RED_FAILURE : '');
    return construct;
}
exports["default"] = default_1;
;
