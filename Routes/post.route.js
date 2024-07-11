const express = require("express");
const router = express.Router();
const postController = require("../Controller/post.controller");
const { verifytoken } = require("../Middleware/verifytoken");
router.get("/", verifytoken, postController.getPosts);
router.get("/:id", verifytoken, postController.getPost);
router.post("/", verifytoken, postController.addPost);
router.put("/:id", verifytoken, postController.updatePost);
router.delete("/:id", verifytoken, postController.deletePost);

module.exports = router;
