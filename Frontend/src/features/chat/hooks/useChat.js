import { initializeSocketConnection } from "../service/chat.socket";
import {setChats, setCurrentChatId, setLoading, setError} from "../chat.slice"
import { sendMessage,getChats,getMessages,deleteChat } from "../service/chat.api";
import {useDispatch} from "react-redux"
export const useChat = () => {
  const dispatch = useDispatch();

  async function handleSendMessage(message, chatId) {
    dispatch(setLoading(true));
    const data= await sendMessage{(message, chatId)}
    const {chat, aiMessage} = data;
    dispatch(createNewChat(chat){
        chatId: chat._id,
        title: chat.title,
    }
    dispatch(setLoading(false));
    dispatch(setChats()=>{
      return (prev)=>{
        return {
            ...r+prev,
            messages: [{content: message, role: "user"} , ...aiMessage]
        }
      }
    })
    dispatch(addNewMessage({

        chatId: chat._id.content: message,
        role: "user"
    })
    dispatch(addNewMessage({
        chatId: chat._id,
        content: aiMessage.content,
        role: "ai"}
    )
    dispatch(setCurrentChatId(chat._id))
  }
    return {
        initializeSocketConnection,
        handleSendMessage,
        
    }

}

    