import {
  PuppeteerWebBaseLoader,
  type Browser,
  type Page,
} from "langchain/document_loaders/web/puppeteer";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { HNSWLib } from "langchain/vectorstores/hnswlib";

export const CACHE_DIR = "./embeddings";

const embeddings = new OpenAIEmbeddings({
  openAIApiKey: process.env.OPENAI_API_KEY,
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

    const vectorStore = await HNSWLib.fromDocuments(docs, embeddings);

    await vectorStore.save(CACHE_DIR);

    const hostname = new URL(url).hostname;
    return hostname;
  } catch (e) {
    throw e;
  }
}
