'use strict'

let NodeCache = require( "node-cache" );

let axios = require('axios')
let config = require('./config')

let questionCache = new NodeCache( { stdTTL: 3600, checkperiod: 600 } );

let questions

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

    let questions = {
      idMap: {},
      titleMap: {},
    }

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
          console.log(q)
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
   * Retrieves a random leetcode question from the problem set with the given difficulty.
   * @param {*} difficulty The difficulty of the leetcode question
   * @returns The question specified by the difficulty
   */
  static async getRandomQuestion(difficulty) {
    if (!questions) {
      questions = await Leetcode.getQuestions()
    }

    let randomQuestion = {}

    do {
      let keys = Object.keys(questions.idMap);
      let currentQuestion = questions.idMap[keys[ keys.length * Math.random() << 0]];
      console.log(currentQuestion.difficulty)
      console.log(difficulty)

      if (typeof difficulty == 'number' && currentQuestion.difficulty != difficulty + 1) {
        continue
      }

      let questionName = currentQuestion.title_slug
      randomQuestion = await Leetcode.getQuestionInfo(questionName)
    } while(!randomQuestion.content)

    return randomQuestion
  }

  /**
   * Retrieves a leetcode question's information
   * @param {*} questionName The name of the question
   * @returns The information for the specified question
   */
  static async getQuestionInfo(questionName) {
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
      query:query,
      variables: {titleSlug: questionName},
    }

    let res = await axios.post(config.urls.graphql ,req)
    let question = res.data.data.question
    questionCache.set(questionName, question)

    return question
  }
}

module.exports = Leetcode