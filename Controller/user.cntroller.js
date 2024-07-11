const { PrismaClient } = require("prisma/prisma-client");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();
exports.getusers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    console.log("Users fetched successfully:", users);
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Failed to get users" });
  }
};

exports.getuser = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await prisma.user.findMany({ where: { id } });
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "failed to get user" });
  }
};

exports.updateuser = async (req, res) => {
  const id = req.params.id;
  const tokenverifyid = req.userId;
  const { password, avtar, ...inputs } = req.body;

  if (id !== tokenverifyid) {
    return res.status(403).json({ message: "Not Authenticated" });
  }

  let updatepassword = null;
  try {
    if (password) {
      updatepassword = await bcrypt.hash(password, 10);
    }

    const userUpdate = await prisma.user.update({
      where: { id: id },
      data: {
        ...inputs,
        ...(updatepassword && { password: updatepassword }),
        ...(avtar && { avtar }),
      },
    });
    console.log(userUpdate);
    res.status(200).json({ message: "Update successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update user" });
  }
};

exports.deleteuser = async (req, res) => {
  const id = req.params.id;
  const tokenverifyid = req.userId;

  if (id !== tokenverifyid) {
    return res.status(403).json({ message: "Not Authenticated" });
  }
  res.status(200).json({ message: "Deleted Sucessfully" });
  try {
    await prisma.user.delete({ where: id });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "failed to get user" });
  }
};
exports.savePost = async (req, res) => {
  const tokenUserId = req.userId;
  const postId = req.body.postId;
  try {
    const savedPost = await prisma.savedPost.findUnique({
      where: {
        userId_postId: {
          userId: tokenUserId,
          postId,
        },
      },
    });

    if (savedPost) {
      await prisma.savedPost.delete({
        where: {
          id: savedPost.id,
        },
      });
      res.status(200).json({ message: "Post removed from saved list" });
    } else {
      await prisma.savedPost.create({
        data: {
          userId: tokenUserId,
          postId,
        },
      });
      res.status(200).json({ message: "Post saved" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to delete users!" });
  }
};

exports.profilePosts = async (req, res) => {
  const tokenUserId = req.userId;
  try {
    const userPosts = await prisma.post.findMany({
      where: { userId: tokenUserId },
    });
    const saved = await prisma.savedPost.findMany({
      where: { userId: tokenUserId },
      include: {
        post: true,
      },
    });

    const savedPosts = saved.map((item) => item.post);
    res.status(200).json({ userPosts, savedPosts });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get profile posts!" });
  }
};

exports.getNotificationNumber = async (req, res) => {
  const tokenUserId = req.userId;
  try {
    const number = await prisma.chat.count({
      where: {
        userIDs: {
          hasSome: [tokenUserId],
        },
        NOT: {
          seenBy: {
            hasSome: [tokenUserId],
          },
        },
      },
    });
    res.status(200).json(number);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get profile posts!" });
  }
};