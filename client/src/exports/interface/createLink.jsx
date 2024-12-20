import { motion } from "framer-motion";
import { useState , useEffect, useCallback, useDebugValue } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../../Context/SocketProvider";
import API_ENDPOINTS from "../../api/endpoints";

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

    const socket = useSocket();
    const navigate = useNavigate();

    useEffect(()=> {
        axios({
            method : "GET",
        
            url : API_ENDPOINTS.GET_MEET_CODE,
        
            headers: {
                "Access-Control-Allow-Origin" : API_ENDPOINTS.FRONT_URL,
                 Accept:"application/json",
                'Content-Type':"application/json",
                'Access-Control-Allow-Credentials': true
              },
        
        })
        
        .then((res) => {

            console.log(res);
            setUserData(res);
            const temp = JSON.parse(JSON.stringify(res.data.displayName).replace(/ /g,''));
            setId(temp);

        })
        
        .catch((err) => {
            console.log(err);
        })
    },[setlinkShow])


    const handleCopy = () => {

        setRoom(userData.data.id);
        navigator.clipboard.writeText(room);
        alert("copied to clipboard !");
        
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
        
        if (setlinkShow){
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