const natural = require("natural")
const tokenizer = new natural.WordTokenizer()
const vietnameseStopwords = require("vietnamese-stopwords")
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
  }
}

module.exports = chatCtrl
