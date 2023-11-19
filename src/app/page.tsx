"use client";

import React, { useState } from "react";
import ResultWithSources from "./components/ResultWithSources";
import PromptBox from "./components/PromptBox";
import "./globals.css";
import "./page.css";

const Home = () => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: "Hi, I'm a Abdulla. Founder of the myaiclone. How can i assist you?",
      type: "bot",
    },
  ]);
  const [error, setError] = useState("");

  const handlePromptChange = (e: any) => {
    setPrompt(e.target.value);
  };

  const handleSubmitPrompt = async (query: string) => {
    try {
      const userMessage = { type: "user", text: query.trim() };
      const bottMessage = { type: "bot", text: "" };
      setMessages([...messages, userMessage, bottMessage]);

      try {
        setLoading(true);
        fetch(
          "https://us-central1-tablesmart-e4593.cloudfunctions.net/helloWorld?=",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              data: {
                question: query,
                id: "c586c8e7-3a5d-48dc-9bc4-035060758f35",
                userId: "abdulla001",
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
            setLoading(false);
          })
          .catch((error: any) => console.error("Error:", error));
      } catch (error: any) {
        console.log("Error from HandleSubmit: ", error);
      }

      setPrompt("");
      setError("");
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handlePromptSampleClick = (samplePrompt: string) => {
    handleSubmitPrompt(samplePrompt);
  };

  return (
    <>
      <div className="chat-container">
        <div className="chat-header-container">
          <img
            className="chat-icon-logo"
            src="/assets/images/chatbotLogo.svg"
            height={30}
            width={30}
          />
          <p>myAiClone</p>
        </div>

        <ResultWithSources loading={loading} messages={messages} />

        <PromptBox
          prompt={prompt}
          handlePromptChange={handlePromptChange}
          handleSubmit={() =>
            handleSubmitPrompt(prompt)
          }
          placeHolderText={"What is the myaiclone project?"}
          error={error}
          buttonText={"buttonText"}
          disableButton={true}
          labelText={""}
        />
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() =>
              handlePromptSampleClick("What are you currently working on?")
            }
            className={`mr-3 py-3 px-6 bg-white shadow text-gray-900  rounded hover:shadow-xl transition-colors duration-200`}
          >
            What are you currently working on?
          </button>

          <button
            onClick={() => handlePromptSampleClick("what is your passion?")}
            className={`mr-3 py-3 px-6 bg-white shadow text-gray-900  rounded hover:shadow-xl transition-colors duration-200`}
          >
            what is your passion?
          </button>

          <button
            onClick={() => handlePromptSampleClick("where are you from?")}
            className={`mr-3 py-3 px-6 bg-white shadow text-gray-900  rounded hover:shadow-xl transition-colors duration-200`}
          >
            where are you from?
          </button>
        </div>
      </div>
    </>
  );
};

export default Home;
