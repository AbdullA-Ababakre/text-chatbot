"use client";

import React, { useState, useEffect } from "react";
import ResultWithSources from "../components/ResultWithSources";
import PromptBox from "../components/PromptBox";
import Button from "../components/Button";
import PageHeader from "../components/PageHeader";
import Title from "../components/Title";
import TwoColumnLayout from "../components/TwoColumnLayout";
import ButtonContainer from "../components/ButtonContainer";
import "../globals.css";

// This functional component is responsible for loading PDFs
const PDFLoader = () => {
  // Managing prompt, messages, and error states with useState
  const [prompt, setPrompt] = useState("How to get rich?");
  const [messages, setMessages] = useState(
    "Hi, I'm a Naval AI. What would you like to know?"
  );
  const [error, setError] = useState("");
  const [source, setSource] = useState(null);
  const [botType, setBotType] = useState("bot");

  // This function updates the prompt value when the user types in the prompt box
  //
  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
  };

  const handleSubmit = async (endpoint) => {
    try {
      const response = await fetch(`/api/${endpoint}`, {
        method: "GET",
      });

      const searchRes = await response.json();
      setError("");
    } catch (error) {
      console.log(error);
      setError(error.message);
    }
  };

  const processToken = (token) => {
    return token.replace(/\\n/g, "\n").replace(/\"/g, "");
  };

  const handleSubmitPrompt = async (endpoint) => {
    try {
      setPrompt("");

      setMessages(prompt);

      setBotType("user");

      await fetch(`/api/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: prompt }),
      });

      // close existing sources
      if (source) {
        source.close();
      }
      // Establish an SSE connection
      const newSource = new EventSource(`/api/${endpoint}`);
      setSource(newSource);

      newSource.addEventListener("newToken", (event) => {
        const token = processToken(event.data);
        setMessages((prevData) => prevData + token);

        setBotType("bot");
      });

      newSource.addEventListener("end", () => {
        newSource.close();
      });

      setError("");
    } catch (error) {
      setError(error.message);
    }
  };

  // Clean up the EventSource on component unmount
  useEffect(() => {
    // stuff is gonna happen
    return () => {
      if (source) {
        source.close();
      }
    };
  }, [source]);

  // The component returns a two column layout with various child components
  return (
    <>
      <Title emoji="💬" headingText="PDF-GPT" />
      <TwoColumnLayout
        leftChildren={
          <>
            <PageHeader
              heading="Ask Naval Anything"
              boldText="How to get rich? How to be happy?"
              description="This tool will
            let you ask anything contained in a PDF document. This tool uses
            Embeddings, Pinecone, VectorDBQAChain, and VectorStoreAgents. Please click the upload book first before use "
            />
            <ButtonContainer>
              <Button
                handleSubmit={handleSubmit}
                endpoint="pdf-upload"
                buttonText="Upload Book 📚"
                className="Button"
              />
            </ButtonContainer>
          </>
        }
        rightChildren={
          <>
            <ResultWithSources
              messages={messages}
              pngFile="pdf"
              botType={botType}
            />
            <PromptBox
              prompt={prompt}
              handlePromptChange={handlePromptChange}
              handleSubmit={() => handleSubmitPrompt("/pdf-query")}
              placeHolderText={"How to get rich?"}
              error={error}
            />
          </>
        }
      />
    </>
  );
};

export default PDFLoader;
