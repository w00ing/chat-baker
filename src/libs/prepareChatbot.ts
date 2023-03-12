import { loadHTML } from "@/libs/loadHTML";
import axios from "axios";
import { Embeddings, OpenAI, TokenSplitter } from "promptable";

// const SystemMessage: ChatMessage = {
//   role: "system",
//   content: "You are a helpful assistant explaining a article to a user.",
// };
const openai = new OpenAI(process.env.OPENAI_API_KEY || "");
export const EMBEDDING_KEY = "chat-url";
export const CACHE_DIR = "embeddings";

export async function prepareChatbot(url: string) {
  try {
    if (!url) {
      return;
    }

    console.log("Parsing data...");

    const response = await axios.get(url);
    const html = await response.data;
    const docs = await loadHTML(html, { source: url, html });

    const textSplitter = new TokenSplitter({
      chunk: true,
      chunkSize: 1000,
    });

    const chunks = textSplitter.splitDocuments(docs);

    const embeddings = new Embeddings(EMBEDDING_KEY, openai, chunks, {
      cacheDir: CACHE_DIR,
    });
    await embeddings.index();

    embeddings.save();

    console.log("Chatbot ready!");
    // const memory = new BufferedChatMemory()
    // memory.
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}
