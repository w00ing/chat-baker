// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import type { NextApiRequest, NextApiResponse } from "next";
import { CACHE_DIR } from "@/libs/prepareChatbot";
import { CallbackManager } from "langchain/callbacks";
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { OpenAI } from "langchain/llms/openai";
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

const model = new OpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: "gpt-3.5-turbo",
  cache: true,
  verbose: true,
  callbackManager,
  streaming: true,
});

const embeddings = new OpenAIEmbeddings({
  openAIApiKey: process.env.OPENAI_API_KEY,
});

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
      vectorStore.asRetriever(5)
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
