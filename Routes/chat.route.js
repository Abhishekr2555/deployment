const express = require("express");
const router = express.Router();
const chatController = require("../Controller/chat.controller")
const { verifytoken } = require("../Middleware/verifytoken");

router.get("/", verifytoken, chatController.getChats);
router.get("/:id", verifytoken, chatController.getChat);
router.post("/", verifytoken, chatController.addChat);
router.put("/read/:id", verifytoken, chatController.readChat);


module.exports = router;
