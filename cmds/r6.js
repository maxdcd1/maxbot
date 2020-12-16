const snekfetch = require("snekfetch");
const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
  //Return useful info about Rainbow6Siege game player.
  /* *********************
	WEBSITE SHUT DOWN, searching for alternatives
	   *********************
	*/

  message.channel.send("Command out of order, website no longer exists. Please await update");

  //code
  // 	let nick=args[0];
  // const api = `https://r6tab.com/api/search.php?platform=uplay&search=${nick}`;
  // snekfetch.get(api).then(r =>{

  // 	if(!nick) return message.channel.send("Supply a name");
  // 	//console.log(r.body);

  // 	let embed = new Discord.RichEmbed()
  // 	.setColor('#0099ff')
  // 	.setTitle('R6 stats')
  // 	.setURL(`https://r6tab.com/${r.body.results[0].p_user}`)
  // 	.setThumbnail(`https://ubisoft-avatars.akamaized.net/${r.body.results[0].p_user}/default_146_146.png`)
  // 	.setAuthor(r.body.results[0].p_name)
  // 	.addField("Level: ", r.body.results[0].p_level, true)
  // 	.addField('MMR: ',r.body.results[0].p_currentmmr, true)

  // 	message.channel.send({embed:embed});
};

module.exports.help = {
  name: "r6",
};
