const fs = require("fs")
const natural = require("natural")
const tokenizer = new natural.WordTokenizer()
const vietnameseStopwords = require("vietnamese-stopwords")
natural.BayesClassifier.load("./model.json", null, function (err, classifier) {
  if (err) {
    console.error(err)
  } else {
    console.log("Model loaded successfully.")

    // Use classifier to predict topic for new text
    const newText = "Ngủ ngon"
    const tokenizedNewText = tokenizer.tokenize(newText)
    const filteredNewText = tokenizedNewText.filter(
      (token) => !vietnameseStopwords.includes(token.toLowerCase())
    )

    const prediction = classifier.classify(filteredNewText)
    console.log(`Topic prediction for "${newText}": ${prediction}`)
  }
})
