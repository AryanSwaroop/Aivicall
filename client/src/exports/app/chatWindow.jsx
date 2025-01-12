import React, { useState } from "react";
import axios from "axios";
import API_ENDPOINTS from "../../api/endpoints";
import axiosInstance from "../../api/apiInstance";

const ChatWindow = () => {
  const [request, setRequest] = useState("");
  const [promptResult, setPromptResult] = useState("");

  const handleShare = () => {
    axiosInstance
      .post(
          API_ENDPOINTS.AI_POST_ROUTE,
          { message: request },
        )
      .then((res) => {
        setPromptResult(res.data);
      });
  };

  return (
    <div className="flex flex-col h-96 w-full max-w-3xl border rounded-2xl p-4 shadow-lg mx-auto mt-8 bg-white">
      <div className="flex items-center gap-4 mb-4">
        <input
          type="text"
          className="flex-grow border border-gray-300 rounded-lg px-4 py-2 text-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
          placeholder="Type your message..."
          onChange={(e) => setRequest(e.target.value)}
        />
        <button
          className="bg-black text-white font-semibold px-6 py-2 rounded-lg shadow hover:bg-gray-800 transition"
          onClick={handleShare}
        >
          Send
        </button>
      </div>
      <div className="flex-grow overflow-auto bg-gray-100 rounded-lg p-4 text-lg">
        <h1 className="whitespace-pre-wrap break-words">{promptResult}</h1>
      </div>
    </div>
  );
};

export default ChatWindow;
