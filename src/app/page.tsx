"use client";

import React, { useState } from "react";
import ResultWithSources from "./components/ResultWithSources";
import PromptBox from "./components/PromptBox";
import Button from "./components/Button";
import PageHeader from "./components/PageHeader";
import Title from "./components/Title";
import TwoColumnLayout from "./components/TwoColumnLayout";
import ButtonContainer from "./components/ButtonContainer";
import "./globals.css";

const PDFLoader = () => {
  const [prompt, setPrompt] = useState("How to get rich?");
  const [messages, setMessages] = useState([
    {
      text: "Hi, I'm a Abdulla. Founder of the myaiclone. What I can assist you? Can I assist you more ?",
      type: "bot",
    },
  ]);
  const [error, setError] = useState("");

  const handlePromptChange = (e: any) => {
    setPrompt(e.target.value);
  };

  const handleSubmit = async (endpoint: string) => {
    try {
      const response = await fetch(`/api/${endpoint}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      const searchRes = await response.json();
      setError("");
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleSubmitPrompt = async (endpoint: any) => {
    try {
      setPrompt("");

      const userMessage = { type: "user", text: prompt.trim() };
      const bottMessage = { type: "bot", text: "" };
      setMessages([...messages, userMessage, bottMessage]);

      try {
        fetch(
          "https://us-central1-tablesmart-e4593.cloudfunctions.net/helloWorld?=",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              data: {
                question: prompt,
                id: "c586c8e7-3a5d-48dc-9bc4-035060758f35",
                userId: "farza001",
              },
            }),
          }
        )
          .then((response) => response.json())
          .then((data) => {
            setMessages((prevMessages) => {
              const newMessages = [...prevMessages];
              const lastMessageIndex = newMessages.length - 1;

              newMessages[lastMessageIndex] = {
                ...newMessages[lastMessageIndex],
                text: data.data.answer,
              };

              return newMessages;
            });
          })
          .catch((error: any) => console.error("Error:", error));
      } catch (error: any) {
        console.log("Error from HandleSubmit: ", error);
      }

      setError("");
    } catch (error: any) {
      setError(error.message);
    }
  };



  // The component returns a two column layout with various child components
  return (
    <>
      <Title emoji="💬" headingText="PDF-GPT" />
      <TwoColumnLayout
        rightChildren={
          <>
            <ResultWithSources messages={messages} />
            <PromptBox
              prompt={prompt}
              handlePromptChange={handlePromptChange}
              handleSubmit={() => handleSubmitPrompt("/pdf-query")}
              placeHolderText={"How to get rich?"}
              error={error}
              buttonText={"buttonText"} disableButton={true} labelText={"LabelText"} />
          </>
        }
      />
    </>
  );
};

export default PDFLoader;
