const MessageEmbed = require("discord.js");
const guildModel = require("../../models/guildModel/guild");
const embed = require("../../functions/embed");
const rbx = require("noblox.js");
const editstart = require("../../prompt/index").editStart;
const config = require("../../config.json");
const ranking = require("../../functions/rankFunctions/ranking");
module.exports.run = async (bot, message, args) => {
  const guild = await guildModel.findOne({ guildID: message.guild.id });
  if (guild.rankBinds.length < 0 || !guild.rankBinds)
    return message.channel.send(
      embed(
        "none",
        "Error: There are no rank bindings for this guild.",
        guild,
        config.failure
      )
    );
  if (!args.length) {
    const quest = embed(
      "Ranking",
      `What is the rank you wish to receive?\nPlease use proper **spelling**\n\nTo see all available ranks run the \`${guild.prefix}ranks\` command.\n\nSay **cancel** to cancel`
    );
    const prompt = await editstart(message, quest);
    if (prompt.content === "cancel")
      return message.channel.send(
        embed("none", "Ranking Cancelled", guild, config.failure)
      );
    if (!quest)
      return message.channel.send(
        embed("none", "Cancelled due to no response.", guild, config.failure)
      );
    const check = await ranking(
      bot,
      message,
      guild,
      prompt.content,
      prompt.message
    );
  } else {
    const input = args.slice(0).join(" ");
    const quest = await message.channel.send(
      embed("Rank", `Getting rank ${input}`, guild)
    );
    const check = await ranking(bot, message, guild, input, quest);
  }
};

module.exports.help = {
  name: "getrank",
  module: "user",
  description: 'Gives you the rank in the linked group if you own the specified asset.'
};
