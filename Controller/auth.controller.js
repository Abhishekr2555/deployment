require("dotenv").config();
const bcrypt = require("bcrypt");
// const { prisma } = require("../lib/prisma.js");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("prisma/prisma-client");
const prisma = new PrismaClient();

exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // creat hasspassword
    const hasePass = await bcrypt.hash(password, 10);
    console.log(hasePass);

    // create user
    const user = await prisma.user.create({
      data: {
        username: username,
        email: email,
        password: hasePass,
      },
    });
    console.log(user);
    res.status(201).json({ message: "User Create Successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Fail to Create user " });
  }
};

exports.login = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: { username },
    });

    // compate password with database
    if (!user) return res.status(401).json({ message: "Invalid User" });
    const ispassword = await bcrypt.compare(password, user.password);

    if (!ispassword)
      return res.status(401).json({ message: "Invalid Password" });

    const age = 1000 * 60 * 60 * 27 * 7;
    const token = jwt.sign({ id: user.id,isAdmin:true }, process.env.JWT_SECRET_KEY, {
      expiresIn: age,
    });

    const {password:userPassword,...userInfo}=user

    res
      .cookie("token", token, {
        httponly: true,
        maxAge: age,
      })
      .status(201)
      .json(userInfo);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Fail to Login user " });
  }
};

exports.logout = async (req, res) => {
  res.clearCookie("token").status(200).json({ message: "Logout Successful" });
};
