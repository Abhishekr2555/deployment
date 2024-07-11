const express = require("express");
const router = express.Router();
const messageController = require("../Controller/message.controller");
const { verifytoken } = require("../Middleware/verifytoken");

router.post("/:chatId", verifytoken, messageController.addMessage);
module.exports = router;
