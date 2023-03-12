import { prepareChatbot } from "@/libs/prepareChatbot";
import type { NextApiRequest, NextApiResponse } from "next";

// export type CreateEmbeddingsRequest = {
//   input: Document[] | Document | string | string[];
// };

// const SystemMessage: ChatMessage = {
//   role: "system",
//   content: "You are a helpful assistant explaining a article to a user.",
// };

// const openai = new OpenAI(process.env.OPENAI_API_KEY || "");

// const sources = ["https://www.buildt.ai/blog/vm3qozd4qfrbbyzukqhynrwm9vb9tq"];

// let embeddedDocuments: Document[] = [];

// for (const source of sources) {
//   const response = await axios.get(source);
//   const html = await response.data();
//   const docs = await loadHTML(html, { source, html });

//   const textSplitter = new TokenSplitter({
//     chunk: true,
//     chunkSize: 1000,
//   });

//   const chunks = textSplitter.splitDocuments(docs);

//   let totalTokens = 0;

//   for (const chunk of chunks) {
//     const tokens = openai.countTokens(chunk.data);
//     totalTokens += tokens;

//     const embeddingResponse = await openai.createEmbeddings({ input: chunk });

//     embeddedDocuments = embeddedDocuments.concat(embeddingResponse.documents);

//     await new Promise((resolve) => setTimeout(resolve, 100));
//   }
// }

// const ratelimit = redis
//   ? new Ratelimit({
//       redis: redis,
//       limiter: Ratelimit.fixedWindow(3, '60 s'),
//     })
//   : undefined;

interface Body {
  url: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  // Rate Limiter Code
  // if (ratelimit) {
  //   const identifier = requestIp.getClientIp(req);
  //   const result = await ratelimit.limit(identifier!);
  //   res.setHeader('X-RateLimit-Limit', result.limit);
  //   res.setHeader('X-RateLimit-Remaining', result.remaining);

  //   if (!result.success) {
  //     res.status(429).json('Too many uploads in 1 minute. Please try again in a few minutes.');
  //     return;
  //   }
  // }

  const { url } = JSON.parse(req.body) as Body;
  console.log("body", req.body);
  console.log("input", url);

  const embeddings = await prepareChatbot(url);

  // res.session

  res.status(200).json(url ?? "Failed to retreive message");
}
