const { PrismaClient } = require("prisma/prisma-client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
exports.getPosts = async (req, res) => {
  const query = req.query;
  console.log(query);
  try {
    const posts = await prisma.post.findMany({
      where: {
        city: query.city || undefined,
        type: query.type || undefined,
        property: query.property || undefined,
        bedroom: query.bedroom ? parseInt(query.bedroom) : undefined,
        price: {
          gte: query.minPrice ? parseInt(query.minPrice) : 0,
          lte: query.maxPrice ? parseInt(query.maxPrice) : 1000000,
        },
      },
    });

    res.status(200).json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Fail to GetPosts " });
  }
};
exports.getPost = async (req, res) => {
  const id = req.params.id;
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        postDetail: true,
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
      },
    });
    const token = req.cookies?.token;

    if (token) {
      jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
        if (!err) {
          const saved = await prisma.savedPost.findUnique({
            where: {
              userId_postId: {
                postId: id,
                userId: payload.id,
              },
            },
          });
          res.status(200).json({ ...post, isSaved: saved ? true : false });
        }
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Fail to GetPost " });
  }
};
exports.addPost = async (req, res) => {
  const body = req.body;
  const tokenuserId = req.userId;

  try {
    const newpost = await prisma.post.create({
      data: {
        ...body.postData,
        userId: tokenuserId,
        postDetail: {
          create: body.postDetail,
        },
      },
    });
    res.status(200).json(newpost);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Fail to AddPosts" });
  }
};
exports.updatePost = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Fail to Create user " });
  }
};
exports.deletePost = async (req, res) => {
  const id = req.params.id;
  const tokenuserId = req.userId;

  try {
    const post = await prisma.post.findUnique({ where: { id } });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.userId != tokenuserId) {
      return res.status(403).json({ message: "Not authorised" });
    }

    await prisma.postDetail.delete({
      where: { postId: id },
    });

    await prisma.post.delete({
      where: { id },
    });
    res.status(200).json({ message: "Delete successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to delete post" });
  }
};
