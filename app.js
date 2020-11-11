"use strict"
// https://discord.com/api/oauth2/authorize?client_id=754456135616036954&permissions=1074264128&scope=bot
require('dotenv').config()

let Discord = require('discord.js')
let Leetcode = require('./lib/Leetcode')
let Command = require('./lib/Commands')
let Helper = require('./lib/Helpers')

let client = new Discord.Client()

const TOKEN = process.env.TOKEN
const PREFIX = process.env.PREFIX

client.login(TOKEN)

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)
    Leetcode.getQuestions().then()
  }
);

client.on('message', async (message) => {
  let commands = message.content.split(" ")
  if (commands.length < 1 || commands[0] !== PREFIX + "leetcode") { //ignore if not leetbot
    return
  } else if (commands.length === 1) { // return random question if no options are used
    return Command.returnRandomQuestion(message)
  } else if (commands.length > 2) { // return question by title
    let title = commands.slice(1).join(" ")
    return Command.searchQuestionTitle(message, title)
  } else if (Helper.isNumber(commands[1])) { // return question by ID
    return Command.searchQuestionID(message, commands[1])
  } else { // is a string command
    return Command.parseStringCommands(message, commands[1])
  }
});