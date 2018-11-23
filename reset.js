const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./auth.json');
const events = require ('./events.json');
client.login(config.token).then(() => {
  var days = ['', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  var today = new Date().getDay();
  var channel = client.guilds.get(config.guildId).channels.get('511596989004120066');
  var eventsList = '';
  var keys = Object.keys(events[today]);
  keys.forEach(function(time) {
    if (time !== 'Hourly' && time !== 'Reset') {
      eventsList +=	'**' + time + '** - ' + events[today][time]['title'] + '\n';
    }
  });
  var embed = new Discord.RichEmbed()
    .setTitle('Events for today')
    .setColor(0xff4e73)
    .setDescription(eventsList);
  channel.send('Dailies have been reset.');
  channel.send('Today is **' +  days[today] + '**. Here\'s a list of all events for the day.', embed).then(() => {
    try {
      var eventInfo = events[today]['Reset'];
      channel.send(eventInfo['content']);
    } catch(ex) {
    } finally {
      client.destroy();
    }
  });
});
