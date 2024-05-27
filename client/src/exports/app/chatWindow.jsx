import React, { useState } from "react";
import axios from "axios";

const ChatWindow = () => {

  const [request, setRequest] = useState("");
  const [promptResult , setPromptResult] = useState("");


  const handleShare = () => {

    axios.post("http://localhost:4000/sendData", { message: request } , {
      headers: {
        "Access-Control-Allow-Origin": "http://localhost:3000",
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