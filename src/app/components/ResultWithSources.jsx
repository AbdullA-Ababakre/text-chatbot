import React, { useEffect, useRef } from "react";
import Image from "next/image";

// const MessageItem = ({ message, pngFile, isLast }) => {
//   return (
//     <div className={`flex flex-col ${isLast ? "flex-grow" : ""}`}>
//       <div className="flex mb-4">
//         <div className="rounded mr-4 h-10 w-10 relative overflow-hidden">
//           <Image
//             src={botType === "user" ? userImage : botImage}
//             alt={`${botType}'s profile`}
//             width={32}
//             height={32}
//             className="rounded"
//             priority
//             unoptimized
//           />
//         </div>
//         <p
//           className={botType === "user" ? "user" : "bot"}
//           style={{ maxWidth: "90%" }}
//         >
//           {message.text}
//         </p>
//       </div>
//     </div>
//   );
// };

const ResultWithSources = ({ messages, pngFile, maxMsgs, botType, isLast }) => {
  const userImage = "/assets/images/green-square.png";
  const botImage = `/assets/images/${pngFile}.png`;
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
      <pre
        className={botType === "user" ? "user" : "bot"}
        style={{ maxWidth: "90%" }}
      >
        {messages}
      </pre>
      {/* {messages &&
        messages.map((message, index) => (
          <MessageItem key={index} message={message} pngFile={pngFile} />
          <div className={`flex flex-col  ${isLast ? "flex-grow" : ""} `}>
            <div className="flex mb-4">
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
              <pre
              className={botType === "user" ? "user" : "bot"}
              style={{ maxWidth: "90%" }}
              >
                {message.text}
              </pre>
            </div>
          </div>
        ))} */}
    </div>
  );
};

export default ResultWithSources;
