const { PrismaClient } = require("prisma/prisma-client");
const prisma = new PrismaClient();
exports.getChats = async (req, res) => {
  const tokenUserId = req.userId;
  try {
    const chats = await prisma.chat.findMany({
      where: {
        userIDs: {
          hasSome: [tokenUserId],
        }
      },
    });

    for (const chat of chats) {
      // const receiverId = chat.userIDs.find((id) => id !== tokenUserId);
      // console.log(receiverId)

      const receiverId = chat.userIDs[1];
      console.log(`Chat ID: ${chat.id}, Token User ID: ${tokenUserId}, Receiver ID: ${receiverId}`);

      if (receiverId) {
        const receiver = await prisma.user.findUnique({
          where: {
            id: receiverId,
          },
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        });
        chat.receiver = receiver;
      } else {
        console.error(`Receiver ID not found for chat ${chat.id}`);
      }
    }

    res.status(200).json(chats);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Fail to Get Chat " });
  }
};


exports.getChat = async (req, res) => {
  const tokenUserId = req.userId;
  const chatId = req.params.id;
  const receiverId = req.query.receiverId;

  try {
    // Fetch the chat based on chatId and ensure tokenUserId is part of userIDs
    const chat = await prisma.chat.findFirst({
      where: {
        id: chatId,
        userIDs: {
          hasSome: [tokenUserId],
        },
      },
      include: {
        messages: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }
    if (receiverId) {
      await prisma.chat.update({
        where: {
          id: chatId,
        },
        data: {
          seenBy: {
            push: receiverId,
          },
        },
      });
    }

    res.status(200).json(chat);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to get chat' });
  }
};

exports.readChat = async (req, res) => {
  const tokenUserId = req.params.id;
  try {
    const chat = await prisma.chat.update({
      where: {
        id: req.params.id,
        userIDs: {
          hasSome: [tokenUserId],
        },
      },
      data: {
        seenBy: {
          set: [tokenUserId],
        },
      },
    });
    res.status(200).json(chat);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Fail to Get Chat " });
  }
};
exports.addChat = async (req, res) => {
  const tokenUserId = req.userId;
  try {
    const newChat = await prisma.chat.create({
      data: {
        userIDs: [tokenUserId, req.body.receiverId],
      },
    });
    res.status(200).json(newChat);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Fail to Get Chat " });
  }
};
