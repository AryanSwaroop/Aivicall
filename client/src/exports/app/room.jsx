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
      sendStreams();
    },
    [sendStreams]
  );

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
    setTimeout(() => setVisible(false), 2000);
  }, []);

  useEffect(() => {
    peer.peer.addEventListener("track", async (ev) => {
      const remoteStream = ev.streams;
      setRemoteStream(remoteStream[0]);
    });
  }, []);

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

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black via-purple-950 to-black p-4 space-y-6">
        {!remoteSocketId && (
          <h1 className="text-lg text-purple-300 tracking-wider">
            WAITING FOR PARTNER TO JOIN ...
          </h1>
        )}

        {visible && myStream && (
          <button
            onClick={sendStreams}
            className="bg-purple-700 hover:bg-purple-800 text-white py-2 px-6 rounded-xl shadow-lg transition"
          >
            Connect
          </button>
        )}

        {!myStream && remoteSocketId && (
          <button
            onClick={handleCallUser}
            className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-6 rounded-xl shadow-lg transition"
          >
            Start Meet
          </button>
        )}

        {remoteStream && (
          <button
            onClick={muteHandler}
            className="bg-purple-900 hover:bg-purple-800 text-white py-2 px-6 rounded-xl shadow-lg transition"
          >
            {mute ? "Unmute" : "Mute"}
          </button>
        )}

        <div className="flex space-x-6 mt-6">
          {myStream && (
            <ReactPlayer
              playing
              muted={mute}
              height="10rem"
              width="10rem"
              url={myStream}
              style={{
                border: "2px solid #7e22ce",
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
                border: "2px solid #9333ea",
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
