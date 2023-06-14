const natural = require("natural")
const tokenizer = new natural.WordTokenizer()
const vietnameseStopwords = require("vietnamese-stopwords")
const fs = require("fs")

let rawdata = fs.readFileSync("./data/question.json")
let question = JSON.parse(rawdata)

const handleWord = (words) => {
  const tokenizedData = words.map((text) => tokenizer.tokenize(text))
  const filteredData = tokenizedData.map((tokens) =>
    tokens.filter((token) => !vietnameseStopwords.includes(token.toLowerCase()))
  )
  return filteredData
}

const topics = [
  {
    name: "Mời đi chơi",
    file: "./data/question/invite_gout.txt"
  },
  {
    name: "Đi ngủ",
    file: "./data/question/wanna_sleep.txt"
  }
]

const classifier = new natural.BayesClassifier()
const main = () => {
  for (const key of Object.keys(question)) {
    const handleList = handleWord(question[key])
    for (const handle of handleList) {
      classifier.addDocument(handle, key)
    }
  }
}
main()
classifier.train()
// Save model to file
fs.writeFileSync("./model.json", JSON.stringify(classifier))
console.log("Model saved successfully.")
