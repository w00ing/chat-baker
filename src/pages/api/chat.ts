// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import type { NextApiRequest, NextApiResponse } from "next";
import { CACHE_DIR } from "@/libs/prepareChatbot";
import {
  BufferedChatMemory,
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

  // const chatRes = await fetch('https://api.openai.com/v1/chat', {
  //   headers: {
  //     'Content-Type': 'application/json',
  //     Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ''}`,
  //   },
  //   method: 'POST',
  //   body: JSON.stringify(userInput),
  // });

  const userMessage: ChatMessage = { role: "user", content: userInput };

  const messages = [SystemMessage, userMessage];

  const options = { model: "gpt-3.5-turbo", messages };
  const body = JSON.stringify(options);

  const fileLoader = new FileLoader(CACHE_DIR);

  const embeddings = await fileLoader.load();

  try {
    const chatRes = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ""}`,
        },
        method: "POST",
        body,
      }
      // {
      //   messages: req.messages,
      //   ...options,
      //   model: "gpt-3.5-turbo",
      // },
      // {
      //   headers: {
      //     Authorization: `Bearer ${this.apiKey}`,
      //     "Content-Type": "application/json",
      //   },
      // }
      //   body: JSON.stringify(userInput),
    );

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
