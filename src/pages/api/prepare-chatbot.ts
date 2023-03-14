import type { NextApiRequest, NextApiResponse } from "next";
import { prepareChatbot } from "@/libs/prepareChatbot";

interface Body {
  url: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
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

  // const fileLoader = new FileLoader("./data/cache/index/chat-url.json");
  // const document = await fileLoader.load();
  // console.log("file", document);
  const hostname = await prepareChatbot(url);

  if (!hostname) {
    res.status(500).json("Failed to prepare chatbot");
    return;
  }
  res.status(200).json({ hostname });
}
