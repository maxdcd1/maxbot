module.exports.run = async (bot, message, args) => {
	//message.reply("pong");
	//message.channel.send('pong');
	const Discord = require("discord.js");
	const client = new Discord.Client();
	const m = await message.channel.send("Ping?");
    m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
};

module.exports.help = {
	name: "ping"
}