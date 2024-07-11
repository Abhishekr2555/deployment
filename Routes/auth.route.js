const express = require("express");
const { register, login, logout } = require("../Controller/auth.controller");
const router = express.Router();
const authController=require('../Controller/auth.controller')

router.post('/register',authController.register)
router.post('/login',authController.login)
router.get('/logout',authController.logout)

module.exports = router;