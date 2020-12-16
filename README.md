# MaxBot

MaxBot is a discord bot used mostly for private servers.

## Installation

Make sure to have [npm](https://nodejs.org/en/) installed, proceed to bot folder and use
```bash
npm install
```

## Usage

* This requires you to have a Discord developer application creted, which allows you to get required token from. 
* Additional Youtube API in order to stream music to server users.
* Replace .env_sample with .env file that contains your private keys.

```bash
node index.js
```

## Creating a new command
Use the cmds folder, in which create a JS file containing:
```javascript
const Discord = require("discord.js");
module.exports.run = async (bot, message, args) => {
//Your code.
};

module.exports.help = {
	name: "Your_Command_name"
}
```

