// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import type { NextApiRequest, NextApiResponse } from "next";
import { CACHE_DIR } from "@/libs/prepareChatbot";
import { CallbackManager } from "langchain/callbacks";
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { OpenAI } from "langchain/llms/openai";
import { BufferMemory } from "langchain/memory";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  MessagesPlaceholder,
  SystemMessagePromptTemplate,
} from "langchain/prompts";
import { HNSWLib } from "langchain/vectorstores/hnswlib";

const callbackManager = CallbackManager.fromHandlers({
  async handleLLMStart(llm, _prompts: string[]) {
    console.log("handleLLMStart", { llm, _prompts });
  },
  async handleChainStart(chain) {
    console.log("handleChainStart", { chain });
  },
  async handleAgentAction(action) {
    console.log("handleAgentAction", action);
  },
  async handleToolStart(tool) {
    console.log("handleToolStart", { tool });
  },
});

const MEMORY_KEY = "history";

const memory = new BufferMemory({
  memoryKey: MEMORY_KEY,
  inputKey: "input",
  returnMessages: true,
});

const model = new OpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: "gpt-3.5-turbo",
  cache: true,
  verbose: true,
  callbackManager,
});

const embeddings = new OpenAIEmbeddings({
  openAIApiKey: process.env.OPENAI_API_KEY,
});

const prompt = ChatPromptTemplate.fromPromptMessages([
  SystemMessagePromptTemplate.fromTemplate(
    `너의 이름은 챗 베이커야. 유저가 질문하면, 네가 가진 정보를 토대로 친절하게 대답해줘. 정보가 부족하면 답을 모른다고 말해. 답을 지어내려 하지 마.`
  ),
  new MessagesPlaceholder(MEMORY_KEY),
  HumanMessagePromptTemplate.fromTemplate("{input}"),
]);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { input } = JSON.parse(req.body) as { input: string };
    console.log("userInput", input);

    const vectorStore = await HNSWLib.load(CACHE_DIR, embeddings);

    const chain = ConversationalRetrievalQAChain.fromLLM(
      model,
      vectorStore.asRetriever(1)
    );

    const { text } = await chain.call({
      question: input,
      chat_history: [],
    });

    const answer = { content: text, role: "assistant" };

    return res.status(200).json({ answer });
  } catch (e) {
    console.error(e);
    throw e;
  }
}
