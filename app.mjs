//==========================
// IMPORTS & CONFIGURATIONS
//==========================


// Load environment variables
import dotenv from 'dotenv';
dotenv.config();


// NPM Modules
import express from "express";
import mongoose from 'mongoose';
import bodyParser from "body-parser";
import passport from "passport";
import session from "express-session";
import MongoStore from "connect-mongo";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import https from "https";
import fs from "fs";


// Middleware Imports
import errorhandle from "./backend/middleware/errorHandle.mjs";
import "./backend/middleware/passport-config.mjs";


// Route Imports
import authRoutes from "./backend/routes/auth.mjs";


//==========================
// APP SETUP
//==========================
const app = express();
const PORT = process.env.PORT || 3000;


//==========================
// SECURITY MIDDLEWARE
//==========================

// Protect HTTP headers
app.use(helmet());


// CORS Configuration
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["content-Type", "Authorization"],
    credentials: true
}))


// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: "Too many requests from this IP, please try again later.",
    standardHeaders: true,
    legacyHeaders: false
});

app.use(limiter);


//==========================
// SESSIONS & AUTHENTICATION
//==========================


// Session Middleware
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
        cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 }  // Set secure after implementing HTTPS ----------
    })
)


// Passport Authentication
app.use(passport.initialize());
app.use(passport.session());


//==========================
// MIDDLEWARES
//==========================


// Body Parsing
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }))


// Error Handling Middleware
app.use(errorhandle);


//==========================
// ROUTE HANDLING
//==========================
app.use("/", authRoutes);


//==========================
// DATABASE CONNECTION
//==========================
const connectDB = async () => {
    try {
        const client = await mongoose.connect(process.env.DB_URL);
        console.log("Successfully connected to the database!")

    } catch (error) {
        console.log("Error connecting to database!")
        console.log(error);
    }
}
connectDB();


// HTTPS options
const options = {
    key: fs.readFileSync("server.key"),
    cert: fs.readFileSync("server.cert"),
};


//==========================
// SERVER START
//==========================
// app.listen(PORT, () => {
//     console.log("Server listening at port: ", PORT);
// })
https.createServer(options, app).listen(PORT, () => {
    console.log("Secure server running on https://localhost:3000")
})


export default app;