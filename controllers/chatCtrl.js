const natural = require("natural")
const tokenizer = new natural.WordTokenizer()
const vietnameseStopwords = require("vietnamese-stopwords")
const dialogflow = require("dialogflow")
const uuid = require("uuid")
const sessionClient = new dialogflow.SessionsClient()
const sessionPath = sessionClient.sessionPath(process.env.PROJECT_ID, uuid.v4())

function getRandomValueFromArray(arr) {
  const randomIndex = Math.floor(Math.random() * arr.length)
  return arr[randomIndex]
}

const chatCtrl = {
  chatBasic: async (req, res) => {
    const { message } = req.body
    const tokenizedNewText = tokenizer.tokenize(message)
    const filteredNewText = tokenizedNewText.filter(
      (token) => !vietnameseStopwords.includes(token.toLowerCase())
    )
    const prediction = global.basicChatModel.classify(filteredNewText)
    return res.status(200).send({
      success: true,
      topic: prediction,
      reply: getRandomValueFromArray(global.reply[prediction])
    })
  },
  chatGossip: async (req, res) => {
    const { message } = req.body
    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: message,
          languageCode: "en-US"
        }
      }
    }

    const responses = await sessionClient.detectIntent(request)
    console.log(responses)
    const { queryResult } = responses[0]
    // const dialogFlowFeature = await handleIntent(queryResult)

    console.log(queryResult.fulfillmentText)
    // const tokenizedNewText = tokenizer.tokenize(message)
    // const filteredNewText = tokenizedNewText.filter(
    //   (token) => !vietnameseStopwords.includes(token.toLowerCase())
    // )
    // const prediction = global.basicChatModel.classify(filteredNewText)
    return res.status(200).send({
      success: true,
      // topic: prediction,
      reply: queryResult.fulfillmentText
    })
  }
}

module.exports = chatCtrl
