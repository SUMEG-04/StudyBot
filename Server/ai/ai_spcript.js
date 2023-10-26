const generateResponse=require('./prompt/prompt')

// Define a function to generate an AI response based on a user message
const  generateAIResponse=async function(userMessage,prevsummary) {

    const {aiResponse,summary} = await generateResponse(userMessage,prevsummary);

     // Return the AI response and summary
     return {aiResponse,summary};
}


module.exports = {
  generateAIResponse
};