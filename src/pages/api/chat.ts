// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import fs from "fs";
import type { NextApiRequest, NextApiResponse } from "next";
import { CACHE_DIR, EMBEDDING_KEY } from "@/libs/prepareChatbot";
import { Embeddings, OpenAI, type Document } from "promptable";

const openai = new OpenAI(process.env.OPENAI_API_KEY || "");

export type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

const SystemMessage: ChatMessage = {
  role: "system",
  content: "You are a helpful assistant explaining an article to a user.",
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { input } = JSON.parse(req.body) as { input: string };
  console.log("userInput", input);

  let file: string;

  try {
    file = fs.readFileSync(`${CACHE_DIR}/${EMBEDDING_KEY}.json`, "utf8");
  } catch (e) {
    console.log(e);
    return res.status(500).json({ text: "No embeddings found" });
  }

  const content = JSON.parse(file) as { documents: Document[] };

  const embeddings = new Embeddings(EMBEDDING_KEY, openai, content?.documents, {
    cacheDir: CACHE_DIR,
  });
  await embeddings.index();

  console.log("querying...");
  console.time("querying");
  const queryResults = await embeddings.query(input, 8);
  const similarDocs = queryResults
    .map((qr) => qr.document.content)
    .join("\n\n");

  console.log("queried");
  console.timeEnd("querying");

  const userMessage: ChatMessage = { role: "user", content: input };
  const queryMessage: ChatMessage = {
    role: "user",
    content: `Here is some context that may help you answer the question: ${similarDocs}`,
  };

  const messages = [SystemMessage, userMessage, queryMessage];

  const options = { model: "gpt-4-turbo", messages };
  const body = JSON.stringify(options);

  try {
    console.log("chatting...");
    console.time("chatting");
    const chatRes = await fetch("https://api.openai.com/v1/chat/completions", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ""}`,
      },
      method: "POST",
      body,
    });
    console.log("chatRes", chatRes);

    const data = await chatRes.json();
    console.log("data", data);

    const answer = data.choices[0]?.message;
    console.log("answer", answer);
    console.log("chatted");
    console.timeEnd("chatting");
    return res.status(200).json({ answer });
  } catch (e) {
    console.error(e);
    throw e;
  }
}
