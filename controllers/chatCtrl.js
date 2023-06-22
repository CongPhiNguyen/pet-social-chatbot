const natural = require("natural")
const tokenizer = new natural.WordTokenizer()
const vietnameseStopwords = require("vietnamese-stopwords")
const dialogflow = require("dialogflow")
const uuid = require("uuid")
const sessionClient = new dialogflow.SessionsClient()
const sessionPath = sessionClient.sessionPath(process.env.PROJECT_ID, uuid.v4())
const dotenv = require("dotenv")
const axios = require("axios")

dotenv.config()

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
    let dialogFlowFeature = {}
    if (queryResult?.intent?.displayName === "say_gau") {
      const gifInfo = await axios.get(
        `https://api.giphy.com/v1/gifs/random?api_key=${process.env.GIPHY_KEY}&tag=dog&rating=g`
      )
      dialogFlowFeature = {
        name: "say_gau",
        imgUrl: gifInfo.data.data.images.fixed_width_still.url
      }
    }

    if (queryResult?.intent?.displayName === "say_meow") {
      const gifInfo = await axios.get(
        `https://api.giphy.com/v1/gifs/random?api_key=${process.env.GIPHY_KEY}&tag=cat&rating=g`
      )
      dialogFlowFeature = {
        name: "say_meow",
        imgUrl: gifInfo.data.data.images.fixed_width_still.url
      }
    }

    // .then((response) => {
    //   console.log(response.data.data.images.fixed_width_still.url)
    //   const imageUrl = response.data.data.image_url
    //   console.log(imageUrl)
    //   // do something with the image url, such as displaying it on the page
    // })
    // .catch((error) => console.error(error))
    // }
    // console.log()
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
      reply: queryResult.fulfillmentText,
      dialogflowFeature: dialogFlowFeature
    })
  }
}

module.exports = chatCtrl
