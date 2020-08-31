const rbx = require("noblox.js");
const Discord = require("noblox.js");
const verificationModel = require("../../models/verificationModel/verification");
const guildModel = require('../../models/guildModel/guild')
const prompt = require("../../prompt/index");
const config = require("../../config.json");
const embed = require("../../functions/embed");
const fetch = require("node-fetch");

module.exports.run = async (bot, message, args, guild) => {
  if (message.author.id !== message.guild.owner.id)
    return message.channel.send(
      embed(
        "none",
        "Only the owner can bind a group the discord for safety purposes."
      )
    );
  if (!verificationModel.findOne({ userID: message.author.id }))
    return message.channel.send(
      embed("none", "You must be verified to setup a group.")
    );
  const user = await verificationModel.findOne({ userID: message.author.id });
  const username = await rbx.getUsernameFromId(user.primaryAccount);
  const numbers = new RegExp("^[0-9]+$");
  const setup1 = embed(
    "Group Setup",
    "What is the **ID** of the group?\nThis will wipe all bindings for the group with this id or previous main group.\n\nRespond **cancel** to cancel",
    guild
  );
  const groupid = await prompt.editStart(message, setup1);
  if (groupid.content.toLowerCase() === 'cancel') { groupid.message.delete({ timeout: 10}); return message.channel.send('Cancelled')}
  const numbercheck = numbers.test(groupid.content);
  if (numbercheck === false)
    return message.channel.send(
      embed("none", "Please give a valid group ID.", guild, config.failure)
    );
  fetch(`https://groups.roblox.com/v1/groups/${groupid.content}`)
    .then((response) => response.json())
    .then((body) => {
        if (body.owner === undefined) return message.channel.send(embed('none', 'Please give a valid group ID.', guild, config.failure))
      const parsed = parseInt(user.primaryAccount);
      if (parsed !== body.owner.userId)
        return message.channel.send(
          embed(
            "none",
            `Error: You are not the owner of group **${body.name}**`,
            guild,
            config.failure
          )
        );
    });
    let binding = false
    // Ask them if they want to bind the guild ranks
    const askToBind = embed(
      "Rank Binding",
      `Would you like to bind your group ranks to the Server?\n*Note:* If you do not create them now, you can create them later with the command \`${guild.prefix}bind group [rank] [tag: tag or none] [role, roles]\`\n\nRespond \`yes\` or \`no\`\nRespond **cancel** to cancel.`,
      guild,
      'def', false
    )
  const bindingask = await prompt.editPrompt(message, groupid.message, askToBind, "lower")
    // Check their response
    let boundRoles = 0
  if (bindingask.startsWith('y')) {binding = true}
  else {boundRoles = 'none'}
  if (bindingask === 'cancel') { groupid.message.delete({ timeout: 10 }); return message.channel.send('**Cancelled Setup**')}
  if (binding === true) {
    // Ask them to bind if true
    const setup3 = embed(
      "Group Setup",
      "Would you like me to ``merge`` or ``replace`` your group ranks?\n**This will not delete any roles associated with the bot, such as: assetbinds, gamepassbinds and moderation roles.**\n\n Say `cancel` to cancel.",
      guild,
      'def',
      false
    );
    const rankask = await prompt.editPrompt(message, groupid.message, setup3, "lower");
    if (rankask === "merge") {
      const mergeRank = require("../../functions/setupFunctions/mergeRank");
      const mergeRankFunc = await mergeRank(
        bot,
        message,
        groupid.message,
        groupid.content,
        guild,
        'def',
        false,
      );
      boundRoles = mergeRankFunc
    }
    if (rankask === "replace") {
      const replaceRank = require("../../functions/setupFunctions/replaceRank");
      const replaceRankFunc = await replaceRank(bot, message, groupid.message, groupid.content, guild)
      boundRoles = replaceRankFunc
    }
  }

  // Ask them if they want to change the Verified Role

  const setup2 = embed(
    "Group Setup",
    "Would you like to change the Verified role to something else? \n\nRespond `yes` or `no` or `skip` to skip\nRespond `cancel` to cancel.",
    guild
  );
  const verifiedcheck = await prompt.editPrompt(message, groupid.message, setup2, 'lower');
  if (verifiedcheck === "cancel")
    return message.channel.send("**Cancelled Setup**");
  if (verifiedcheck.startsWith('y')) {
    const roleChange = require("../../functions/verifyFunctions/verifiedRoleChange");
    verifiedRole = await roleChange(bot, message, guild, groupid.message);
  }
  if (verifiedcheck.startsWith('n')) {
    const roleCreate = require("../../functions/verifyFunctions/verifiedRoleCreate");
    verifiedRole = await roleCreate(bot, message, guild);
  }
  if (verifiedcheck === 'skip') verifiedRole = 'skipped'

  console.log(verifiedRole)

  const setup4 = embed(
    "Group Setup Complete",
    `You're Discord has been successfully bound to group \`${groupid.content}\`\nVerified Role: ${verifiedRole}\n Bound Roles: ${boundRoles}`,
    guild
  );
  const thumbnail = require('../../functions/thumbnailFunction')
  const groupThumb = await thumbnail(groupid.content, '420', 'group')
  setup4.setThumbnail(groupThumb)
  groupid.message.edit(setup4)
  await guildModel.findOne({ guildID: message.guild.id }, function (err, info) {
    info.robloxGroup = groupid.content;
    info.save();
  });
};

module.exports.help = {
  name: "setup",
  module: "settings",
  description: "Bind a roblox group to your discord.",
  cooldown: "30"
};
