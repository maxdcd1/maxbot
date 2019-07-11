const discord = require("discord.js");
const Util = require("discord.js");
const config = require("./config.json");
const YTDL = require("ytdl-core");
const YouTube = require("simple-youtube-api");
const youtube = new YouTube(config.youtubeApi); //api youtube
const fs = require("fs");
const bot = new discord.Client({ disableEveryone: true });
const prefix = config.prefix;
const queue = new Map();

bot.commands = new discord.Collection();

fs.readdir("./cmds/", (err, files) => {
  if (err) console.error(err);

  let jsfiles = files.filter(f => f.split(".").pop() === "js");
  if (jsfiles.length <= 0) {
    console.log("No commands to load!");
    return;
  }
  console.log(`Loading ${jsfiles.length} commands!`);

  jsfiles.forEach((f, i) => {
    let props = require(`./cmds/${f}`);
    console.log(`${i + 1}: ${f} loaded!`);
    if (props.help && props.help.name) {
      bot.commands.set(props.help.name, props);
    } else {
      console.error(`file ${f} does not have .help or .help.name property!`);
    }
  });
});

function play(connection, message) {
  var server = servers[message.guild.id];
  server.dispatcher = connection.playStream(
    YTDL(server.queue[0], { filter: "audioonly", highWaterMark: 1 << 25 })
  );

  server.queue.shift();

  server.dispatcher.on("end", function() {
    if (server.queue[0]) play(connection, message);
    else connection.disconnect();
  });
}

bot.on("ready", () => {
  console.log(
    "Channels: " +
      bot.channels
        .filter(channel => channel.type === "text" || channel.type === "voice")
        .map((v, i) => v.name)
  ); //w jakich kanalach jest bot
  console.log(
    "Users: " + bot.users.filter(user => !user.bot).map((v, i) => v.username)
  ); //jacy ludzie sa w serverze
  console.log(
    `READY! Serving ${bot.users.size} users in ${
      bot.channels.size
    } channels and ${bot.guilds.size} servers`
  );
  console.log(`Bot is ready! ${bot.user.username}`);
});

