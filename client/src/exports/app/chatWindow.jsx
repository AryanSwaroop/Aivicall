import React, { useState } from "react";
import axios from "axios";
import API_ENDPOINTS from "../../api/endpoints";

const ChatWindow = () => {

  const [request, setRequest] = useState("");
  const [promptResult , setPromptResult] = useState("");


  const handleShare = () => {

    axios.post( API_ENDPOINTS.AI_POST_ROUTE , { message: request } , {
      headers: {
        "Access-Control-Allow-Origin": API_ENDPOINTS.FRONT_URL,
        "Access-Control-Allow-Credentials": "true",
        "Content-Type" : "application/json"
      }
    })
    .then((res) => {
      setPromptResult(res.data);
    })

}


    return (
        <div className="chatOutline">
        <div className="writingSec">
          <input className="chatBox" onChange={(e) => {setRequest(e.target.value)}} />
          <button className="sendButton" onClick={handleShare} ><b>Send</b></button>
        </div>
        <div className="outputSec">
          <h1 className="textField">
            {promptResult}
          </h1>
        </div>
        </div>
    )
}

export default ChatWindow;