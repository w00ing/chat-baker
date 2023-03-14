import fs from "fs";
import { loadHTML } from "@/libs/loadHTML";
import { Embeddings, OpenAI, TokenSplitter } from "promptable";

const openai = new OpenAI(process.env.OPENAI_API_KEY || "");
export const EMBEDDING_KEY = "chat-url";
export const CACHE_DIR = "/tmp/embeddings";

export async function prepareChatbot(url: string) {
  try {
    if (!url) {
      return;
    }

    fs.rmSync(`${CACHE_DIR}/${EMBEDDING_KEY}.json`, { force: true });

    console.log("Parsing data...");

    console.time("loadHTML");

    const docs = await loadHTML(url);

    console.timeEnd("loadHTML");

    console.log("splitting...");
    console.time("splitting");

    const textSplitter = new TokenSplitter({
      chunk: true,
      chunkSize: 500,
    });
    console.log("splitted");
    console.timeEnd("splitting");

    const chunks = textSplitter.splitDocuments(docs);

    console.log("creating embeddings...");
    console.time("embedding");
    const embeddings = new Embeddings(EMBEDDING_KEY, openai, chunks, {
      cacheDir: CACHE_DIR,
    });
    console.log("embedded");
    console.timeEnd("embedding");

    console.log("indexing...");
    console.time("indexing");
    await embeddings.index();
    console.log("indexed");
    console.timeEnd("indexing");

    console.log("Chatbot ready!");
    // const memory = new BufferedChatMemory()
    // memory.
    const hostname = new URL(url).hostname;
    return hostname;
  } catch (e) {
    throw e;
  }
}
