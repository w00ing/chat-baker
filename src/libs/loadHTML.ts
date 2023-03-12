import type { Document } from "promptable";
import type { AnyNode, Cheerio} from "cheerio";
import { load } from "cheerio";
import TurndownService from "turndown";

interface LoadHTMLOptions {
  source: string;
  html: any;
}

export const loadHTML = async (
  html: string,
  options: LoadHTMLOptions
): Promise<Document[]> => {
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
    source: options.source,
  };

  const markdownContent = turndownService.turndown(content);

  documents.push({ content: markdownContent, meta });

  return documents;
};
