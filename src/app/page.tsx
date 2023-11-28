"use client";

import { last, toString } from "lodash";
import React, { useEffect, useState, useCallback, useRef } from "react";
import ResultWithSources from "./components/ResultWithSources";
import PromptBox from "./components/PromptBox";
import "./globals.css";
import "./page.css";

type T_MsgType = "bot" | "user";
enum E_MsgType {
  Bot = "bot",
  User = "user",
}
type T_Message = {
  text: string;
  type: T_MsgType;
};

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
  const [startSubmit, setStartSubmit] = useState<boolean>(false);
  const endpoint =
    "https://us-central1-tablesmart-e4593.cloudfunctions.net/sse";
  // Create a ref to store the EventSource instance and Create the EventSource when the component mounts
  const eventSourceRef = useRef<EventSource | null>(null);

  const handlePromptChange = (e: any) => {
    setPrompt(e.target.value);
  };

  const processToken = (token: string): string => {
    return token.replace(/\\n/g, "\n").replace(/\"/g, "");
  };


  const handleClose = useCallback(() => {
    setStartSubmit(false);
  }, []);

  const handleError = useCallback(
    (event: Event) => {
      const errorEvent = event as Event & { error: DOMException | null };
      const error = errorEvent.error;

      if (eventSourceRef.current) eventSourceRef.current.close(); // Close the SSE connection on error (optional)
      setStartSubmit(false);
      setError(toString(error));
    },
    [eventSourceRef]
  );

  let currentStreamedText = "";
  const handleNewToken = useCallback((event: MessageEvent) => {
    const token = processToken(event.data);
    currentStreamedText = currentStreamedText + token;
    console.log("currentStream11",currentStreamedText);

  }, []);


  const handleSubmitPrompt = async (query: string) => {
    setStartSubmit(true);
    setPrompt("");

    const userMessage = { type: "user", text: query.trim() };
    const bottMessage = { type: "bot", text: "" };
    setMessages([...messages, userMessage, bottMessage]);

    // try {
    //   const userMessage = { type: "user", text: query.trim() };
    //   const bottMessage = { type: "bot", text: "" };
    //   setMessages([...messages, userMessage, bottMessage]);

    //   try {
    //     setLoading(true);
    //     fetch(
    //       "https://us-central1-tablesmart-e4593.cloudfunctions.net/helloWorld?=",
    //       {
    //         method: "POST",
    //         headers: {
    //           "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify({
    //           data: {
    //             question: query,
    //             id: "c586c8e7-3a5d-48dc-9bc4-035060758f35",
    //             userId: "abdulla001",
    //           },
    //         }),
    //       }
    //     )
    //       .then((response) => response.json())
    //       .then((data) => {
    //         setMessages((prevMessages) => {
    //           const newMessages = [...prevMessages];
    //           const lastMessageIndex = newMessages.length - 1;

    //           newMessages[lastMessageIndex] = {
    //             ...newMessages[lastMessageIndex],
    //             text: data.data.answer,
    //           };

    //           return newMessages;
    //         });
    //         setLoading(false);
    //       })
    //       .catch((error: any) => console.error("Error:", error));
    //   } catch (error: any) {
    //     console.log("Error from HandleSubmit: ", error);
    //   }

    //   setPrompt("");
    //   setError("");
    // } catch (error: any) {
    //   setError(error.message);
    // }
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
    eventSourceRef.current = new EventSource(endpoint);
    let eventSource: EventSource = eventSourceRef.current;

    if (startSubmit) {
      eventSource = new EventSource(endpoint);

      eventSource.addEventListener("newToken", handleNewToken);
      eventSource.addEventListener("error", handleError);
      eventSource.addEventListener("close", handleClose);
      eventSource.addEventListener("end", handleClose);
    }

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [startSubmit, handleNewToken, handleError, handleClose]);

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
