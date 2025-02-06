//==========================
// IMPORTS
//==========================


//==========================
// NPM IMPORTS
//==========================
import express from "express";
import dotenv from 'dotenv';
import mongoose, { Schema } from 'mongoose';
import bodyParser from "body-parser";
import passport from "passport";
import session from "express-session";
import MongoStore from "connect-mongo";


//==========================
// DEVELOPMENT
//==========================
const app = express();
const PORT = 3000;


//==========================
// Middleware IMPORTS
//==========================

// errorhandling
import errorhandle from "./backend/middleware/errorHandle.mjs";

//passport strategies
import "./backend/middleware/passport-config.mjs";

//dotenv CONFIG
dotenv.config();


// Session middleware for web authentication
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        store: MongoStore.create({mongoUrl: process.env.DB_URL}),
        cookie: {secure: false, maxAge: 1000 * 60 * 60 * 24 }  // Set secure after implementing HTTPS ----------
    })
)



//initialize passport
app.use(passport.initialize());
app.use(passport.session());


// Models IMPORTS



//==========================
// ROUTES IMPORTS
//==========================
import authRoutes from "./backend/routes/auth.mjs";



//==========================
// CONFIG
//==========================


// Config body-parser and express to parse JSON & form data
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }))



//==========================
// ROUTES Configuration
//==========================

app.use("/", authRoutes);



//==========================
// Middlewares Configuration
//==========================

// Error Handling Middleware config
app.use(errorhandle);



//==========================
// DATABASE CONNECTION
//==========================


// Connect to database
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



//==========================
// LISTEN
//==========================
app.listen(PORT, () => {
    console.log("Server listening at port: ", PORT);
})


export default app;