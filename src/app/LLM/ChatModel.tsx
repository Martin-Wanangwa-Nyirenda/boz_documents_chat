import { ChatOpenAI } from "langchain/chat_models/openai";
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import { createClient } from "@supabase/supabase-js";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { BufferMemory } from "langchain/memory";
import { HuggingFaceInferenceEmbeddings } from "langchain/embeddings/hf";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || " ";
const SUPABASE_PRIVATE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY || " ";

const CUSTOM_QUESTION_GENERATOR_CHAIN_PROMPT = `Given the following conversation and a follow up question, return the conversation history excerpt that includes any relevant context to the question if it exists and rephrase the follow up question to be a standalone question.
Chat History:
{chat_history}
Follow Up Input: {question}
Your answer should follow the following format:
\`\`\`
Use the following pieces of context to answer the users question.
If you don't know the answer, just say that you don't know, don't try to make up an answer.
----------------
<Relevant chat history excerpt as context here>
Standalone question: <Rephrased question here>
\`\`\`
Your answer:`;

const model = new ChatOpenAI({
  modelName: "gpt-3.5-turbo",
  temperature: 0,
  openAIApiKey: process.env.NEXT_PUBLIC_OPEN_API_KEY,
});

const embeddings = new HuggingFaceInferenceEmbeddings({
  apiKey: process.env.NEXT_PUBLIC_HF_API_KEY,
  model: "sentence-transformers/all-mpnet-base-v2",
});

const client = createClient(SUPABASE_URL, SUPABASE_PRIVATE_KEY);

const vectorStore = new SupabaseVectorStore(embeddings, {
  client,
  tableName: "documents",
});

const chain = ConversationalRetrievalQAChain.fromLLM(
  model,
  vectorStore.asRetriever(),
  {
    memory: new BufferMemory({
      memoryKey: "chat_history",
      returnMessages: true,
    }),
    questionGeneratorChainOptions: {
      template: CUSTOM_QUESTION_GENERATOR_CHAIN_PROMPT,
    },
  }
);

export async function message(question: string) {
  console.log("Sending message...");
  const res = await chain.call({
    question: question,
  });
  console.log(res);

  return res.text;
}

/*
  {
    text: "The powerhouse of the cell is the mitochondria."
  }
  {
    text: "Bob is 28 years old."
  }
*/
