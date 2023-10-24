"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = handler;

var _pdf = require("langchain/document_loaders/fs/pdf");

var _pinecone = require("@pinecone-database/pinecone");

var _document = require("langchain/document");

var _openai = require("langchain/embeddings/openai");

var _pinecone2 = require("langchain/vectorstores/pinecone");

var _text_splitter = require("langchain/text_splitter");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function handler(req, res) {
  var bookPath, loader, docs, splitter, splitDocs, reducedDocs, client, pineconeIndex;
  return regeneratorRuntime.async(function handler$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (!(req.method === "GET")) {
            _context.next = 22;
            break;
          }

          // console.log("Uploading book");

          /** STEP ONE: LOAD DOCUMENT */
          bookPath = "/Users/abdullaababakre/Desktop/text-chatbot/data/document_loaders/bitcoin.pdf";
          loader = new _pdf.PDFLoader(bookPath);
          _context.next = 5;
          return regeneratorRuntime.awrap(loader.load());

        case 5:
          docs = _context.sent;

          if (!(docs.length === 0)) {
            _context.next = 8;
            break;
          }

          return _context.abrupt("return");

        case 8:
          splitter = new _text_splitter.CharacterTextSplitter({
            separator: " ",
            chunkSize: 250,
            chunkOverlap: 10
          });
          _context.next = 11;
          return regeneratorRuntime.awrap(splitter.splitDocuments(docs));

        case 11:
          splitDocs = _context.sent;
          // Reduce the size of the metadata for each document -- lots of useless pdf information
          reducedDocs = splitDocs.map(function (doc) {
            var reducedMetadata = _objectSpread({}, doc.metadata);

            delete reducedMetadata.pdf; // Remove the 'pdf' field

            return new _document.Document({
              pageContent: doc.pageContent,
              metadata: reducedMetadata
            });
          });
          /** STEP TWO: UPLOAD TO DATABASE */

          client = new _pinecone.PineconeClient();
          _context.next = 16;
          return regeneratorRuntime.awrap(client.init({
            apiKey: process.env.PINECONE_API_KEY,
            environment: process.env.PINECONE_ENVIRONMENT
          }));

        case 16:
          pineconeIndex = client.Index(process.env.PINECONE_INDEX);
          _context.next = 19;
          return regeneratorRuntime.awrap(_pinecone2.PineconeStore.fromDocuments(reducedDocs, new _openai.OpenAIEmbeddings(), {
            pineconeIndex: pineconeIndex
          }));

        case 19:
          return _context.abrupt("return", res.status(200).json({
            result: "Uploaded to Pinecone! Before splitting: ".concat(docs.length, ", After splitting: ").concat(splitDocs.length)
          }));

        case 22:
          res.status(405).json({
            message: "Method not allowed"
          });

        case 23:
        case "end":
          return _context.stop();
      }
    }
  });
}