bot.on("message", async message => {
  if (message.author.bot) return;
  console.log(`${message.author.username} : ${message.cleanContent}`); //pokazuje nick z wiadomoscia
  let messageArray = message.content.split(/\s+/g);
  let command = messageArray[0];
  let args = messageArray.slice(1);

  if (!command.startsWith(prefix)) return;
  let cmd = bot.commands.get(command.slice(prefix.length));
  if (cmd) cmd.run(bot, message, args);

  //muzyka start
  const argsmusic = message.content.split(" ");
  const searchString = argsmusic.slice(1).join(" ");
  const url = argsmusic[1] ? argsmusic[1].replace(/<(.+)>/g, "$1") : "";
  const serverQueue = queue.get(message.guild.id);

  let commandmusic = message.content.toLowerCase().split(" ")[0];
  commandmusic = command.slice(prefix.length);

  if (commandmusic === "play") {
    const voiceChannel = message.member.voiceChannel;
    if (!voiceChannel)
      return message.channel.send(
        "I'm sorry but you need to be in a voice channel to play music!"
      );
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT")) {
      return message.channel.send(
        "I cannot connect to your voice channel, make sure I have the proper permissions!"
      );
    }
    if (!permissions.has("SPEAK")) {
      return message.channel.send(
        "I cannot speak in this voice channel, make sure I have the proper permissions!"
      );
    }
    if (!url) return message.channel.send("Play what?");

    if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
      const playlist = await youtube.getPlaylist(url);
      const videos = await playlist.getVideos();
      for (const video of Object.values(videos)) {
        const video2 = await youtube.getVideoByID(video.id);
        await handleVideo(video2, message, voiceChannel, true);
      }
      return message.channel.send(
        ` Playlist: **${playlist.title}** has been added to the queue!`
      );
    } else {
      try {
        var video = await youtube.getVideo(url);
      } catch (error) {
        try {
          var videos = await youtube.searchVideos(searchString, 1);
          let index = 1;
          var video = await youtube.getVideoByID(videos[index - 1].id);
        } catch (err) {
          console.error(err);
          return message.channel.send("I could not obtain any search results.");
        }
      }
      return handleVideo(video, message, voiceChannel);
    }
  } else if (commandmusic === "skip") {
    if (!message.member.voiceChannel)
      return message.channel.send("You are not in a voice channel!");
    if (!serverQueue)
      return message.channel.send(
        "There is nothing playing that I could skip for you."
      );
    serverQueue.connection.dispatcher.end("Skip command has been used!");
    return undefined;
  } else if (commandmusic === "stop") {
    if (!message.member.voiceChannel)
      return message.channel.send("You are not in a voice channel!");
    if (!serverQueue)
      return message.channel.send(
        "There is nothing playing that I could stop for you."
      );
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end("Stop command has been used!");
    return undefined;
  } else if (commandmusic === "volume") {
    if (!message.member.voiceChannel)
      return message.channel.send("You are not in a voice channel!");
    if (!serverQueue) return message.channel.send("There is nothing playing.");
    if (!argsmusic[1])
      return message.channel.send(
        `The current volume is: **${serverQueue.volume}**`
      );
    serverQueue.volume = argsmusic[1];
    if (serverQueue.volume > 100 && message.author.id !== "114791567696330756")
      serverQueue.volume = 100;
    if (serverQueue.volume < 0) serverQueue.volume = 100;
    serverQueue.connection.dispatcher.setVolumeLogarithmic(
      serverQueue.volume / 100
    );
    return message.channel.send(
      `I set the volume to: **${serverQueue.volume}**`
    );
  } else if (commandmusic === "np") {
    if (!serverQueue) return message.channel.send("There is nothing playing.");
    return message.channel.send(
      `Now playing: **${serverQueue.songs[0].title}**`
    );
  } else if (commandmusic === "queue") {
    if (!serverQueue) return message.channel.send("There is nothing playing.");
    return message.channel.send(`
  __**Song queue:**__
  ${serverQueue.songs.map(song => `**-** ${song.title}`).join("\n")}
  **Now playing:** ${serverQueue.songs[0].title}
      `);
  } else if (commandmusic === "pause") {
    if (serverQueue && serverQueue.playing) {
      serverQueue.playing = false;
      serverQueue.connection.dispatcher.pause();
      return message.channel.send(" Paused the music for you!");
    }
    return message.channel.send("There is nothing playing.");
  } else if (commandmusic === "resume") {
    if (serverQueue && !serverQueue.playing) {
      serverQueue.playing = true;
      serverQueue.connection.dispatcher.resume();
      return message.channel.send(" Resumed the music for you!");
    }
    return message.channel.send("There is nothing playing.");
  }

  return undefined;
});

async function handleVideo(video, message, voiceChannel, playlist = false) {
  const serverQueue = queue.get(message.guild.id);
  //console.log(video); info o video
  const song = {
    id: video.id,
    title: Util.escapeMarkdown(video.title),
    url: `https://www.youtube.com/watch?v=${video.id}`
  };
  if (!serverQueue) {
    const queueConstruct = {
      textChannel: message.channel,
      voiceChannel: voiceChannel,
      connection: null,
      songs: [],
      volume: 50,
      playing: true
    };
    queue.set(message.guild.id, queueConstruct);

    queueConstruct.songs.push(song);

    try {
      var connection = await voiceChannel.join();
      queueConstruct.connection = connection;
      play(message.guild, queueConstruct.songs[0]);
    } catch (error) {
      console.error(`I could not join the voice channel: ${error}`);
      queue.delete(message.guild.id);
      return message.channel.send(
        `I could not join the voice channel: ${error}`
      );
    }
  } else {
    serverQueue.songs.push(song);
    console.log(serverQueue.songs);
    if (playlist) return undefined;
    else
      return message.channel.send(
        ` **${song.title}** has been added to the queue!`
      );
  }
  return undefined;
}

function play(guild, song) {
  const serverQueue = queue.get(guild.id);

  if (!song) {
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }
  console.log(serverQueue.songs);

  const dispatcher = serverQueue.connection
    .playStream(YTDL(song.url))
    .on("end", reason => {
      if (reason === "Stream is not generating quickly enough.")
        console.log("Song ended.");
      else console.log(reason);
      serverQueue.songs.shift();
      play(guild, serverQueue.songs[0]);
    })
    .on("error", error => console.error(error));
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 100);

  serverQueue.textChannel.send(`Start playing: **${song.title}**`);
  //muzyka stop
}

bot.login(config.token);
