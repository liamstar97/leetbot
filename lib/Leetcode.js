'use strict'

let NodeCache = require("node-cache");
let axios = require('axios')
let config = require('./config.json')

console.log(config.urls.problems);
console.log(config.urls.graphql);

let questionCache = new NodeCache({stdTTL: 3600, checkperiod: 600});

let questions = {
  idMap: {},
  titleMap: {},
}

async function randomQuestion(difficulty) {
  let randomQuestion = {}

  do {
    let keys = Object.keys(questions.idMap);
    let currentQuestion = questions.idMap[keys[keys.length * Math.random() << 0]];

    if (typeof difficulty == 'number' && currentQuestion.difficulty !== difficulty + 1) {
      continue
    }

    let questionName = currentQuestion.title_slug
    randomQuestion = await Leetcode.getQuestionInfo(questionName)
  } while (!randomQuestion.content)
  return randomQuestion
}

/**
 * Contains REST calls for the Leetcode API
 */
class Leetcode {

  /**
   * Returns the entire Leetcode problem set
   *
   * @returns The entire Leetcode problem set
   */
  static async getQuestions() {
    console.log("Getting Questions")

    let res = await axios.get(config.urls.problems)

    res.data.stat_status_pairs.forEach(q => {
        let question = {
          id: q.stat.question_id,
          title: q.stat.question__title,
          title_slug: q.stat.question__title_slug,
          difficulty: q.difficulty.level,
          paid_only: q.paid_only
        }

        if (question.id === 1) {
          console.log("Success!")
        }

        questions.idMap[question.id] = question
        questions.titleMap[question.title.toLowerCase()] = question
      }
    )

    return questions
  }

  /**
   * Retrieves a leetcode question by ID
   * @param {*} id The ID of the leetcode question
   * @returns The question specified by the ID
   */
  static async getQuestionById(id) {
    console.log("Finding question by ID: " + id)
    if (!questions) {
      questions = await Leetcode.getQuestions()
    }

    let question = questions.idMap[id]

    if (!question) {
      throw "Invalid Question ID"
    }

    let questionName = question.title_slug

    return await Leetcode.getQuestionInfo(questionName)
  }

  /**
   * Retrieves a leetcode question by title
   * @param {*} title The title of the leetcode question
   * @returns The question specified by the title
   */
  static async getQuestionByTitle(title) {
    console.log("Finding question by Title: \n" + title + "\"")
    if (!questions) {
      questions = await Leetcode.getQuestions()
    }

    let question = questions.titleMap[title.toLowerCase()]

    if (!question) {
      throw "Invalid Question Title"
    }

    let questionName = question.title_slug
    return await Leetcode.getQuestionInfo(questionName)
  }

  /**
   * Retrieves a random leetcode question from the problem set.
   * @returns The random question
   */
  static async getRandomQuestion() {
    console.log("Finding random question")
    if (!questions) {
      questions = await Leetcode.getQuestions()
    } else {
      return randomQuestion()
    }
  }

  /**
   * Retrieves a random leetcode question from the problem set with the given difficulty.
   * @param {*} difficulty The difficulty of the leetcode question
   * @returns The question specified by the difficulty
   */
  static async getRandomQuestion(difficulty) {
    console.log("Finding question by difficulty: " + difficulty)
    if (!questions) {
      questions = await Leetcode.getQuestions()
    } else {
      return randomQuestion(difficulty)
    }
  }

  /**
   * Retrieves a leetcode question's information
   * @param {*} questionName The name of the question
   * @returns The information for the specified question
   */
  static async getQuestionInfo(questionName) {
    console.log("Finding question info for: \"" + questionName + "\"")
    let cachedQuestion = questionCache.get(questionName)
    if (cachedQuestion) {
      return cachedQuestion
    }

    let query = [
      'query questionData($titleSlug: String!) {',
      '  question(titleSlug: $titleSlug) {',
      '    questionId',
      '    title',
      '    translatedTitle',
      '    titleSlug',
      '    content',
      '    translatedContent',
      '    isPaidOnly',
      '    difficulty',
      '    stats',
      '    sampleTestCase',
      '    likes',
      '    dislikes',
      '    solution {\n      id\n      canSeeDetail\n      paidOnly\n      __typename\n    }',
      '  }',
      '}'
    ].join('\n')

    let req = {
      operationName: "questionData",
      query: query,
      variables: {titleSlug: questionName},
    }

    let res = await axios.post(config.urls.graphql, req)
    let question = res.data.data.question
    questionCache.set(questionName, question)

    return question
  }
}

module.exports = Leetcode