import ReactPlayer from "react-player";
import { useSocket } from "../../Context/SocketProvider";
import React, { useCallback, useEffect, useState } from "react";
import peer from "../../service/peer";
import Navbar from "../home/navbar";
import ChatWindow from "./chatWindow";

const Room = () => {
  const socket = useSocket();

  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState();
  const [remoteStream, setRemoteStream] = useState();
  const [visible, setVisible] = useState(true);
  const [mute, setMute] = useState(false);

  const handleUserJoined = useCallback(({ id, socketId }) => {
    console.log(`${id} joined the room.`);
    setRemoteSocketId(socketId);
  }, []);

  const muteHandler = () => {
    setMute((prevMute) => !prevMute);
  };

  const handleCallUser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });

    const offer = await peer.getOffer();
    socket.emit("user:call", { to: remoteSocketId, offer });
    setMyStream(stream);
  }, [remoteSocketId, socket]);

  const handleIncomingCall = useCallback(
    async ({ from, offer }) => {
      setRemoteSocketId(from);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream(stream);
      console.log(`Incoming Call`, from, offer);
      const ans = await peer.getAnswer(offer);
      socket.emit("call:accepted", { to: from, ans });
    },
    [socket]
  );

  const sendStreams = useCallback(() => {
    for (const track of myStream.getTracks()) {
      peer.peer.addTrack(track, myStream);
    }
  }, [myStream]);

  const handleCallAccepted = useCallback(
    ({ from, ans }) => {
      peer.setRemoteDisc(ans);
      console.log("call Accepted");
      sendStreams();
    },
    [sendStreams]
  );

  /******************************************Nego */

  const handleNegoNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
  }, [remoteSocketId, socket]);

  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
    return () => {
      peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
    };
  }, [handleNegoNeeded]);

  const handleNegoNeedIncomming = useCallback(
    async ({ from, offer }) => {
      const ans = await peer.getAnswer(offer);
      socket.emit("peer:nego:done", { to: from, ans });
    },
    [socket]
  );

  const handleNegoNeedFinal = useCallback(async ({ ans }) => {
    await peer.setRemoteDisc(ans);
    setTimeout(() => {
      setVisible(false);
    }, 2000);
  }, []);

  /******************************************Nego */

  useEffect(() => {
    peer.peer.addEventListener("track", async (ev) => {
      const remoteStream = ev.streams;
      console.log("Tracks Got");
      setRemoteStream(remoteStream[0]);
    });
  }, []);

  /*****************************socket Handeling */
  useEffect(() => {
    socket.on("user:joined", handleUserJoined);
    socket.on("incoming:call", handleIncomingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegoNeedIncomming);
    socket.on("peer:nego:final", handleNegoNeedFinal);

    return () => {
      socket.off("user:joined", handleUserJoined);
      socket.off("incoming:call", handleIncomingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegoNeedIncomming);
      socket.off("peer:nego:final", handleNegoNeedFinal);
    };
  }, [
    socket,
    handleUserJoined,
    handleIncomingCall,
    handleCallAccepted,
    handleNegoNeedIncomming,
    handleNegoNeedFinal,
  ]);
  /*****************************socket Handeling */

  return (
    <>
      <Navbar />
      <div className="main-screen flex flex-col items-center justify-center p-4 space-y-4">
        {!remoteSocketId && (
          <h1 className="text-xl text-gray-500">WAITING FOR PARTNER TO JOIN ...</h1>
        )}
        {visible && myStream && (
          <button
            onClick={sendStreams}
            className="bg-blue-600 text-white py-2 px-6 rounded-lg shadow-lg hover:bg-blue-700 transition"
          >
            Connect
          </button>
        )}
        {!myStream && remoteSocketId && (
          <button
            className="bg-green-600 text-white py-2 px-6 rounded-lg shadow-lg hover:bg-green-700 transition"
            onClick={handleCallUser}
          >
            Start Meet
          </button>
        )}

        {remoteStream && (
          <button
            onClick={muteHandler}
            className="bg-gray-800 text-white py-2 px-6 rounded-lg shadow-lg hover:bg-gray-700 transition"
          >
            {mute ? "Unmute" : "Mute"}
          </button>
        )}

        <div className="flex space-x-4 mt-4">
          {remoteStream && (
            <ReactPlayer
              playing
              muted={mute}
              height="10rem"
              width="10rem"
              url={myStream}
              style={{
                border: "solid",
                borderWidth: "0.1rem",
                borderRadius: "1rem",
              }}
            />
          )}

          {remoteStream && (
            <ReactPlayer
              playing
              muted={mute}
              height="10rem"
              width="10rem"
              url={remoteStream}
              style={{
                border: "solid",
                borderWidth: "0.1rem",
                borderRadius: "1rem",
              }}
            />
          )}
        </div>

        {myStream && <ChatWindow />}
      </div>
    </>
  );
};

export default Room;
