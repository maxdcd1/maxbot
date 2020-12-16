module.exports.run = async (bot, message, args) => {
    //Shows info about user.
    const discord = require("discord.js");
let embed = new discord.RichEmbed()
    .setAuthor(message.author.username)
    .setDescription("This is the user's info")
    .setColor("#00CED1")
    .addField("Full username", message.author.tag)
    .addField("Created at", message.author.createdAt);

    message.channel.send({embed: embed});
    return;
}

module.exports.help = {
	name: "info"
}