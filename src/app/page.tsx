"use client";

import React, { useEffect, useState } from "react";
import ResultWithSources from "./components/ResultWithSources";
import PromptBox from "./components/PromptBox";
import "./globals.css";
import "./page.css";
import { useAuth } from "@clerk/nextjs";

const Home = () => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: "Hi, I'm Abdulla. Founder of the myaiclone. How can i assist you?",
      type: "bot",
    },
  ]);
  const [error, setError] = useState("");
  const { isLoaded, userId, sessionId, getToken } = useAuth();
  console.log("1111", useAuth());

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

  const recQuestions = [
    'What are you currently working on?',
    'Can you please tell me more about MyAiClone?',
    'What is the pricing of MyAiClone?'
  ];

  const handleSchedule = () => {
    console.log('clicked schedule')

    setMessages((prevMessages) => {
      const newMessages = [...prevMessages];
      const lastMessageIndex = newMessages.length;

      newMessages[lastMessageIndex] = {
        type: 'bot',
        text: `Delighted to connect with you! Beyond chatting with an AI clone, we offer the opportunity for a real conversation. Click here to arrange a meeting where we can discuss more in detail.<a 
        href="https://calendly.com/abbdulla" 
        style="color: #007bff; text-decoration: none; font-weight: bold;"
      >
        My Calendar Link
      </a>`,
      };

      return newMessages;
    });

  }

  useEffect(() => {
  }, [messages]);

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
          handleSchedule={handleSchedule}
        />
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() =>
              handlePromptSampleClick(recQuestions[0])
            }
            className={`text-left mr-3 py-3 px-6 bg-white shadow text-gray-900  rounded hover:shadow-xl transition-colors duration-200`}
          >
            {recQuestions[0]}
          </button>

          <button
            onClick={() => handlePromptSampleClick(recQuestions[1])}
            className={`text-left mr-3 py-3 px-6 bg-white shadow text-gray-900  rounded hover:shadow-xl transition-colors duration-200`}
          >
            {recQuestions[1]}
          </button>

          <button
            onClick={() => handlePromptSampleClick(recQuestions[2])}
            className={`text-left mr-3 py-3 px-6 bg-white shadow text-gray-900  rounded hover:shadow-xl transition-colors duration-200`}
          >
            {recQuestions[2]}
          </button>
        </div>
      </div>
    </>
  );
};

export default Home;
