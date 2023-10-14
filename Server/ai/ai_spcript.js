const { OpenAI } = require("langchain/llms/openai");
const {ChatOpenAI} =require("langchain/chat_models/openai");
const {ConversationSummaryBufferMemory} =require("langchain/memory");
const {ConversationChain }=require("langchain/chains");
const
  {ChatPromptTemplate,
  HumanMessagePromptTemplate,
  MessagesPlaceholder,
  SystemMessagePromptTemplate}
=require("langchain/prompts");



const chatPromptMemory = new ConversationSummaryBufferMemory({
  llm: new ChatOpenAI({ openAIApiKey: process.env.MY_OPENAI_API_KEY,temperature: 0 }),
  maxTokenLimit: 50,
  returnMessages: true,
});


  // Define a function to generate an AI response based on a user message
const  generateAIResponse=async function(userMessage) {
     console.log(userMessage)
     const chatPrompt = ChatPromptTemplate.fromMessages([
      SystemMessagePromptTemplate.fromTemplate(
        "The following is a friendly conversation between a human and an AI. The AI is talkative and provides lots of specific details from its context. If the AI does not know the answer to a question, it truthfully says it does not know."
      ),
      new MessagesPlaceholder("history"),
      HumanMessagePromptTemplate.fromTemplate("{input}"),
    ]);
    
    const model = new ChatOpenAI({openAIApiKey: process.env.MY_OPENAI_API_KEY, temperature: 0.9, verbose: false });
    const chain = new ConversationChain({
      llm: model,
      memory: chatPromptMemory,
      prompt: chatPrompt,
    });
    console.log("this is working")
    const aiResponse = await chain.predict({ input: userMessage });
    console.log(aiResponse);
     // Return the AI response
     return aiResponse;
}


module.exports = {
  generateAIResponse
};