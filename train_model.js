const natural = require("natural")
const tokenizer = new natural.WordTokenizer()
const vietnameseStopwords = require("vietnamese-stopwords")
const fs = require("fs")

const readWord = (filePath) => {
  const invite_gout = fs.readFileSync(filePath, {
    encoding: "utf8",
    flag: "r"
  })
  return invite_gout.replaceAll("\r", "").split("\n")
}

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
    file: "./data/invite_gout.txt"
  },
  {
    name: "Đi ngủ",
    file: "./data/wanna_sleep.txt"
  }
]
const classifier = new natural.BayesClassifier()
const main = () => {
  for (const topic of topics) {
    const words = readWord(topic.file)
    const handleList = handleWord(words)
    for (const handle of handleList) {
      classifier.addDocument(handle, topic.name)
    }
  }
}
main()
classifier.train()
// Save model to file
fs.writeFileSync("./model.json", JSON.stringify(classifier))
console.log("Model saved successfully.")
