
const snekfetch = require("snekfetch");
const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
const api = `https://nekos.life/api/pat`;
snekfetch.get(api).then(r =>{

	//console.log(r.body);

	let Embed = new Discord.RichEmbed()
        .setColor(0x333333)
        .setImage(r.body.url);
    message.channel.send(Embed);
	
});

}

module.exports.help = {
	name: "pat"
}