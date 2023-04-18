import type { NextApiRequest, NextApiResponse } from "next";
import { prepareChatbot } from "@/libs/prepareChatbot";

interface Body {
  url: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { url } = JSON.parse(req.body) as Body;

  const hostname = await prepareChatbot(url);

  if (!hostname) {
    res.status(500).json("Failed to prepare chatbot");
    return;
  }
  res.status(200).json({ hostname });
}
