import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../../Context/SocketProvider";
import API_ENDPOINTS from "../../api/endpoints";
import axiosInstance from "../../api/apiInstance";

const linkVariant = {
  hidden: {
    opacity: 0,
    x: -1000,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: "easeInOut",
    },
  },
};

export default function CreateLink() {
  const [room, setRoom] = useState("");
  const [id, setId] = useState("");
  const [linkShow, setlinkShow] = useState(false);
  const [userData, setUserData] = useState("");

  const socket = useSocket();
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance
      .get(API_ENDPOINTS.GET_MEET_CODE)
      .then((res) => {
        setUserData(res);
        const temp = JSON.parse(JSON.stringify(res.data.displayName).replace(/ /g, ""));
        setId(temp);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [setlinkShow]);

  const handleCopy = () => {
    setRoom(userData.data.id);
    navigator.clipboard.writeText(userData.data.id);
    alert("Copied to clipboard!");
  };

  const joinHandler = useCallback(() => {
    navigator.clipboard.writeText(room);
    socket.emit("room:join", { id, room });
  }, [id, room, socket]);

  const handleJoinRoom = useCallback(
    ({ id, room }) => {
      navigate(`/room/${room}`);
    },
    [navigate]
  );

  const preJoin = () => {
    if (linkShow) {
      setRoom(userData.data.id);
      joinHandler();
    } else {
      alert("Copy the Code to share first!");
    }
  };

  useEffect(() => {
    socket.on("room:join", handleJoinRoom);
    return () => socket.off("room:join", handleJoinRoom);
  }, [handleJoinRoom]);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-black via-purple-950 to-black px-4 pt-20">
      <motion.button
        className="bg-gradient-to-r from-purple-700 to-purple-500 text-white py-3 px-6 rounded-xl shadow-lg hover:from-purple-800 hover:to-purple-600 transition-all"
        whileHover={{ scale: 1.1 }}
        onClick={() => setlinkShow(true)}
      >
        Join Meeting
      </motion.button>

      {linkShow && (
        <motion.div
          className="mt-6 p-6 bg-black/80 border border-purple-700 text-purple-100 rounded-xl shadow-[0_0_20px_rgba(128,0,255,0.6)] w-full max-w-sm flex flex-col items-center"
          variants={linkVariant}
          initial="hidden"
          animate="visible"
        >
          <img
            src="icons/copy.svg"
            className="w-8 h-8 cursor-pointer"
            onClick={handleCopy}
            alt="copy-icon"
          />
          <h1 className="text-lg mt-2 font-semibold">Copy the Meeting Code</h1>
          <button
            className="mt-4 bg-purple-700 hover:bg-purple-800 text-white py-2 px-6 rounded-lg shadow-md transition-all"
            onClick={preJoin}
          >
            JOIN
          </button>
        </motion.div>
      )}

      {linkShow && (
        <motion.div
          className="mt-6 p-6 bg-black/80 border border-purple-700 text-purple-100 rounded-xl shadow-[0_0_20px_rgba(128,0,255,0.6)] w-full max-w-sm flex flex-col items-center"
          variants={linkVariant}
          initial="hidden"
          animate="visible"
        >
          <input
            placeholder="Paste Here!"
            className="w-full px-4 py-2 mb-4 bg-black text-purple-100 border border-purple-600 rounded-lg placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            type="text"
            onChange={(e) => setRoom(e.target.value)}
          />
          <button
            className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white py-2 px-6 rounded-lg shadow-md transition-all"
            onClick={joinHandler}
          >
            JOIN ANOTHER
          </button>
        </motion.div>
      )}
    </div>
  );
}
