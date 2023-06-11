const natural = require("natural")
const tokenizer = new natural.WordTokenizer()
const vietnameseStopwords = require("vietnamese-stopwords")

// Load data
const data = [
  "Đây là một câu văn bản tiếng Việt.",
  "Chủ đề của câu văn bản này là gì?",
  "Tôi muốn tìm hiểu về xử lý ngôn ngữ tự nhiên.",
  "Ngôn ngữ tiếng Việt có nhiều từ khó quá."
]

// Tokenize text data
const tokenizedData = data.map((text) => tokenizer.tokenize(text))

// Remove Vietnamese stopwords
const filteredData = tokenizedData.map((tokens) =>
  tokens.filter((token) => !vietnameseStopwords.includes(token.toLowerCase()))
)

// Train classifier model
const classifier = new natural.BayesClassifier()
classifier.addDocument(filteredData[0], "topic1")
classifier.addDocument(filteredData[1], "topic2")
classifier.addDocument(filteredData[2], "topic1")
classifier.addDocument(filteredData[3], "topic2")
classifier.train()

// Predict topic for new text
const newText = "Có nên học xử lý ngôn ngữ tự nhiên không?"
const tokenizedNewText = tokenizer.tokenize(newText)
const filteredNewText = tokenizedNewText.filter(
  (token) => !vietnameseStopwords.includes(token.toLowerCase())
)
const prediction = classifier.classify(filteredNewText)

console.log(`Topic prediction for "${newText}": ${prediction}`)
