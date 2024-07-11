const express = require("express");
const router = express.Router();
const testController=require('../Controller/test.controller');
const { verifytoken } = require("../Middleware/verifytoken");

router.get('/should-be-login',verifytoken,testController.shouldBeLoggedIn)
router.get('/should-be-admin',testController.shouldBeAdmin)


module.exports = router;