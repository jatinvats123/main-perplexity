import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatMistralAI } from "@langchain/mistralai"
import { HumanMessage, SystemMessage, AIMessage } from "langchain";

const geminiModel = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash-lite",
    apiKey: process.env.GOOGLE_API_KEY
});

const mistralModel = new ChatMistralAI({
    model:"mistral-small-latest",
    apiKey: process.env.MISTRAL_API_KEY
})

export async function generateResponse(messages){

    const response = await geminiModel.invoke(
        messages.map(msg=>{
            if (msg.role==="user"){
                return new HumanMessage(msg.content)
            }
            else if(msg.role==="ai"){
                return new AIMessage(msg.content)
            }
        })
    )
   return response.text;
}

export async function generateChatTitle(message){

    const response = await geminiModel.invoke([
        new SystemMessage("You are a helpful assistant that generates concise and descriptive titles for user queries. The title should capture the essence of the user's message in a clear and engaging way, making it easy for others to understand the main topic at a glance. Please provide a title that is relevant to the content of the user's message and is no more than 3 to 5 words long."),
        new HumanMessage(
            `generate a title for the following user message: "${message}"` 
        )
    ])
    return response.text;
}

