const noblox = require("noblox.js");
const { MessageEmbed, User, Guild } = require("discord.js");
const editprompt = require("../../prompt/editprompt");
const verificationModel = require("../../models/verificationModel/verification");
const embed = require("../embed");
const fetch = require("node-fetch");
const getRank = require('../../lib/roblox/group//getGroupRanks');

module.exports = async (bot, message, guild, rank, msgToEdit) => {
  const val = undefined
  noblox.setCookie(guild.robloxToken);
  const userrank = guild.rankBinds.find(
    (element) => element.name.toLowerCase() === rank.toLowerCase()
  );
  if (userrank === undefined)
    return msgToEdit.edit(
      embed("none", "Could not find the given rank.", guild)
    );
  const usersearch = await verificationModel.findOne({
    userID: message.author.id,
  });
  const user = usersearch.primaryAccount;

  const search = await fetch(
    `http://api.roblox.com/Ownership/HasAsset?userId=${user}&assetId=${userrank.assetID}`
  )
    .then((response) => response.json())
    .then((body) => {
      return body;
    });
  if (search === false)
    return msgToEdit.edit(
      embed(
        "none",
        `Ranking Cancelled: You do not own the required asset for that rank. To see available ranks run the \`${guild.prefix}ranks command.\``,
        guild
      )
    );
  msgToEdit.edit(embed("none", "Ranking you in the group please wait.", guild));
  const userRank = await getRank(guild.robloxGroup, user, "name");
  const setrank = parseInt(userrank.rank);
  const ranking = await noblox
    .setRank({ group: guild.robloxGroup, target: user, rank: setrank })
    .catch((msg) => {
      value = msg;
      if (msg === '403')
        return message.channel.send(
          embed(
            "none",
            "Sorry, I do not have enough permissions to change your rank.",
            guild
          )
        );
      else {
        return message.channel.send(
          embed("none", "Error, Please notify a bot developer.", guild)
        );
      }
    });
    if (value !== '403') {
      const success = new MessageEmbed()
      .setTitle("Ranking Successful")
      .setDescription(`Your rank has successfully been changed to ${userRank}`);
      await msgToEdit.edit(success);
    }
};
