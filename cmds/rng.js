module.exports.run = async (bot, message, args) => {
	//message.channel.send("poruchana komenda btw :)")
	//return;
	let pierwsza=args[0];
	let druga=args[1];
	var pierwszaliczba = parseInt(pierwsza, 10);
	var drugaliczba = parseInt(druga, 10);
	if (isNaN(pierwszaliczba && drugaliczba)){
		message.channel.send("Choose correct number");
	}
	else{
	var random = Math.floor(Math.random()*(`${drugaliczba}`-`${pierwszaliczba}`+1)+`${pierwszaliczba}`);
	message.channel.send(random);
	}
	return;
}

module.exports.help = {
	name: "rng"
}