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

// test 3
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
    navigator.clipboard.writeText(room);
    alert("copied to clipboard!");
  };

  const joinHandler = useCallback(
    (e) => {
      navigator.clipboard.writeText(room);
      socket.emit("room:join", { id, room });
    },
    [id, room, socket]
  );

  const handleJoinRoom = useCallback(
    (temp) => {
      const { id, room } = temp;
      navigate(`/room/${room}`);
    },
    [navigate]
  );

  const preJoin = () => {
    if (setlinkShow) {
      setRoom(userData.data.id);
      joinHandler();
    } else {
      alert("Copy the Code to share first!");
    }
  };

  useEffect(() => {
    socket.on("room:join", handleJoinRoom);

    return () => {
      socket.off("room:join", handleJoinRoom);
    };
  }, [handleJoinRoom]);

  return (
    <div className="flex flex-col items-center">
      <motion.button
        className="bg-blue-500 mt-20 text-white py-2 px-4 rounded-lg shadow-md hover:scale-105 transition-all"
        whileHover={{ scale: 1.1 }}
        onClick={(e) => {
          setlinkShow(true);
        }}
      >
        Join Meeting
      </motion.button>

      {linkShow && (
        <motion.div
          className="mt-4 p-4 bg-white rounded-lg shadow-md w-full max-w-sm flex flex-col items-center"
          variants={linkVariant}
          initial="hidden"
          animate="visible"
        >
          <img
            src="icons/copy.svg"
            className="w-8 h-8 cursor-pointer"
            onClick={handleCopy}
          />
          <h1 className="text-xl mt-2">Copy the Meeting Code</h1>
          <button
            className="mt-4 bg-green-500 text-white py-2 px-6 rounded-lg shadow-md hover:scale-105 transition-all"
            onClick={preJoin}
          >
            JOIN
          </button>
        </motion.div>
      )}

      {linkShow && (
        <motion.div
          className="mt-4 p-4 bg-white rounded-lg shadow-md w-full max-w-sm flex flex-col items-center"
          variants={linkVariant}
          initial="hidden"
          animate="visible"
        >
          <input
            placeholder="Paste Here!"
            className="border-2 border-gray-300 rounded-lg py-2 px-4 w-full"
            type="text"
            onChange={(e) => {
              setRoom(e.target.value);
            }}
          />
          <button
            className="mt-4 bg-yellow-500 text-white py-2 px-6 rounded-lg shadow-md hover:scale-105 transition-all"
            onClick={joinHandler}
          >
            JOIN ANOTHER
          </button>
        </motion.div>
      )}
    </div>
  );
}
