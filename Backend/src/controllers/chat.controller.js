import chatModel from "../models/chat.model.js";
import { generateResponse, generateChatTitle } from "../services/ai.service.js";
import messageModel from "../models/message.model.js";

export async function sendMessage(req, res) {
  const { message,chat: chatId } = req.body;

  let chatTitle = null, chat = null;
  if(!chatId){
  
  chatTitle = await generateChatTitle(message);

  chat = await chatModel.create({
    user: req.user._id,
    title: chatTitle
  });
  }

  const messages = await messageModel.find({ chat: chatId || chat._id }).sort({ createdAt: 1 });
  const result = await generateResponse(messages);


const userMessage = await messageModel.create({
    chat: chatId ||chat._id,
    content: message,
    role: "user"    
})
  
  const aiMessage = await messageModel.create({
    chat: chat._id,
    content: result,
    role: "ai"
  });

  res.status(200).json({
    chatTitle,
    chat,
    aiMessage,
    aimessage: result
  });
}

export async function getChats(req,res){
    const user = req.user


    const chats = await chatModel.find({
        user: user.id
    })

    res.status(200).json({
        message:"chat retrieved successfully",
        chats
    })
}
export async function getMessages(req,res){
    const { chatId } = req.params;  

    const chat = await chatModel.findOne({
        _id: chatId,
        user: req.user._id
    })
    if(!chat){
        return res.status(404).json({
            message:"chat not found"
        })
    }

    const messages = await messageModel.find({
        chat:chatId
    })
    res.status(200).json({
        message:"messages retrieved successfully",
        messages    
    })
}

export async function deleteChat(req,res){
    const { chatId } = req.params;
    const chat = await chatModel.findOneAndDelete({
        _id: chatId,
        user: req.user._id
    })
    await messageModel.deleteMany({
        chat: chatId
    })
    if(!chat){
        return res.status(404).json({
            message:"chat not found"
        })
    }
    res.status(200).json({
        message:"chat deleted successfully"
    })
}
