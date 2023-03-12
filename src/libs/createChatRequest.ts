// import { loadHTML } from "@/libs/loadHTML";
// import { vectorSimilarity } from "@/libs/vectorSimilarity";
// import {
//   BufferedChatMemory,
//   ChatMessage,
//   EmbeddedDocument,
//   OpenAI,
//   Prompt,
//   TokenSplitter,
//   promptTemplates,
// } from "promptable";
// import axios from "axios";
// import chalk from "chalk";

// const SystemMessage: ChatMessage = {
//   role: "system",
//   content: "You are a helpful assistant explaining a article to a user.",
// };

// export async function createChatRequest(userInput: string) {
//   if (!userInput) {
//     return;
//   }
//   const openai = new OpenAI(process.env.OPENAI_API_KEY || "");
//   const source =
//     "https://medium.com/swmansion/releasing-reanimated-3-0-17fab4cb2394";
//   let embeddedDocuments: EmbeddedDocument[] = [];

//   console.log("Parsing data...");

//   const response = await axios.get(source);
//   const html = await response.data;
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
//   console.log("totalTokens", totalTokens);

//   console.log("Chatbot ready!");
//   const memory = new BufferedChatMemory();

//   // first we need to find the most relevant document

//   // create an embedding for the user input
//   const queryEmbeddingRes = await openai.createEmbeddings({
//     input: userInput,
//   });

//   // update documents with scores
//   const docsWithSimilarityScore = embeddedDocuments.map((doc) => {
//     return {
//       ...doc,
//       score: vectorSimilarity(
//         doc.embedding,
//         queryEmbeddingRes.documents[0].embedding
//       ),
//     };
//   });

//   const results = docsWithSimilarityScore
//     .sort((a, b) => {
//       return a.score > b.score ? -1 : 1;
//     })
//     .slice(0, 3)
//     .map((doc) => {
//       return doc.data;
//     })
//     .join("\n\n");

//   memory.addUserMessage(`Input: ${userInput}`);
//   const prompt = new Prompt(promptTemplates.QA, {
//     document: results,
//     question: userInput,
//   });

//   const res = await openai.chat(
//     {
//       messages: [
//         SystemMessage,
//         ...memory.getChatMessages(),
//         { role: "user", content: prompt.text },
//       ],
//     },
//     {
//       max_tokens: 1000,
//     }
//   );

//   memory.addBotMessage(res.message.content);
//   console.log(chalk.yellow("Assistant:", res.message.content));
//   return res.message.content;
// }

export { };
