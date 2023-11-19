import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { AssistantChatCard } from "./assistantChat";
import { UserChatCard } from "./userChat";
import "./ResultWithSources.css";

const Icon = ({ pngFile }) => {
  const userImage = "/assets/images/green-square.png";
  const botImage = `/assets/images/${pngFile}.png`;

  return (
    <div className="">
      <Image
        src={botType === "user" ? userImage : botImage}
        alt={`${botType}'s profile`}
        width={32}
        height={32}
        className="rounded"
        priority
        unoptimized
      />
    </div>
  );
};

const TextContent = ({ message }) => {
  return <p className="text-sm text-muted-foreground">{message.text}</p>;
};

const ResultWithSources = ({ messages, loading = false }) => {
  const messagesContainerRef = useRef();
  useEffect(() => {
    if (messagesContainerRef.current) {
      const element = messagesContainerRef.current;
      element.scrollTop = element.scrollHeight;
    }
  }, [messages]);

  const maxMsgToScroll = 5;

  return (
    <div
      ref={messagesContainerRef}
      className={`bg-white p-10 overflow-y-auto flex flex-col space-y-4 ${
        messages.length < maxMsgToScroll && "justify-end"
      } chat-container-content`}
    >
      {messages &&
        messages.map((message, index) => {
          var latestResponse = index === messages.length - 1;
          var loadingMessage = latestResponse && loading;

          console.log(latestResponse, index, message, loadingMessage);
          return message.type === "bot" ? (
            <AssistantChatCard
              key={index}
              text={loadingMessage ? "Loading ..." : message.text}
            />
          ) : (
            <UserChatCard key={index} text={message.text} />
          );
        })}
    </div>
  );
};

export default ResultWithSources;
