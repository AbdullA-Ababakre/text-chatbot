import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { PineconeClient } from "@pinecone-database/pinecone";
import { Document } from "langchain/document";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { CharacterTextSplitter } from "langchain/text_splitter";

export default async function handler(req, res) {
  if (req.method === "GET") {
    // console.log("Uploading book");
    /** STEP ONE: LOAD DOCUMENT */
    const bookPath =
      "https://ff23ef6721c027b7233dd9bb1903a69c6e784367ecd0211a64a05d7-apidata.googleusercontent.com/download/storage/v1/b/abdullapdfdata/o/AbdullaData.pdf?jk=AQHBpxy0H5-WqQauY5GWWEpygPcBqdw7X627d-vaLjI2legglWgqrYFCXBGwZA5E8dTu42SaFpssmXxEsMnHE-WmTAjlDId_ma8YjNVhbbyAsOhVJxNpwapLgYSF3ZVp0RPw6FHBh8HgnSX0XUsA5PuxL7xn4Z0xviOD0xkjLIBv2KAmURbJV_4rfsLoqnxcGkFrsbMS_LtXjUbOCNd2I_V0Brbd6RNZwaMpkb2OATgBs84NQB1AzAVm7Y4cZl5ybgmVK0g06SrsNpsToC-3xnTU3_lhZgBLkBI8CTOAcsVLdOydTQW1H1rcElRfvDnUfrhmx15wl3mqOpYe5vu5MIiTeFIglPVBVMVMkcGwhLb4vci4W9kxuZp3_2hSRcag3h4LEnU6_Z3IBL8i8L8tSHdrpcFUOeWMIwzn-C3-uPT3ZbJd2w4KhL3kpu9Rg7raoSYwUKZ-2RxlKSImEfolpZEddK-xZwBp_rvXcaCoVVrCG9OLoJkkEe5sdo5uPG5NiwQv9V9VgEVemf2iqDRYCwqgDeS2IIbLr7CLLNBdtD4Cm1kNV71chPaA9bZKsq5NA1aPYFE1_2Vy-7yST-IRGuYxENJVZMxyYmbYFKR_5xbMjX2rEsv7aJeW08CPANaFGz6e6E2suSQN2Q4MDRL5UHuE-7qeU1tAYjEN5RA_7nZSouy35nt-TXpMDn3XqA4hhH7QzGH8RTtlXj-f-uavoyfSk3wbwMNkAToaigw7UMlOAkmapFB9RaTOa5MeBC8HH-WXr3-qnQaMMEyWSMmiBHgT5ygYtNGLn1DtAe1rXldMtJGeIBOVhcqCeecLoMpWDwl3z95RzK0U8r6ho7I7CxIazEvOSraZYGI9RLf3oxMwgwaYRolXYfYvvEBm5t7hr7-hBESUNroKekHE6Ws7tpYxFKd7qz7D8kOgzTcr2WsmDjzQoZv8OrpaQ_tGkFOBdog778_dP9s9q8_cvSPCBtsdbfLYcegFRro6MO-WZ1-pxADVtyTXLCOt9uDpLhqTwEvIho1-0ofoVZf2HyI579Ft5jN0ZmZD3pTY27VAkwqkmxMMnYVD_kmzmDKsk3KTF2IteHIrmo-gs-ylk2xmoC4brHp7doHb9neszIe0DKPH7EZS-GTr05T55d4Moa5RqJSVxa2A4pswbHihYjJmtEr4et7W&isca=1";
    const loader = new PDFLoader(bookPath);

    const docs = await loader.load();
    console.log("docs11", docs);

    if (docs.length === 0) {
      // console.log("No documents found.");
      return;
    }

    const splitter = new CharacterTextSplitter({
      separator: " ",
      chunkSize: 250,
      chunkOverlap: 10,
    });

    const splitDocs = await splitter.splitDocuments(docs);

    // Reduce the size of the metadata for each document -- lots of useless pdf information
    const reducedDocs = splitDocs.map((doc) => {
      const reducedMetadata = { ...doc.metadata };
      delete reducedMetadata.pdf; // Remove the 'pdf' field
      return new Document({
        pageContent: doc.pageContent,
        metadata: reducedMetadata,
      });
    });

    /** STEP TWO: UPLOAD TO DATABASE */

    const client = new PineconeClient();

    await client.init({
      apiKey: process.env.PINECONE_API_KEY,
      environment: process.env.PINECONE_ENVIRONMENT,
    });

    const pineconeIndex = client.Index(process.env.PINECONE_INDEX);

    await PineconeStore.fromDocuments(reducedDocs, new OpenAIEmbeddings(), {
      pineconeIndex,
    });

    return res.status(200).json({
      result: `Uploaded to Pinecone! Before splitting: ${docs.length}, After splitting: ${splitDocs.length}`,
    });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
