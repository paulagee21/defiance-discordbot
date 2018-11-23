const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./auth.json');
const events = require ('./events.json');
client.login(config.token).then(() => {
  var args = process.argv.slice(2);
  var time = args[0].split('=')[1]; 
  var today = new Date().getDay();
  var hour = new Date().getHours();
  var channel = client.guilds.get(config.guildId).channels.get('511596989004120066');
  var eventInfo = events[today][time];
  var timerange = eventInfo['timerange'].split('-');
  if (timerange[0] <= hour && hour <= timerange[1]) {
    channel.send(eventInfo['content']).then(() => {
      client.destroy();
    });
  }
});
