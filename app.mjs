//==========================
// IMPORTS
//==========================



// NPM IMPORTS
import express from "express";
import dotenv from 'dotenv';
import mongoose, { Schema } from 'mongoose';
import bodyParser from "body-parser";





//==========================
// DEVELOPMENT
//==========================
const app = express();
const PORT = 3000;



//==========================
// CONFIG
//==========================



// Config body-parser and express to parse JSON & form data
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}))

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




app.get("/", (req, res) => {
    res.send("Hellow world!")
})







//==========================
// LISTEN
//==========================
app.listen(PORT, () => {
    console.log("Server listening at port: ", PORT);
})


export default app;