//==========================
// IMPORTS
//==========================



// NPM IMPORTS
import express from "express";
import dotenv from 'dotenv';
import mongoose, { Schema } from 'mongoose';



//==========================
// DEVELOPMENT
//==========================
const app = express();
const PORT = 3000;



//==========================
// CONFIG
//==========================



//dotenv CONFIG
dotenv.config();



// Database connection
const connectDB = async () => {
    try {
        const client = await mongoose.connect(process.env.DB_URL);
        console.log("Successfully connected to the database!")
        
    } catch (error) {
        console.log("Error connecting to database!")
    }
}
connectDB();





// Testing route
app.get('/', (re, res) => {

    res.send("Hello world");
})





//==========================
// LISTEN
//==========================
app.listen(PORT, () => {
    console.log("Server listening at port: ", PORT);
})