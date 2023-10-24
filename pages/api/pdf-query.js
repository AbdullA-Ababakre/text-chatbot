import { PineconeClient } from "@pinecone-database/pinecone";
import { VectorDBQAChain } from "langchain/chains";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { OpenAI } from "langchain/llms/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import SSE from "express-sse";

const sse = new SSE();

// Function to handle SSE streaming
const handleSSEStreaming = async (input) => {
  const client = new PineconeClient();
  await client.init({
    apiKey: process.env.PINECONE_API_KEY,
    environment: process.env.PINECONE_ENVIRONMENT,
  });
  const pineconeIndex = client.Index(process.env.PINECONE_INDEX);

  const vectorStore = await PineconeStore.fromExistingIndex(
    new OpenAIEmbeddings(),
    { pineconeIndex }
  );

  const chat = new OpenAI({
    streaming: true,
    callbacks: [
      {
        handleLLMNewToken(token) {
          sse.send(token, "newToken"); // Send each token via SSE
        },
      },
    ],
  });

  const chain = VectorDBQAChain.fromLLM(chat, vectorStore, {
    k: 1,
    returnSourceDocuments: true,
  });

  chain.call({ query: input }).then(() => {
    sse.send(null, "end"); // Send end message to indicate completion
  });
};

// Example: https://js.langchain.com/docs/modules/indexes/document_loaders/examples/file_loaders/pdf
export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      const { input } = req.body;

      if (!input) {
        throw new Error("No input");
      }

      await handleSSEStreaming(input); // Initiate SSE streaming

      return res.status(200).json({ result: "Streaming complete" });
    } else if (req.method === "GET") {
      sse.init(req, res);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}
