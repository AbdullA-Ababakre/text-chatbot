"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = handler;

var _pinecone = require("@pinecone-database/pinecone");

var _chains = require("langchain/chains");

var _openai = require("langchain/embeddings/openai");

var _openai2 = require("langchain/llms/openai");

var _pinecone2 = require("langchain/vectorstores/pinecone");

var _expressSse = _interopRequireDefault(require("express-sse"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var sse = new _expressSse["default"](); // Function to handle SSE streaming

var handleSSEStreaming = function handleSSEStreaming(input) {
  var client, pineconeIndex, vectorStore, chat, chain;
  return regeneratorRuntime.async(function handleSSEStreaming$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          client = new _pinecone.PineconeClient();
          _context.next = 3;
          return regeneratorRuntime.awrap(client.init({
            apiKey: process.env.PINECONE_API_KEY,
            environment: process.env.PINECONE_ENVIRONMENT
          }));

        case 3:
          pineconeIndex = client.Index(process.env.PINECONE_INDEX);
          _context.next = 6;
          return regeneratorRuntime.awrap(_pinecone2.PineconeStore.fromExistingIndex(new _openai.OpenAIEmbeddings(), {
            pineconeIndex: pineconeIndex
          }));

        case 6:
          vectorStore = _context.sent;
          chat = new _openai2.OpenAI({
            streaming: true,
            callbacks: [{
              handleLLMNewToken: function handleLLMNewToken(token) {
                sse.send(token, "newToken"); // Send each token via SSE
              }
            }]
          });
          chain = _chains.VectorDBQAChain.fromLLM(chat, vectorStore, {
            k: 1,
            returnSourceDocuments: true
          });
          chain.call({
            query: input
          }).then(function () {
            sse.send(null, "end"); // Send end message to indicate completion
          });

        case 10:
        case "end":
          return _context.stop();
      }
    }
  });
}; // Example: https://js.langchain.com/docs/modules/indexes/document_loaders/examples/file_loaders/pdf


function handler(req, res) {
  var input;
  return regeneratorRuntime.async(function handler$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;

          if (!(req.method === "POST")) {
            _context2.next = 10;
            break;
          }

          input = req.body.input;

          if (input) {
            _context2.next = 5;
            break;
          }

          throw new Error("No input");

        case 5:
          _context2.next = 7;
          return regeneratorRuntime.awrap(handleSSEStreaming(input));

        case 7:
          return _context2.abrupt("return", res.status(200).json({
            result: "Streaming complete"
          }));

        case 10:
          if (req.method === "GET") {
            sse.init(req, res);
          }

        case 11:
          _context2.next = 17;
          break;

        case 13:
          _context2.prev = 13;
          _context2.t0 = _context2["catch"](0);
          console.error(_context2.t0);
          res.status(500).json({
            message: _context2.t0.message
          });

        case 17:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 13]]);
}