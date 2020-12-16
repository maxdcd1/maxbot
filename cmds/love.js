module.exports.run = async (bot, message, args) => {
  //Just a "fun" command, takes ID of two users and compares them which results in a "love meter".
  let firstMention = msg.mentions.members.first();
  let lastMention = msg.mentions.members.last();
  if (msg.mentions.members.size === 1) lastMention = msg.member;
  if (msg.mentions.members.size === 0) return;
  let result =
    50 -
    (parseInt(firstMention.id.slice(-4, -2)) +
      parseInt(lastMention.id.slice(-4, -2)));
  if (result < 0) result = Math.abs(result);
  else if (result < 50) result = 100 - result;
  let resultString = "";

  msg.channel.send(
    new discord.RichEmbed()
      .setAuthor(
        "❤️ Love Meter ❤️",
        msg.author.displayAvatarURL || msg.author.defaultAvatarURL
      )
      .setDescription(
        `:heartpulse: ${firstMention}\n:heartpulse: ${lastMention}\n\n${result}% || ${new Array(
          Math.round(result / 2.5)
        ).join("​█")}${new Array(Math.round((100 - result) / 2.5)).join(
          "   "
        )} ||`
      )
      .setColor([201, 55, 86])
  );
  return;
};

module.exports.help = {
  name: "love"
};
