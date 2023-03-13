// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import type { NextApiRequest, NextApiResponse } from "next";
import { CACHE_DIR, EMBEDDING_KEY } from "@/libs/prepareChatbot";
import {
  BufferedChatMemory,
  Embeddings,
  FileLoader,
  MemoryLLMChain,
  OpenAI,
  prompts,
} from "promptable";

const openai = new OpenAI(process.env.OPENAI_API_KEY || "");

// Note: this only works for one client at a time.
const chatHistory = new BufferedChatMemory();

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

const SystemMessage: ChatMessage = {
  role: "system",
  content: "You are a helpful assistant explaining a article to a user.",
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userInput, clear } = JSON.parse(req.body);
  const userMessage: ChatMessage = { role: "user", content: userInput };

  const messages = [SystemMessage, userMessage];

  const options = { model: "gpt-3.5-turbo", messages };
  const body = JSON.stringify(options);

  const fileLoader = new FileLoader(CACHE_DIR);
  const file = await fileLoader.load();

  const embeddings = new Embeddings(EMBEDDING_KEY, openai, file, {
    cacheDir: CACHE_DIR,
  });
  await embeddings.index();
  console.log("embeddings", embeddings);

  try {
    const chatRes = await fetch("https://api.openai.com/v1/chat/completions", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ""}`,
      },
      method: "POST",
      body,
    });

    const data = await chatRes.json();

    // return {
    //   message: data.choices[0]?.message,
    // };
  } catch (e) {
    console.error(e);
    throw e;
  }

  // clear the chat history
  if (clear) {
    chatHistory.clear();
    return res.status(200).json({});
  }

  // get a response

  const prompt = prompts.chatbot();

  const memoryChain = new MemoryLLMChain(prompt, openai, chatHistory);

  chatHistory.addUserMessage(userInput);
  const botOutput = await memoryChain.run({ userInput });
  chatHistory.addBotMessage(botOutput);

  res.status(200).json({ text: botOutput });
}
