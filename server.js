require("dotenv").config()
const cluster = require("cluster")
const cpuCount = require("os").cpus().length
const express = require("express")
const natural = require("natural")
const fs = require("fs")

const app = express()
app.use(express.json())

app.use("/api", require("./routes/chatRouter"))

natural.BayesClassifier.load("./model.json", null, function (err, classifier) {
  if (err) {
    console.error(err)
  } else {
    console.log("Model loaded successfully.")
    global.basicChatModel = classifier
  }
})

let rawdata = fs.readFileSync("./data/reply.json")
global.reply = JSON.parse(rawdata)

const port = process.env.PORT || 5000
if (cluster.isMaster) {
  for (var i = 0; i < cpuCount; i++) {
    cluster.fork()
  }
  cluster.on("exit", function (worker, code, signal) {
    console.log("worker " + worker.process.pid + " died")
    cluster.fork()
  })
} else {
  app.listen(port, () => {
    console.log("Server is running at port " + port)
  })
}
