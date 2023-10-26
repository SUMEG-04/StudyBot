const { MultiPromptChain,LLMChain,LLMRouterChain } =require("langchain/chains");
const {ChatOpenAI} =require("langchain/chat_models/openai");
const {PromptTemplate}=require("langchain/prompts");
const {RouterOutputParser}=require("langchain/output_parsers");
const {ConversationSummaryBufferMemory} =require("langchain/memory");
const { z }=require('zod')

const llm=new ChatOpenAI({ openAIApiKey: process.env.MY_OPENAI_API_KEY,temperature: 0.1 })

const chatPromptMemory = new ConversationSummaryBufferMemory({
    llm: llm,
    maxTokenLimit: 100,
    returnMessages: true,
  });

const physics_template = `You are a very smart physics professor. \
You are great at answering questions about physics in a concise\
and easy to understand manner. \
When you don't know the answer to a question you admit\
that you don't know.

Here is a question:
{input}`


const math_template = `You are a very good mathematician. \
You are great at answering math questions. \
You are so good because you are able to break down \
hard problems into their component parts, 
answer the component parts, and then put them together\
to answer the broader question.

Here is a question:
{input}`

const chemistry_template = `You are a very good chemistry professor. \
You are great at answering questions about chemistry in a concise\
and easy to understand manner. \
When you don't know the answer to a question you admit\
that you don't know.

Here is a question:
{input}`


const english_template = `You are a very good english professor. \
You are great at answering questions about english in a concise\
and easy to understand manner. \
When you don't know the answer to a question you admit\
that you don't know.

Here is a question:
{input}`

const biology_template = `You are a very good biology professor. \
You are great at answering questions about biology in a concise\
and easy to understand manner. \
When you don't know the answer to a question you admit\
that you don't know.

Here is a question:
{input}`

const history_template = `You are a very good historian. \
You have an excellent knowledge of and understanding of people,\
events and contexts from a range of historical periods. \
You have the ability to think, reflect, debate, discuss and \
evaluate the past. You have a respect for historical evidence\
and the ability to make use of it to support your explanations \
and judgements.

Here is a question:
{input}`


const computerscience_template = ` You are a successful computer scientist.\
You have a passion for creativity, collaboration,\
forward-thinking, confidence, strong problem-solving capabilities,\
understanding of theories and algorithms, and excellent communication \
skills. You are great at answering coding questions. \
You are so good because you know how to solve a problem by \
describing the solution in imperative steps \
that a machine can easily interpret and you know how to \
choose a solution that has a good balance between \
time complexity and space complexity. 

Here is a question:
{input}`

const prompt_infos = [
  {
      "name": "physics", 
      "description": "Good for answering questions about physics", 
      "prompt_template": physics_template
  },
  {
      "name": "math", 
      "description": "Good for answering math questions", 
      "prompt_template": math_template
  },
  {
    "name": "chemistry", 
    "description": "Good for answering chemistry questions", 
    "prompt_template": chemistry_template
  },
  {
    "name": "boilogy", 
    "description": "Good for answering biology questions", 
    "prompt_template": biology_template
  },
  {
    "name": "english", 
    "description": "Good for answering math questions", 
    "prompt_template": english_template
  },
  {
      "name": "History", 
      "description": "Good for answering history questions", 
      "prompt_template": history_template
  },
  {
      "name": "computer science", 
      "description": "Good for answering computer science questions", 
      "prompt_template": computerscience_template
  }
]


let destinationChains = {};

for(const item of prompt_infos) {
    let prompt = PromptTemplate.fromTemplate(item.prompt_template);

    let chain = new LLMChain({llm: llm, prompt: prompt,memory:chatPromptMemory});

    destinationChains[item.name] = chain;
}

let destinations = prompt_infos.map(item => (item.name + ': ' + item.description)).join('\n');


// Create a default destination in case the LLM cannot decide
let defaultPrompt = PromptTemplate.fromTemplate("`Generate a response if the question is out of syllabus as per syllabus of 'ncert' and tell that you can only answer question that are within the scope of 'ncert book' . Here is question:{input}`");

let defaultChain = new LLMChain({llm: llm, prompt: defaultPrompt,memory:chatPromptMemory});

// Load the routing prompt, NOTE this differs a lot from the one in the course example
// as the system kept inventing 'biology' as a destination or selected 'physics'
// instead of using the correct 'DEFAULT'
let routerTemplate = `Based on the input question to an large language model take the following steps:\
1) decide if the question can be answered by any of the destinations based on the destination descriptions.\
2) If none of the destinations are a good fit use "DEFAULT" as the response, For example if the question is about pharmacology but there is no "health care" destination use DEFAULT.\
3) Check is set to DEFAULT, if there is no match or set it to DEFAULT.\
4) You may also revise the original input if you think that revising it will ultimately lead to a better response from the language model.\
5) While answering question be precise, concise and easy to understand manner in limited word. \
\
You ONLY have the following destinations to choose from:\
<Destinations>\
{destinations}\
<Destinations>\
\
This is the question provided:\
<Input>\
{input}\
<Input>\

When you respond be sure to use the following format:\
<Formatting>\
{format_instructions}\
<Formatting>\

IMPORTANT: "destination" MUST be one of the destination names provided OR it can be "DEFAULT" if there is no good match.\
IMPORTANT: "next_inputs" can just be the original input if you don't think any modifications are needed.`;

// Now we can construct the router with the list of route names and descriptions
routerTemplate = routerTemplate.replace('{destinations}', destinations);

// Now we have to make a Zod schema to set up the output parser
let routerParser = RouterOutputParser.fromZodSchema(z.object({
    destination: z.string().describe('name of the prompt to use or "DEFAULT"'),
    next_inputs: z.object({
		input: z.string().describe('a potentially modified version of the original input')
	})
}));

let routerFormat = routerParser.getFormatInstructions();

// Using the template and the parser we can now build the prompt for routing
// and construct the initial routing chain
let routerPrompt = new PromptTemplate({
	template: routerTemplate,
    inputVariables: ['input'],
    outputParser: routerParser,
	partialVariables: {
        format_instructions: routerFormat
    }
});

let routerChain = LLMRouterChain.fromLLM(llm, routerPrompt);


// Now we can bring all of the pieces together!
let multiPromptChain = new MultiPromptChain({
	routerChain,
    destinationChains,
    defaultChain,
	verbose: false
});


/*
let response5 = await multiPromptChain.run('What is 2 + 2?');
console.log(response5.text);

let response6 = await multiPromptChain.run('Why does every cell in our body contain DNA?');
console.log(response6.text);
*/
const generateResponse=async(userMessage,prevsummary)=>{
    let response = await multiPromptChain.run(userMessage);
    const messages = await chatPromptMemory.chatHistory.getMessages();
    const previous_summary = prevsummary;
    const predictSummary = await chatPromptMemory.predictNewSummary(
      messages,
      previous_summary
    );
    const aiResponse=JSON.stringify(response)
    const summary=JSON.stringify(predictSummary)
    return {aiResponse,summary}
}


//generateResponse()

module.exports=generateResponse