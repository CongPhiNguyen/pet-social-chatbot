const router = require("express").Router()
const chatCtrl = require("../controllers/chatCtrl")

router.post("/chat-basic", chatCtrl.chatBasic)

module.exports = router
