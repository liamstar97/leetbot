'use-strict'

let Leetcode = require('./Leetcode')
let Response = require('./Responses')

const PREFIX = process.env.PREFIX

class Commands {

  static async parseStringCommands(message, commands) {
    let randomQuestion;
    switch (commands) {
      case "help":
        message.channel.send("**Leetcode Bot**\n" +
          "Get good at Leetcode\n" +
          "\n" +
          "**" + PREFIX + "leetcode**: Random Leetcode Question\n" +
          "**" + PREFIX + "leetcode <Number>**: Leetcode Question by ID\n" +
          "**" + PREFIX + "leetcode <Title>**: Leetcode Question by Title\n" +
          "**" + PREFIX + "leetcode <easy/medium/hard>**: Leetcode Question by Difficulty")
        break
      case "easy":
        randomQuestion = await Leetcode.getRandomQuestion(0)
        await message.channel.send(Response.formatQuestion(randomQuestion), {split: true});
        break
      case "medium":
        randomQuestion = await Leetcode.getRandomQuestion(1)
        await message.channel.send(Response.formatQuestion(randomQuestion), {split: true});
        break
      case "hard":
        randomQuestion = await Leetcode.getRandomQuestion(2)
        await message.channel.send(Response.formatQuestion(randomQuestion), {split: true});
        break
      default:
        message.channel.send("Invalid command use ``" + PREFIX + "leetcode help`` for more info.")
    }
  }

  static async searchQuestionID(message, id) {
    try {
      let q = await Leetcode.getQuestionById(id)
      await message.channel.send(Response.formatQuestion(q), {split: true});
    } catch (error) {
      message.channel.send(error)
    }
  }

  static async returnRandomQuestion(message) {
    let q = await Leetcode.getRandomQuestion()
    await message.channel.send(Response.formatQuestion(q), {split: true});
  }

  static async searchQuestionTitle(message, title) {
    try {
      let q = await Leetcode.getQuestionByTitle(title)
      await message.channel.send(Response.formatQuestion(q),{split: true});
    } catch(err) {
      message.channel.send(err)
    }
  }
}


module.exports = Commands
