module.exports.run = async (bot, message, args) => {
    const Discord = require("discord.js");
    //message.reply(message.author.avatarURL);
    const user = message.mentions.users.first() || message.author;
    const avatarEmbed = new Discord.RichEmbed()
        .setColor(0x333333)
        .setAuthor(user.username)
        .setImage(user.avatarURL);
    message.channel.send(avatarEmbed);
}

module.exports.help = {
	name: "avatar"
}