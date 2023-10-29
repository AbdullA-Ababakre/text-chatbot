import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { AssistantChatCard } from "./assistantChat";
import { UserChatCard } from "./userChat";

const Icon = ({ pngFile }) => {
  const userImage = "/assets/images/green-square.png";
  const botImage = `/assets/images/${pngFile}.png`;

  return (
    <div className="rounded mr-4 h-10 w-10 relative overflow-hidden">
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

const ResultWithSources = ({ messages, pngFile, maxMsgs, isLast }) => {
  const messagesContainerRef = useRef();

  useEffect(() => {
    if (messagesContainerRef.current) {
      const element = messagesContainerRef.current;
      element.scrollTop = element.scrollHeight;
    }
  }, [messages]);

  // E.g. Before we reach the max messages, we should add the justify-end property, which pushes messages to the bottom
  const maxMsgToScroll = maxMsgs || 5;

  return (
    <div
      ref={messagesContainerRef}
      className={`bg-white p-10 rounded-3xl shadow-lg mb-8 overflow-y-auto h-[500px] max-h-[500px] flex flex-col space-y-4 ${
        messages.length < maxMsgToScroll && "justify-end"
      }`}
    >
      {messages &&
        messages.map((message, index) =>
          message.type === "bot" ? (
            <AssistantChatCard key={index} text={message.text} />
          ) : (
            <UserChatCard key={index} text={message.text} />
          )
        )}
    </div>
  );
};

export default ResultWithSources;
