import ReactPlayer from "react-player";
import { useSocket } from "../../Context/SocketProvider";
import React , { useCallback, useEffect, useState } from "react";
import peer from "../../service/peer";
import Navbar from "../home/navbar";
import ChatWindow from "./chatWindow";


const Room = () => {

    const socket = useSocket();

    const [remoteSocketId , setRemoteSocketId] = useState(null);
    const [myStream , setMyStream] = useState();
    const [remoteStream , setRemoteStream ] = useState();
    const [visible , setVisible] = useState(true);
    const [mute , setMute] = useState(false);
    const handleUserJoined = useCallback( ({ id , socketId }) => {

        console.log(`${id} joined the room.`);
        setRemoteSocketId(socketId);

    },[]);

    const muteHandler = () => {

      if( mute ) {

      setMute(false);

       }

      else {

        setMute(true);

       }
       
    }

    const handleCallUser = useCallback(async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video : true,
        });

        const offer = await peer.getOffer();
        socket.emit("user:call" , {to: remoteSocketId , offer});
        setMyStream(stream);
    },[remoteSocketId, socket]);

    const handleIncomingCall = useCallback(
        async ({ from , offer }) => {
            setRemoteSocketId(from);
            const stream = await navigator.mediaDevices.getUserMedia({
                audio : true,
                video : true,
            });
            setMyStream(stream);
            console.log(`Incoming Call` , from , offer );
            const ans = await peer.getAnswer(offer);
            socket.emit("call:accepted" , { to : from , ans });
        },
        [socket]
    );

    const sendStreams = useCallback(() => {
        for(const track of myStream.getTracks()) {
            peer.peer.addTrack(track , myStream);
        }
    },
       [myStream]
    );

    const handleCallAccepted = useCallback(
        ({ from , ans }) => {
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
    
      // this is from webrtc file and peer.
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
        },2000);
      }, []);

/******************************************Nego */    

    useEffect(() => {
        peer.peer.addEventListener("track", async(ev) => {
            const remoteStream = ev.streams;
            console.log("Tracks Got");
            setRemoteStream(remoteStream[0]);
        });
    },[]);
    /*****************************socket Handeling */
    useEffect(() => {
        socket.on("user:joined" , handleUserJoined);
        socket.on("incoming:call" , handleIncomingCall);
        socket.on("call:accepted" , handleCallAccepted);
        socket.on("peer:nego:needed", handleNegoNeedIncomming);
        socket.on("peer:nego:final", handleNegoNeedFinal);

        return () => {
            socket.off("user:joined" , handleUserJoined);
            socket.off("incoming:call" , handleIncomingCall);
            socket.off("call:accepted" , handleCallAccepted);
            socket.off("peer:nego:needed", handleNegoNeedIncomming);
            socket.off("peer:nego:final", handleNegoNeedFinal);
        }
    },[
        socket,
        handleUserJoined,
        handleIncomingCall,
        handleCallAccepted,
        handleNegoNeedIncomming,
        handleNegoNeedFinal
    ]);
    /*****************************socket Handeling */

    return (
      <>
      <Navbar/>
        <div className="MainScreen">
      

      {!remoteSocketId && <h1 className="waitingMessage">  WAITING FOR PARTNER TO JOIN ... </h1>}
      {visible && myStream && <button onClick={sendStreams} className="MeetingButtons">Connect</button>}
      {!myStream && remoteSocketId && <button className="MeetingButtons" onClick={handleCallUser}>Start Meet</button>}
      
      { remoteStream && 
      
      <button onClick={muteHandler} className="MuteButton"> {mute ? "Unmute" : "Mute"} </button>
      
      }   

      <div className="videosFrame">  

      
      
      {remoteStream && (
    
          <ReactPlayer
            playing
            muted = {mute}
            height="10rem"
            style={{
              border: "solid",
              borderWidth : "0.1rem",
              borderRadius : "1rem",
              marginLeft : "5%",
              marginTop : "2%",
            }}
            width="10rem"
            url={myStream}
          />
        
      )}

      {remoteStream && (
        
          <ReactPlayer

            playing
            muted = {mute}
            height="10rem"
            style={{
              border: "solid",
              borderWidth : "0.1rem",
              borderRadius : "1rem ",
              marginTop : "2%",
              marginLeft : "5%",
            }}
            width="10rem"
            url={remoteStream}
          />

          
        
      ) 
      
      }

      </div>

      {myStream  && <ChatWindow/>}
        </div>
        </>
    )
}

export default Room;