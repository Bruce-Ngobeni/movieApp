import express from "express";
import User from "../models/user.mjs"
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";

const router = express.Router();


router.post("/register", async (req, res, next) => {

    try {
        const { email, password } = req.body;

        // check if email is already in use
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email is already registered" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the new user with hashed password
        const newUser = new User({email, password: hashedPassword});

        // Save user to the database
        await newUser.save();

        // Generate JWT Token
        const token = jwt.sign(
            {id:newUser._id, email: newUser.email},
            process.env.SECRETKEY,
            {expiresIn:"1d"}
        );
    

        return res.status(201).json({
            message: "User successfully created", 
            user: { id: newUser._id, email:newUser.email},
            token
        });


    } catch (error) {
        next(error);
    }

});


router.post("/login", async (req, res, next) => {

    try {
        const {email, password} = req.body;


        // Check if user exist
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Invalid email or password" });
        }

        // Compare hashed password
        const validate = await bcrypt.compare(password, user.password);
        if (!validate) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Generate JWT Token
        const token = jwt.sign(
            {id:user._id, email: user.email},
            process.env.SECRETKEY,
            {expiresIn:"1d"}
        );
        
        return res.status(200).json({
            message: "Successfully logged in",
            user: {id: user._id, email: user.email}, 
            token,
        });

        
    } catch (error) {
        next(error);
        
    }
});




export default router;
