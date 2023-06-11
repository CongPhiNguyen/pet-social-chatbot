const natural = require("natural")
const tokenizer = new natural.WordTokenizer()
const vietnameseStopwords = require("vietnamese-stopwords")
const chatCtrl = {
  chatBasic: async (req, res) => {
    const { message } = req.body
    const tokenizedNewText = tokenizer.tokenize(message)
    const filteredNewText = tokenizedNewText.filter(
      (token) => !vietnameseStopwords.includes(token.toLowerCase())
    )
    const prediction = global.basicChatModel.classify(filteredNewText)
    console.log(`Topic prediction for "${message}": ${prediction}`)
    res.status(200).send({ success: true, topic: prediction })
  }
}

module.exports = chatCtrl
