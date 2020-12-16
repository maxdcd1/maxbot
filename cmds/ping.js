module.exports.run = async (bot, message, args) => {
	//Check latency between the bot and discord.
	const Discord = require("discord.js");
	const client = new Discord.Client();
	const m = await message.channel.send("Ping?");
    m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
};

module.exports.help = {
	name: "ping"
}