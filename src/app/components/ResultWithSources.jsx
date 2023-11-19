import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { AssistantChatCard } from "./assistantChat";
import { UserChatCard } from "./userChat";
import Styles from "./ResultWithSources.module.css";

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
  return <p className="Styles.textContent">{message.text}</p>;
};

const ResultWithSources = ({ messages, loading = false }) => {
  const messagesContainerRef = useRef();
  useEffect(() => {
    if (messagesContainerRef.current) {
      const element = messagesContainerRef.current;
      element.scrollTop = element.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      ref={messagesContainerRef}
      className={Styles.chat_container_content}
    >
      {messages &&
        messages.map((message, index) => {
          var latestResponse = index === messages.length - 1;
          var loadingMessage = latestResponse && loading;

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
