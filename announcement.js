const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./auth.json');
const events = require ('./events.json');
client.login(config.token).then(() => {
  var args = process.argv.slice(2);
  var time = args[0].split('=')[1]; 
  var today = new Date().getDay()
  var channel = client.guilds.get(config.guildId).channels.get('511597925046943752');
  var eventInfo = events[today][time];
	if (Object.keys(eventInfo).indexOf('image') !== -1) {
		var embed = new Discord.RichEmbed()
			.setTitle(eventInfo['title'])
			.setColor(0x4eff87)
			.setImage(eventInfo['image']);
	} 
  channel.send(eventInfo['content'], embed).then(() => {
    client.destroy();
  });
});
