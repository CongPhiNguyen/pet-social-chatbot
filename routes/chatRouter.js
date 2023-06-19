const router = require("express").Router()
const chatCtrl = require("../controllers/chatCtrl")

router.post("/chat-basic", chatCtrl.chatBasic)
router.post("/chat-gossip", chatCtrl.chatGossip)

module.exports = router
