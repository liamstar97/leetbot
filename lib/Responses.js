'use-strict'

let TurndownService = require('turndown')
let turndownService = new TurndownService()

class Responses {

  /**
   * Formats the leetcode question
   *
   * @param {*} question The leetcode question to be formatted.
   * @returns The formatted leetcode question as a string
   */
  static formatQuestion(question) {
    console.log("Formatting")
    let description = question.content ? turndownService.turndown(question.content) : ""
    console.log("Done!")
    return `__**${question.title} #${question.questionId} - ${question.difficulty}**__\n
    ` + description + "\n" +
      "\n" +
      `https://leetcode.com/problems/${question.titleSlug}`
  }
}

module.exports = Responses