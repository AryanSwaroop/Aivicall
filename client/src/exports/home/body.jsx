import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import API_ENDPOINTS from "../../api/endpoints";


const popVariants = {
    hidden : {
        y : -1000,
        opacity : 0
    },

    visible : {
        y : -100,
        opacity : 1
    },

    exit : {
        y : -1000,
        transition : {
            ease : "easeOut"
        }
    }
}

const google = ()=>{
    window.open(API_ENDPOINTS.BACK_CALLBACK , "_self")
}

export default function Body(){

    const [popStatus , setStatus] = useState(false);

    return(
    <div className="body">
        <h1 className="bodyText">
         Complete Your Projects With <br/>Friends And AI
        </h1>
        <motion.button 
            className="startedButton"
            whileHover={{scale : 1.1}}
            onClick={(e) => {setStatus(true)}}
        > 
            Get Started 

            <img src="icons/startedArrow.svg" className="startedArrow"/>
        </motion.button>
    

        <AnimatePresence>

        { popStatus && 

        (
                <motion.div className="popUp"
            variants={popVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            >
            <h1 className="popUpText">
                Login/SignUp
            </h1>

            <button className="googleSign" onClick={google}> 
            <motion.img src="icons/google.svg" className="googleIcon"
                
                whileHover= {{rotate : -360}}
            />
            </button>
            </motion.div>
        ) 
        }

        
        </AnimatePresence>


        { popStatus && 

        <div 
        className="blackScreen"
        onClick={(e) => {setStatus(false)}}
        >
        </div>
        }
        

     </div>
    )
}