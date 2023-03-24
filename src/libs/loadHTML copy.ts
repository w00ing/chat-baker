import { type Document } from "promptable";
import puppeteer from "puppeteer";
import TurndownService from "turndown";
import UserAgent from "user-agents";

export const loadHTML = async (url: string): Promise<Document[]> => {
  try {
    const userAgent = new UserAgent();
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setUserAgent(userAgent.toString());
    await page.goto(url, { waitUntil: "networkidle0" });

    const content = await page.evaluate(() => {
      const extractText = (node: any): string => {
        if (node.nodeType === 3) {
          return node.nodeValue.replace(/\s+/g, " ");
        } else if (node.nodeType === 1) {
          if (node.tagName.toLowerCase() === "br") {
            return "\n";
          } else if (
            node.tagName.toLowerCase() === "style" ||
            node.tagName.toLowerCase() === "script"
          ) {
            return "";
          } else {
            return Array.from(node.childNodes).map(extractText).join("");
          }
        }
        return "";
      };

      return extractText(document.body);
    });
    // console.log("content", content);

    const meta = await page.evaluate(() => ({
      title: document.title,
      author: document.querySelector('meta[name="author"]')?.textContent || "",
      date: document.querySelector('meta[name="date"]')?.textContent || "",
      source: window.location.href,
    }));

    await browser.close();

    const turndownService = new TurndownService();
    const markdownContent = turndownService.turndown(content);

    const documents: Document[] = [{ content: markdownContent, meta }];
    // console.log("documents", documents);
    return documents;
  } catch (e) {
    console.log(e);
    throw e;
  }
};
