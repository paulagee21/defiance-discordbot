const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./auth.json');
const events = require ('./events.json');
const fs = require('fs');
const schedImg = 'https://media.discordapp.net/attachments/511598388345569326/511794665633218591/WhatsApp_Image_2018-10-11_at_2.12.05_PM.jpeg';
const reminders = 
	'**HIDE OUT PLACE**\nNear priestess and Argenta, café with wooden tables and chairs.\n\n'+
	'**WORLD BOSS 1:30PM DAILY / GUILD BOSS 8:30PM TUE, THURS, SAT**\n\n'+
	'**EVENTS DAILY AT 1:30PM AND 8:30PM ONWARDS**\nDo login during those times.\n\n'+
	'**ALWAYS DO DAILIES, ABYSS, NEST, LAIRS, 20 WILDHUNT, BOUNTIES, DONATIONS with guildmates.**\n\n'+
	'**SIGN IN 50DC/100DC DAILY**\nFor guild contribution and red envelopes.\n\n'+
	'**JOIN SQUAD FOR EASY LAIR LOOTS AND MATS**\nGo to friends > squad to look for a squad. Currently active guild squads : **Oppai** and **Def. All Stars**.\n\n'+
	'**RULES OF TERMINATION**\nWeekly guild activity below 850pts = KICK. Please inform officers if you are busy.';
const helpChannelId = '511598388345569326';
const annChannelId = '511597925046943752';
const ignChannelId = '512185902668185600';
const offChannelId = '511598951854506014';
const meId = '341530438709280768';
 
client.on('ready', () => {
  console.log('I am ready!');
});
 
