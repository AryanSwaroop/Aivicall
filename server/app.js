require('dotenv').config();
const express = require('express');
const passport = require('passport');
const cors = require('cors');
const session = require('express-session');
const http = require('http');
const socketIO = require('socket.io');
const authRoute = require('./Routes/AuthServiceRoutes');
const AIServiceRoutes = require('./Routes/AIServiceRoutes');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const AIService = require('./services/AIService');
const AuthService = require('./services/AuthService');
const SocketService = require('./services/SocketService');
const MeetRoute = require('./Routes/MeetingRoute');
const API_ENDPOINTS = require('./API/endpoints');
const registerRoute = require('./Routes/AuthManualRoute');
const db = require('./DB/db');
const cookieParser = require('cookie-parser');


const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: API_ENDPOINTS.FRONT_URL
    }
});

const genAI = new GoogleGenerativeAI(process.env.gemini_api_key);
const aiService = new AIService(genAI);
const authService = new AuthService();
const socketService = new SocketService(io);

// Middleware setup
app.use(express.json());
app.use(session({
    secret: 'somethingsecretgoeshere',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));

app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(cors({
    origin: API_ENDPOINTS.FRONT_URL,
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
    SameSite: "none"
}));

// Routes
app.use("/auth", authRoute);
app.use("/ai", AIServiceRoutes);
app.use("/meet", MeetRoute);
app.use("/manual", registerRoute);

// Socket.io setup
socketService.setup();

// Database Setup
const database = new db();
database.connect();

// Server setup
server.listen(5000, () => {
    console.log("Server is running on port 5000");
});
