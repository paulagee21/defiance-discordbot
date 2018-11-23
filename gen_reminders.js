const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./auth.json');
const events = require ('./events.json');
const reminders = 
  '**HIDE OUT PLACE**\nNear priestess and Argenta, café with wooden tables and chairs.\n\n'+
  '**WORLD BOSS 1:30PM DAILY / GUILD BOSS 8:30PM TUE, THURS, SAT**\n\n'+
  '**EVENTS DAILY AT 1:30PM AND 8:30PM ONWARDS**\nDo login during those times.\n\n'+
  '**ALWAYS DO DAILIES, ABYSS, NEST, LAIRS, 20 WILDHUNT, BOUNTIES, DONATIONS with guildmates.**\n\n'+
  '**SIGN IN 50DC/100DC DAILY**\nFor guild contribution and red envelopes.\n\n'+
  '**JOIN SQUAD FOR EASY LAIR LOOTS AND MATS**\nGo to friends > squad to look for a squad. Currently active guild squads : **Oppai** and **Def. All Stars**.\n\n'+
  '**RULES OF TERMINATION**\nWeekly guild activity below 850pts = KICK. Please inform officers if you are busy.';
client.login(config.token).then(() => {
  var channel = client.guilds.get(config.guildId).channels.get('511596989004120066');
  var embed = new Discord.RichEmbed()
    .setColor(0x4eff87)
    .setDescription(reminders);
  channel.send(embed).then(() => {
		channel.send('Type **$commands** to view a full list of available commands.\n');
    client.destroy();
  });
});
