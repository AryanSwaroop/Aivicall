import React, { useState } from "react";
import axiosInstance from "../../api/apiInstance";
import API_ENDPOINTS from "../../api/endpoints";

const ChatWindow = () => {
  const [request, setRequest] = useState("");
  const [promptResult, setPromptResult] = useState("");

  const handleShare = () => {
    axiosInstance
      .post(API_ENDPOINTS.AI_POST_ROUTE, { message: request })
      .then((res) => {
        const resultText = typeof res.data === 'object' ? res.data.response : res.data;
        setPromptResult(resultText);
      })
      .catch((error) => {
        console.error("AI Error:", error);
        setPromptResult("Something went wrong. Please try again.");
      });
  };

  return (
    <div className="flex flex-col h-96 w-full max-w-3xl border border-purple-800 rounded-2xl p-4 shadow-lg mx-auto mt-8 bg-gradient-to-br from-black via-purple-950 to-black text-white">
      <div className="flex items-center gap-4 mb-4">
        <input
          type="text"
          className="flex-grow bg-black border border-purple-700 text-white rounded-lg px-4 py-2 text-lg shadow-md focus:outline-none focus:ring-2 focus:ring-purple-600"
          placeholder="Type your message..."
          onChange={(e) => setRequest(e.target.value)}
        />
        <button
          className="bg-purple-700 hover:bg-purple-800 text-white font-semibold px-6 py-2 rounded-lg shadow-lg transition"
          onClick={handleShare}
        >
          Send
        </button>
      </div>
      <div className="flex-grow overflow-auto bg-black border border-purple-700 rounded-lg p-4 text-lg">
        <h1 className="whitespace-pre-wrap break-words text-purple-200">{promptResult}</h1>
      </div>
    </div>
  );
};

export default ChatWindow;
