import React from "react";
import { sourceCodePro } from "../styles/fonts";
import "./PrompotBox.css";
import { message } from "antd";

const PromptBox = ({
  prompt,
  handlePromptChange,
  handleSubmit,
  placeHolderText,
  buttonText,
  error,
  disableButton,
  labelText,
}) => {
  const [messageApi, contextHolder] = message.useMessage();
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }f
  };

  const handleVoiceCallClick = () => {
    messageApi.open({
      type: "success",
      content: "Clone voice call is coming....",
      className: "custom-class",
      style: {
        marginTop: "20vh",
      },
    });
  };

  const handleVideoCallClick = () => {
    messageApi.open({
      type: "success",
      content: "Clone video call is coming....",
      className: "custom-class",
      style: {
        marginTop: "20vh",
      },
    });
  };

  return (
    <>
      {contextHolder}
      <div className="flex items-center mb-4 gap-2">
        <input
          type="text"
          value={prompt}
          onChange={handlePromptChange}
          onKeyDown={handleKeyDown}
          placeholder={placeHolderText || "Enter your prompt"}
          className="mt-1 w-full py-2 px-4 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded shadow"
        />

        <div
          className="py-2 px-2 mt-1 bg-white h-full icon-container"
          onClick={handleVideoCallClick}
        >
          <img
            className="icon-logo icon-logo-video"
            src="/assets/images/video-solid.svg"
          />
        </div>
        <div
          className="py-2 px-2 mt-1 bg-white h-full icon-container"
          onClick={handleVoiceCallClick}
        >
          <img
            className="icon-logo icon-logo-phone"
            src="/assets/images/phone-solid.svg"
          />
        </div>

        {/* {!disableButton && (
          <button
            onClick={handleSubmit}
            className={`py-6 px-6 bg-white shadow text-gray-900 font-semibold rounded-full hover:shadow-xl transition-colors duration-200 uppercase ${sourceCodePro.className}`}
          >
            {buttonText || "Enter"}
          </button>
        )} */}
      </div>
      <p className={`text-red-500 ${error ? "block" : "hidden"}`}>{error}</p>
    </>
  );
};

export default PromptBox;
