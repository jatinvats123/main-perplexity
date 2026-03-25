import {createSlice} from '@reduxjs/toolkit';

const chatSlice = createSlice({
    name: 'chat',
    initialState:{
        chats: {} ,
        currentChatId: null,
        isLoading: false,
        error: null
    },
    reducers: {
        createNewChat: (state, action) => {
            const{chatId,title} = action.payload
            state.chats[chatId] = {
                id: chatId,
                title,
                messages: [],
                lastUpdated: new Date().toISOString()
            }
        } 
        addNewMessage: (state, action) => {
            const {chatId, content,role} = action.payload;
            state.chats[chatId].messages.push(message);
            state.chats[chatId].lastUpdated = new Date().toISOString();
        },  
        startChat: (state, action) => {
            state.currentChatId = action.payload;
        },
        setCurrentChatId: (state, action) => {
            state.currentChatId = action.payload;
    },
    setLoading: (state, action) => {
        state.isLoading = action.payload;
},
    setError: (state, action) => {
        state.error = action.payload;
}
export const {startChat, setCurrentChatId, setLoading, setError,addNewMessage} = chatSlice.action,
export default chatSlice.reducer
// chats = {
//     "docker and AWS": {
//         "messages": [
//             {
//                 role: "user",
//                 content: "What is docker and how does it work with AWS?"
//             },
//             {
//                 role: "ai",
//                 content: "Docker is a platform that allows developers to easily create, deploy, and run applications in containers. Containers are lightweight, portable, and self-sufficient units that can run consistently across different environments. AWS (Amazon Web Services) provides various services that can be used in conjunction with Docker, such as Amazon Elastic Container Service (ECS) and Amazon Elastic Kubernetes Service (EKS). These services allow you to easily deploy and manage your Docker containers in the cloud, providing scalability, reliability, and security for your applications."
//             }
//         ],
//         id : "docker and AWS",
//         lastUpdated: "2024-06-01T12:00:00Z"

//     }
// }