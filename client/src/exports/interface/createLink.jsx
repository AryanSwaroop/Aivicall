import { motion } from "framer-motion";
import { useState , useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../../Context/SocketProvider";

const linkVariant = {
    hidden : {
        opacity : 0,
        x : -1000
    },

    visible : {
        opacity : 1,
        x : 0,
        transition : {
            duration : 0.8,
            ease : "easeInOut"
        }
    }
}

// test 3
export default function CreateLink(){

    const [room,setRoom] = useState("");
    const [id , setId] = useState("");
    const [linkShow , setlinkShow] = useState(false);
    const [userData , setUserData] = useState("");
    const [copyDetect , setCopyDetect] = useState(false);

    const socket = useSocket();
    const navigate = useNavigate();

        axios({
            method : "GET",
        
            url : "https://aivicall.onrender.com/meet/meetCode",
        
            headers: {
                "Access-Control-Allow-Origin" : "https://aivicall.vercel.app",
                 Accept:"application/json",
                'Content-Type':"application/json",
                'Access-Control-Allow-Credentials': true
              },
        
        })
        
        .then((res) => {

            setUserData(res);
            const temp = JSON.parse(JSON.stringify(res.data.displayName).replace(/ /g,''));
            setId(temp);

        })
        
        .catch((err) => {
            console.log(err);
        })

    const handleCopy = () => {

        setRoom(userData.data.id);
        navigator.clipboard.writeText(room);
        alert("copied to clipboard !");
        setCopyDetect(true);
        
    }
    
    const joinHandler = useCallback(

        (e) => {
            
            navigator.clipboard.writeText(room);
            socket.emit("room:join" , {id , room});
        },
        [id , room , socket]
    );

    const handleJoinRoom = useCallback(
        (temp) => {
            const { id , room } = temp;

            navigate(`/room/${room}`);
        }, 
        [navigate]
    );

    const preJoin = () => {
        
        if (copyDetect){
         setRoom(userData.data.id);
         joinHandler();
        } else {
            alert("Copy the Code to share first !");
        }
        
    }

    useEffect(() => {
        socket.on("room:join" , handleJoinRoom);

        return () => {
            socket.off("room:join", handleJoinRoom);
        };

    },[socket , handleJoinRoom])

    return (

        <div>
            <motion.button
            className="meetingButton"
            whileHover={{ scale : 1.1}}
            onClick={(e) => {setlinkShow(true)}}
            >
            Join Meeting
            </motion.button>

            
            {linkShow && 
                <motion.div className="linkCopyBox"
                variants={linkVariant}
                initial="hidden"
                animate="visible"

                >
                <img src="icons/copy.svg" className="copyIcon" onClick={handleCopy}/>
                <h1 className="linkText" typeof="text" >Copy the Meeting Code </h1>
                <button className="startMeetingButton"
                onClick={preJoin}
                >
                    JOIN
                </button>
                </motion.div>
            }
            
            {linkShow && 
                <motion.div className="linkCopyBox adjustmentlinkCopyBox"
                variants={linkVariant}
                initial="hidden"
                animate="visible"
                >

                <input 
                    placeholder = "Paste Here !" 
                    className="AnotherlinkText" 
                    type="text" 
                    onChange={(e) => {setRoom(e.target.value)}}
                 />

                <button 
                  className="startAnotherMeetingButton"
                  onClick={joinHandler}
                >
                    JOIN ANOTHER
                </button>
                </motion.div>
            }
                
        </div>

    )
}