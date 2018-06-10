const Discord = require('discord.js');

const bot = new Discord.Client(); //create a new instance 
const TOKEN = "YOUR TOKEN HERE";

const PREFIX = ".changerole";
const ROLES = ["role1", "role2", "role3", "role4"];
const COMMANDS = [".roles", ".dm", ".commands", ".purge", ".call"];

bot.on('guildMemberAdd', function(member) {
    const channel = member.guild.channels.find('name', 'general');
    if(!channel){ //if the channel wasn't found, do nothing.
        return;
    }

    channel.send(`Welcome ${member}! for a current list of commands type .commands`);
});

function callAPI(){
    let req = new XMLHttpRequest();
    req.open('GET', 'https://api.xivdb.com/');
    req.onreadystatechange = function() {
        const DONE = 4, OK =  200;
        return (req.readyState === DONE && req.status === OK) ? req.responseText :  `error: ${req.status}`;
    }
}


bot.on('message', function(message){ //when we receive a message, run the callback passing in message.
    if(message.author.bot) return; //ignore all other bots, including itself.

    message.content === ".commands" ? show("commands", message) : null;
    message.content === ".roles" ? show("roles", message) : null;
    message.content === ".dm" ? sendPics(message) : null;
    message.content === ".purge" ? purge(message) : null;
    message.content === ".call"  ? show("api", message) : null;

    let mess = message.content.split(' ');
    if(mess[0] === PREFIX){
        if(ROLES.includes(mess[1])){
            message.channel.send(`${message.author} is now a ${mess[1]}.`);
        }else{
            message.channel.send("Invalid command, please type .roles for a list of selectable roles.");
        }
    }
});

function show(request, message){
    let output = "";
    if(request === "roles"){
        ROLES.forEach( (role) => {
            output += `${role}\n`;
        });
    } else if (request === "commands"){
        COMMANDS.forEach( (command) => {
            output += `${command}\n`;
        });
    } else if (request === "api"){
        output = callAPI();
    }
    message.channel.send(output);
}

function sendPics(message){
    let preface = "http://i.imgur.com/DRQax.jpg";
    message.channel.send(preface);
    let imgArr = ["http://i.imgur.com/MHuW96t.gif","https://i.imgur.com/PNqRVgl.jpg","https://i.imgur.com/Z0hY549.jpg","https://i.imgur.com/7xcLoWF.jpg" ];
    let count = Math.floor(Math.random() * imgArr.length);
    message.author.send(`This DM tests the bot\n${imgArr[count]}`);
}

function purge(message){
    const deleteCount = parseInt(100);

    const fetched = message.channel.fetchMessages({limit: deleteCount});
    message.channel.bulkDelete(fetched).catch(function(error){
        message.reply(`couldn't delete messages because of ${error}`);
    })

}


bot.login(TOKEN); //log the bot in using the token provided on the discord dev page