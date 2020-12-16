module.exports.run = async (bot, message, args) => {
  //returns some useful info about a Osu! game player.
  const osu = require('node-osu');
	const api = new osu.Api(process.env.OSU , { //api osu
	  notFoundAsError: true,
	  completeScores: false 
	});


  let username = message.content.trim().split(' ')[1]


api.getUser({u: username}).then(user => {
  const embed = new (require('discord.js').RichEmbed)()
  .setTitle('User Osu Search System')
  .setDescription(`Basic player info`)
  .setThumbnail(`http://s.ppy.sh/a/${user.id}}`)
  .setColor("#D0436A")
  .addField('Nickname', user.name, true)
  .addField('PP', Math.round(user.pp.raw), true)
  .addField('Rank', user.pp.rank, true)
  .addField('Level', Math.round(user.level), true)
  .addBlankField()
  .addField('Country', user.country, true)
  .addField('Country Rank', user.pp.countryRank, true)
  .addField('Playcount', user.counts.plays, true)
  .addField('Accuracy', `${user.accuracyFormatted}`, true)
  .setFooter('Requested By ' + message.author.tag, message.author.avatarURL)
  message.channel.send(embed)
  
});
};

module.exports.help = {
	name: "osu"
}