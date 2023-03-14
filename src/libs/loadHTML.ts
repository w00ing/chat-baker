import { load, type AnyNode, type Cheerio } from "cheerio";
import type { Document } from "promptable";
import TurndownService from "turndown";
import UserAgent from "user-agents";

export const loadHTML = async (url: string): Promise<Document[]> => {
  try {
    const userAgent = new UserAgent();
    const html = await fetch(url, {
      method: "GET",
      headers: { "User-Agent": userAgent.toString() },
    }).then((res) => res.text());
    const $ = load(html);
    const turndownService = new TurndownService();

    const documents: Document[] = [];

    const extractText = (el: Cheerio<AnyNode>): string => {
      if (el.is("style") || el.is("script")) {
        return "";
      }
      return el
        .contents()
        .map((i, el) => {
          if (el.nodeType === 3) {
            return el.nodeValue?.replace(/\s+/g, " ") || "";
            // @ts-expect-error : any
          } else if (el.nodeType === 1 && el?.tagName?.toLowerCase() === "br") {
            return "\n";
          } else {
            return extractText($(el));
          }
        })
        .get()
        .join("");
    };

    const content = extractText($("body"));

    const meta: Record<string, any> = {
      title: $("title").text(),
      author: $('meta[name="author"]').attr("content") || "",
      date: $('meta[name="date"]').attr("content") || "",
      source: url,
    };

    const markdownContent = turndownService.turndown(content);

    documents.push({ content: markdownContent, meta });

    return documents;
  } catch (e) {
    console.log(e);
    throw e;
  }
};
