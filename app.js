// https://www.freecodecamp.org/news/create-a-discord-bot-with-javascript-nodejs/

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const Discord = require("discord.js");
const querystring = require("querystring");   //stringifies into query format
const fetch = require('node-fetch');
require('dotenv').config(); // npm install dotenv --save    // allows .env file to be used

const app = express();

// create an instance of Client
// in order for the bot to react you need to set the intents!
const client = new Discord.Client({
  intents: ['GUILDS', 'DIRECT_MESSAGES', 'GUILD_MESSAGES']
});

// NOTE: .on is jquery, attaches a behavior to an event
// client.on() is used to check for events

// start a "ready" event to make the bot ready to use
// you dont need it, its just to print on your command line saying its ready
client.on("ready", function() {
  console.log(`Logged in as ${client.user.tag}!`)
});


//---------------------------------------
// send random cat photo from the cat API
//---------------------------------------
const url = "https://api.thecatapi.com/v1/images/search";
var query = {
   "size": "small",
   "mime_types": "jpg,png",
   "limit": "1"
}

// creates object into query format
var queryString = querystring.stringify(query);

    // cat bot sends a random cat photo
    client.on("messageCreate", message => {

      if (message.content === "!cat") {

        // fetches data from the cat API
        fetch(url + "?" + queryString, {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.CAT_API_KEY,
          },
        }).then(response => {
          if (response.ok) {
            response.json().then(json => {

            // targets only the "url" key and value and makes it into a json string
            var jsonString = JSON.stringify(json, ["url"]);

            // converts json string into a json object
            var jsonParse = JSON.parse(jsonString);

            // selects only the value, not the key
            var final_url = jsonParse[0]["url"];

            return message.channel.send({
              files: [final_url]
            });
        });
      }
    });
  }
})


// set the port to whatever the environment uses or localhost 3000
app.listen(process.env.PORT || 5000, function() {
  console.log("Server is running...");
});


// Logs the client in, establishing a WebSocket connection to Discord.
client.login(process.env.DISCORD_TOKEN);
