"use strict"
// https://discord.com/api/oauth2/authorize?client_id=754456135616036954&permissions=1074264128&scope=bot
require('dotenv').config();

let Discord = require('discord.js')
let Leetcode = require('./lib/leetcode')
let TurndownService = require('turndown')

let client = new Discord.Client()
let turndownService = new TurndownService()

const TOKEN = process.env.TOKEN;
const PREFIX = process.env.PREFIX;

client.login(TOKEN);

/**
 * Formats the leetcode question
 * 
 * @param {*} question The leetcode question to be formatted.
 * @returns The formatted leetcode question as a string
 */
function formatQuestion(question) {
  console.log(question)
  let description = question.content ? turndownService.turndown(question.content) : ""
  return `__**${question.title} #${question.questionId} - ${question.difficulty}**__\n
    ` + description +"\n" +
    "\n" +
    `https://leetcode.com/problems/${question.titleSlug}`
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
  }
);

client.on('message', async (message) => {
  let commands = message.content.split(" ")

client.on('message', async (msg) => {
  let commands = msg.content.split(" ")
  if (commands.length < 1 || commands[0] !== PREFIX + "leetcode") {
    return
  }

  if (commands.length == 1) {
    let q = await Leetcode.getRandomQuestion()
    message.channel.send(formatQuestion(q),{split: true});
    return
  }

  if (commands[1] === "help") {
    message.channel.send("**Leetcode Bot**\n" +
        "Get good at Leetcode\n" +
        "\n" +
        "**!leetcode**: Random Leetcode Question\n" +
        "**!leetcode -<Number>**: Leetcode Question by ID\n" +
        "**!leetcode <Title>**: Leetcode Question by Title\n" +
        "**!leetcode <easy/medium/hard>**: Leetcode Question by Difficulty")

    return
  }

  if (commands[1].startsWith("-")) {
    let id = parseInt(commands[1].substring(1))
    if (isNaN(id)) {
      message.channel.send("Please a valid question ID")
      return
    }
    try {
      let q = await Leetcode.getQuestionById(id)
      message.channel.send(formatQuestion(q),{split: true});
    } catch(error) {
      message.channel.send(error)
    }
    return
  }

  let difficulties = ['easy', 'medium', 'hard']
  
  if (difficulties.includes(commands[1].toLowerCase())){
    let randomQuestion = await Leetcode.getRandomQuestion(difficulties.indexOf(commands[1].toLowerCase()))
    message.channel.send(formatQuestion(randomQuestion),{split: true});
    return
  }

  let title = commands.slice(1).join(" ")
  try {
    let question = await Leetcode.getQuestionByTitle(title)
    message.channel.send(formatQuestion(question),{split: true});
  } catch(error) {
    message.channel.send(error)
  }

  // PARSE FLAGS

  // while (commands[i] < commands.length && commands[i])

});

(async() => {
  // console.log(await Leetcode.getRandomQuestion())
  // await Leetcode.getQuestionByTitle("Longest Palindromic Substring")
  // await Leetcode.getQuestionByTitle("Longest Palindromic Substring")
})()

