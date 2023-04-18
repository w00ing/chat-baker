// import {
//   PuppeteerWebBaseLoader,
//   type Browser,
//   type Page,
// } from "langchain/document_loaders/web/puppeteer";
import chrome from "@sparticuz/chromium-min";
import { Document } from "langchain/document";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import puppeteer from "puppeteer-core";

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

    const browser = await puppeteer.launch({
      args: chrome.args,
      headless: true,
      defaultViewport: chrome.defaultViewport,
      executablePath: await chrome.executablePath(process.env.CHROMIUM_PATH),
      ignoreHTTPSErrors: true,
    });

    const page = await browser.newPage();

    console.log("Chromium:", await browser.version());
    console.log("Page Title:", await page.title());
    await page.goto(url, { waitUntil: "domcontentloaded" });

    const bodyText = await page.evaluate(() => document.body.innerText);

    await page.close();
    await browser.close();

    const docs = [
      new Document({ pageContent: bodyText, metadata: { source: url } }),
    ];

    const splittedDocs = await splitter.splitDocuments(docs);

    const vectorStore = await HNSWLib.fromDocuments(splittedDocs, embeddings);

    await vectorStore.save(CACHE_DIR);

    const hostname = new URL(url).hostname;
    return hostname;
  } catch (e) {
    throw e;
  }
}
