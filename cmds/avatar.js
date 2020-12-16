module.exports.run = async (bot, message, args) => {
    //Returns users avatar.
    const Discord = require("discord.js");
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