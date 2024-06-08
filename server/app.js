require('dotenv').config();
const express = require('express');
const app = express();
const passport = require('passport');
const authRoute = require('./Routes/route');
const GoogleStrategy = require('passport-google-oauth20');
const cors = require('cors');
const session = require('express-session');
const server = require('http').createServer(app);

const io = require('socket.io')(server , {
    cors : {
        origin : "https://aivicall.vercel.app"
    }
});

const { GoogleGenerativeAI } = require("@google/generative-ai");

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.gemini_api_key);

async function getAiResponse(message) {
  // The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

  const prompt = message;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  return text;
}



app.use(express.json())

app.use(session({
    secret: 'somethingsecretgoeshere',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
 }));

app.use(passport.initialize());
app.use(passport.session());

app.use(cors(
    {
    origin:"https://aivicall.vercel.app",
    methods :"GET,POST,PUT,DELETE",
    credentials : true,
    SameSite : "none"

}));

app.post("/sendData" , async (req,res) => {
    console.log(req.body.message);
    let response = await getAiResponse(req.body.message);
    
    if(response){
     res.send(response);   
    }
});

let data = null;

 passport.use(new GoogleStrategy({

    clientID: process.env.CLIENTID,
    clientSecret: process.env.CLIENTSECRET,
    callbackURL: "https://aivicall.onrender.com/auth/google/callback"

  },

	function(token, refreshToken, profile, done) {
		// testing
		console.log('===== GOOGLE PROFILE =======')
		console.log(profile)
		console.log('======== END ===========')
        data = profile;
		// code
    
        done(null , profile);
    }

));


app.get("/sendData" , (req,res) => {
    console.log(req.body);
})

app.use(express.urlencoded({ extended : false }));

passport.serializeUser((user,done)=>{
    done(null,user)
})

passport.deserializeUser((user,done)=>{
    done(null,user)
})

app.get("/getData" , (req,res) => {
    res.send(data);
})

app.use("/auth", authRoute);

/***********************socket.io */

//using express and socket.io together.


const idToSocketIdMap = new Map();
const SocketIdToIdMap = new Map();

io.on("connection", (socket) => { 
    console.log(`socket Connected` , socket.id);

    socket.on("room:join" , (data) => {
        const { id , room } = data;
        idToSocketIdMap.set( id , socket.id);
        SocketIdToIdMap.set( socket.id , id);

        io.to(room).emit("user:joined" , { id , socketId: socket.id});
        socket.join(room);

        io.to(socket.id).emit("room:join" , data);
    })

    socket.on("user:call", ({ to, offer }) => {
        io.to(to).emit("incoming:call", { from: socket.id, offer });
      });

    socket.on("call:accepted", ({ to, ans }) => {
        io.to(to).emit("call:accepted", { from: socket.id, ans });
      });

      socket.on("peer:nego:needed", ({ to, offer }) => {
        console.log("peer:nego:needed", offer);
        io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
      });
    
      socket.on("peer:nego:done", ({ to, ans }) => {
        console.log("peer:nego:done", ans);
        io.to(to).emit("peer:nego:final", { from: socket.id, ans });
      });

 });
server.listen(4000);





/***********************socket.io */