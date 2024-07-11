const express = require("express");
const router = express.Router();
const userController = require("../Controller/user.cntroller");
const { verifytoken } = require("../Middleware/verifytoken");

router.get("/", verifytoken, userController.getusers);
router.get("/search/:id", verifytoken, userController.getuser);
router.put("/:id", verifytoken, userController.updateuser);
router.delete("/:id", verifytoken, userController.deleteuser);
router.post("/save", verifytoken, userController.savePost);
router.get("/profilepost", verifytoken, userController.profilePosts);
router.get("/notification", verifytoken, userController.getNotificationNumber);
module.exports = router;
