import {
  PuppeteerWebBaseLoader,
  type Browser,
  type Page,
} from "langchain/document_loaders/web/puppeteer";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { HNSWLib } from "langchain/vectorstores/hnswlib";

export const CACHE_DIR = "/tmp/embeddings";

const embeddings = new OpenAIEmbeddings({
  openAIApiKey: process.env.OPENAI_API_KEY,
});

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 25,
});

export async function prepareChatbot(url: string) {
  try {
    if (!url) {
      return;
    }

    console.log("loader start");
    const loader = new PuppeteerWebBaseLoader(url, {
      launchOptions: {
        headless: true,
      },
      gotoOptions: {
        waitUntil: "domcontentloaded",
      },
      async evaluate(page: Page, browser: Browser) {
        // await page.waitForResponse(url);
        // console.log("wait complete");
        const result = await page.evaluate(() => document.body.innerText);
        console.log("result", result);
        return result;
      },
    });

    const docs = await loader.load();

    const splittedDocs = await splitter.splitDocuments(docs);

    const vectorStore = await HNSWLib.fromDocuments(splittedDocs, embeddings);

    await vectorStore.save(CACHE_DIR);

    const hostname = new URL(url).hostname;
    return hostname;
  } catch (e) {
    throw e;
  }
}