client.on('message', message => {
  if (message.content.substring(0,1) == config.prefix) {
    var args = message.content.substring(1).split(' ');
    var cmd = args[0];

    switch(cmd) {
      case 'commands':
				var commandList = 
					'**$commands**\nlist all available commands\n\n'+
					'**$schedule**\ndisplays weekly event schedule\n\n'+
					'**$reminder**\nview general reminders\n\n'+
					'**$events**\nlists all events for the day\n\n'+
					'**$events [day]**\nlists all events for specified day\n\n'+
					'**$enlist**\nenlist for any team in guild arena\n\n'+
					'**$enlist [team]**\nenlist for specific team in guild arena\n\n'+
					'**$unenlist**\nunenlist for guild arena\n\n'+
					'**$enlistview**\nview all players currently enlisted for guild arena\n\n'+
					'**$guides**\nlists all guides\n\n'+
					'**$guides [class]**\nlists all guides for specific class\n\n';
				var embed = new Discord.RichEmbed()
					.setTitle('Command List')
					.setDescription(commandList)
					.setFooter('--- Contact AQUA to suggest new features ---');
				var me = message.guild.members.get(meId).toString();
        message.channel.send('Hello! Here\'s a full list of all available commands. To suggest a feature, contact ' + me + '.', embed);
        break;

      case 'schedule':
				var embed = new Discord.RichEmbed()
					.setImage(schedImg);
				message.channel.send('Here\'s the full weekly event schedule.', embed);
        break;

      case 'events':
				var days = ['', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
				var eventsList = '';
				if (args.length > 1) {
					var day = args[1].toLowerCase();
					var day = days.indexOf(day);
					if (day !== -1) {
						var keys = Object.keys(events[day]);
						keys.forEach(function(time) {
							if (time !== 'Hourly' && time !== 'Reset') {
								eventsList +=	'**' + time + '** - ' + events[day][time]['title'] + '\n';
							}
						});
						var embed = new Discord.RichEmbed()
							.setTitle('Events for ' + days[day])
							.setDescription(eventsList);
						message.channel.send('Here\'s a list of all events for ' + days[day] + '.', embed);
						break;
					}
				} 
				var today = new Date().getDay();
				var keys = Object.keys(events[today]);
				keys.forEach(function(time) {
					if (time !== 'Hourly' && time !== 'Reset') {
						eventsList +=	'**' + time + '** - ' + events[today][time]['title'] + '\n';
					}
				});
				var embed = new Discord.RichEmbed()
					.setTitle('Events for today')
					.setDescription(eventsList);
				message.channel.send('Today is **' +  days[today] + '**. Here\'s a list of all events for the day.', embed);
        break;

      case 'enlist':
				fs.readFile(config.guild_arena.enlisted, 'utf8', function(err, data) {
					var file = JSON.parse(data); 
					var enlisted = file['enlisted'];
					var noTeam = Object.keys(enlisted['0']);
					var team1 = Object.keys(enlisted['1']);
					var team2 = Object.keys(enlisted['2']);
					var team3 = Object.keys(enlisted['3']);
					var team = '0' 
					var officers = message.guild.roles.find(role => role.name === 'officer');
					if (noTeam.indexOf(message.author.id) !== -1 || team1.indexOf(message.author.id) !== -1 || team2.indexOf(message.author.id) !== -1 || team3.indexOf(message.author.id) !== -1) {
						message.channel.send('You have already enlisted for guild arena. To view the teams, use the command **$enlistview**.');
					} else {
						if (args.length > 1) {
							if (args[1] == '1') {
								if (team1.length < 6) {
									team = '1';
								} else {
									message.channel.send('The team you have selected is full! You will be enlisted but will not be assigned a team...');
								}
							} else if (args[1] == '2') {
								if (team2.length < 6) {
									team = '2';
								} else {
									message.channel.send('The team you have selected is full! You will be enlisted but will not be assigned a team...');
								}
							} else if (args[1] == '3') {
								if (team3.length < 6) {
									team = '3';
								} else {
									message.channel.send('The team you have selected is full! You will be enlisted but will not be assigned a team...');
								}
							} 
					}
					enlisted[team][message.author.id] = message.member.displayName; 
					enlisted = JSON.stringify({'enlisted': enlisted });
					fs.writeFile(config.guild_arena.enlisted, enlisted, 'utf8', function() {
						message.channel.send('You have successfully enlisted for guild arena. To view the teams, use the command **$enlistview**. To unenlist, use the command **$unenlist**.');
						var offChannel = client.guilds.get(config.guildId).channels.get(offChannelId);
						offChannel.send('**[ IMPORTANT ]**\n**' + message.member.displayName + '** has enlisted for guild arena. To view the teams, use the command **$enlistview**. ' + officers.toString()); 
					});
				}

				//var today = new Date().getDay();
				//if (today == 2 || today == 4) {
				//} else {
				//	message.channel.send('There is no guild arena today. You may only enlist on Tuesday and Thursday.', embed);
				//}
				});
        break;
			case 'enlistmove':
				var officer = message.guild.roles.find(role => role.name === 'officer');
				if (message.member.roles.has(officer.id)) {
					if (args.length < 3) {
							message.channel.send('Invalid syntax. The correct usage of $enlistmove is: **$enlistmove [name] [team]** (e.g. $enlistmove Aϙᴜᴀ 2)');
							break;
					}
					var user = args[1];
					var team = args[2];
					fs.readFile(config.guild_arena.enlisted, 'utf8', function(err, data) {
						var file = JSON.parse(data); 
						var enlisted = file['enlisted'];
						var noTeam = Object.keys(enlisted['0']);
						var team1 = Object.keys(enlisted['1']);
						var team2 = Object.keys(enlisted['2']);
						var team3 = Object.keys(enlisted['3']);

						if (team == '1' && team1.length >= 6) {
								message.channel.send('The team you have selected is full!');
								return;
						} else if (team == '2' && team2.length >= 6) {
								message.channel.send('The team you have selected is full!');
								return;
						} else if (team == '3' && team3.length >= 6) {
								message.channel.send('The team you have selected is full!');
								return;
						} else if (team != '1' && team != '2' && team != '3'){
							message.channel.send('Invalid team number.');
							return;
						}

						var found = false;

						//CHECK NO TEAM
						noTeam.forEach(function(id) {
							if (enlisted['0'][id] == user) {
								found = true;
								delete enlisted['0'][id];
								enlisted[team][id] = user;
								enlisted = JSON.stringify({'enlisted': enlisted });
								fs.writeFile(config.guild_arena.enlisted, enlisted, 'utf8', function() {
									message.channel.send('You have successfully moved ' + user + 'to team ' + team + '. To view the teams, use the command **$enlistview**.');
								});
								return;
							}
						});

						//CHECK TEAM 1
						team1.forEach(function(id) {
							if (enlisted['1'][id] == user) {
								found = true;
								delete enlisted['1'][id];
								enlisted[team][id] = user;
								enlisted = JSON.stringify({'enlisted': enlisted });
								fs.writeFile(config.guild_arena.enlisted, enlisted, 'utf8', function() {
									message.channel.send('You have successfully moved ' + user + 'to team ' + team + '. To view the teams, use the command **$enlistview**.');
								});
								return;
							}
						});

						//CHECK TEAM 2
						team2.forEach(function(id) {
							if (enlisted['2'][id] == user) {
								found = true;
								delete enlisted['2'][id];
								enlisted[team][id] = user;
								enlisted = JSON.stringify({'enlisted': enlisted });
								fs.writeFile(config.guild_arena.enlisted, enlisted, 'utf8', function() {
									message.channel.send('You have successfully moved ' + user + 'to team ' + team + '. To view the teams, use the command **$enlistview**.');
								});
								return;
							}
						});

						//CHECK TEAM 3
						team3.forEach(function(id) {
							if (enlisted['3'][id] == user) {
								found = true;
								delete enlisted['3'][id];
								enlisted[team][id] = user;
								enlisted = JSON.stringify({'enlisted': enlisted });
								fs.writeFile(config.guild_arena.enlisted, enlisted, 'utf8', function() {
									message.channel.send('You have successfully moved ' + user + 'to team ' + team + '. To view the teams, use the command **$enlistview**.');
								});
								return;
							}
						});

						if (!(found)) {
							message.channel.send('The user you have entered \''+ user + '\' does not exist or has not yet enlisted for guild arena.');
						}
					});
				} else {
					message.channel.send('Oops. Only officers may use this command. To switch teams, please inform any of the officers.');
				}
				break;

			case 'unenlist':
				fs.readFile(config.guild_arena.enlisted, 'utf8', function(err, data) {
					var file = JSON.parse(data); 
					var enlisted = file['enlisted'];
					var noTeam = Object.keys(enlisted['0']);
					var team1 = Object.keys(enlisted['1']);
					var team2 = Object.keys(enlisted['2']);
					var team3 = Object.keys(enlisted['3']);
					var officers = message.guild.roles.find(role => role.name === 'officer');
					if (noTeam.indexOf(message.author.id) !== -1 || team1.indexOf(message.author.id) !== -1 || team2.indexOf(message.author.id) !== -1 || team3.indexOf(message.author.id) !== -1) {
						if (noTeam.indexOf(message.author.id) !== -1) {
							delete enlisted['0'][message.author.id];
						} else if (team1.indexOf(message.author.id) !== -1) {  
							delete enlisted['1'][message.author.id];
						} else if (team2.indexOf(message.author.id) !== -1) {
							delete enlisted['2'][message.author.id];
						} else if (team3.indexOf(message.author.id) !== -1) {
							delete enlisted['3'][message.author.id];
						}
						enlisted = JSON.stringify({'enlisted': enlisted });
						fs.writeFile(config.guild_arena.enlisted, enlisted, 'utf8', function() {
							message.channel.send('You have been unenlisted for guild arena. To view the teams, use the command **$enlistview**.');
							var offChannel = client.guilds.get(config.guildId).channels.get(offChannelId);
							offChannel.send('**[ IMPORTANT ]**\n**' + message.member.displayName + '** has unenlisted for guild arena. To view the teams, use the command **$enlistview**. ' + officers.toString()); 
						});
					} else {
						message.channel.send('You are currently not enlisted for guild arena. To view the teams, use the command **$enlistview**.');
					}

				});
				break;

      case 'enlistview':
				fs.readFile(config.guild_arena.enlisted, 'utf8', function(err, data) {
					var file = JSON.parse(data); 
					var enlisted = file['enlisted'];
					//var userId = Object.keys(enlisted); 

					//TEAM 1
					var team1List = '**TEAM 1**\n';
					var team1 = enlisted['1'];
					var team1Ids = Object.keys(team1);
					if (team1Ids.length > 0) {
						team1Ids.forEach(function(id) {
							team1List += '• ' + team1[id] + '\n';
						});
					} else {
						team1List += 'No player has been assigned to team 1.\n'	
					}

					//TEAM 2
					var team2List = '**TEAM 2**\n';
					var team2 = enlisted['2'];
					var team2Ids = Object.keys(team2);
					if (team2Ids.length > 0) {
						team2Ids.forEach(function(id) {
							team2List += '• ' + team2[id] + '\n';
						});
					} else {
						team2List += 'No player has been assigned to team 2.\n'	
					}

					//TEAM 3
					var team3List = '**TEAM 3**\n';
					var team3 = enlisted['3'];
					var team3Ids = Object.keys(team3);
					if (team3Ids.length > 0) {
						team3Ids.forEach(function(id) {
							team3List += '• ' + team3[id] + '\n';
						});
					} else {
						team3List += 'No player has been assigned to team 3.\n'	
					}

					//NO TEAM ASSIGNED
					var noTeamList = ''	
					var noTeam = enlisted['0'];
					var noTeamIds = Object.keys(noTeam);
					if (noTeamIds.length > 0) {
						noTeamList += 'The following players have enlisted but are not yet assigned to a team:\n• ';
						var tmp = [] 
						noTeamIds.forEach(function(id) {
							tmp.push(noTeam[id]);
						})
						noTeamList += tmp.join(', ');
					} 

					if (noTeamIds.length < 1 && team1Ids.length < 1 && team2Ids.length < 1 && team3Ids.length < 1) {
						message.channel.send('Nobody has enlisted for guild arena yet. To enlist, use the command **$enlist**.')
					} else {
						var embed = new Discord.RichEmbed()
							.setDescription(team1List + '\n' + team2List + '\n' + team3List + '\n' + noTeamList)
							.setColor(0x5f44d1);
						message.channel.send('Here are all of the players who have enlisted for guild arena. To enlist, use the command **$enlist**. To unenlist, use the command **$unenlist**.', embed); 
					}
				});
        break;

      case 'guides': 
				var guideList = 
					'• [How to increase your BP](https://discordapp.com/channels/511596989004120064/511598388345569326/514741308343189504)';
				var embed = new Discord.RichEmbed()
					.setDescription(guideList);
				message.channel.send('More guides will be added in the future.', embed);
        break;

			case 'reminder':
				var helpChannel = client.guilds.get(config.guildId).channels.get(helpChannelId).toString();
				var annChannel = client.guilds.get(config.guildId).channels.get(annChannelId).toString();
				var embed = new Discord.RichEmbed()
					.setDescription(reminders);
				message.channel.send(embed).then(function() {
					message.channel.send('Need in-game help? Go ask a question at '+ helpChannel + ' or use the command **$guides** to view available game guides.');
					message.channel.send('For important announcements and reminders, check out ' + annChannel + '.');
					message.channel.send('Type **$commands** to view a full list of available commands.\n');
				});
				break;

			default:
				message.channel.send('The command you have entered is invalid. Type **$commands** to view a full list of available commands.\n');
        break;
    }
  }

	if (message.isMentioned(client.user)) {
		message.channel.send('Hello ' + message.author + '! Need help? Type **$commands** to view all available commands.')
	}
});

client.on('guildMemberAdd', member => {
	var helpChannel = client.guilds.get(config.guildId).channels.get(helpChannelId).toString();
	var ignChannel = client.guilds.get(config.guildId).channels.get(ignChannelId).toString();
	var annChannel = client.guilds.get(config.guildId).channels.get(annChannelId).toString();
  var channel = client.guilds.get(config.guildId).channels.get('511858604475940869');
	var embed = new Discord.RichEmbed()
		.setDescription(reminders);
  channel.send(`Welcome to **Defiance [DNM S93]**, ${member}! Please enjoy your stay. Do read everything written below before anything else:`, embed);
	var sched = new Discord.RichEmbed()
		.setImage(schedImg);
  channel.send('Here\'s the full weekly event schedule. Remember to save it on your device or use the command **$schedule** to view it.', sched).then(function() {
		channel.send('Don\'t forget to post your in-game name at '+ ignChannel + ' to get access to other channels.');
		channel.send('For important announcements and reminders, check out ' + annChannel + '.');
		channel.send('Need in-game help? Go ask a question at '+ helpChannel + ' or use the command **$guides** to view available game guides.');
		channel.send('Type **$commands** to view a full list of available commands.\n');
	});
});
 
client.login(config.token);
