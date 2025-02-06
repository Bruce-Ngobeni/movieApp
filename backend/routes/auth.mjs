import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import User from "../models/user.mjs";
import bcrypt from "bcryptjs";

const router = express.Router();


// Register route
router.post("/register", passport.authenticate("register", {session:false}), (req, res) => {
    const user = req.user;
    const token = req.authInfo.token;
    res.status(201).json({message: "User successfully created", user, token});
});


// Login Route for Sessions
router.post("/login", passport.authenticate('login', {failureRedirect: "/auth/login-failure"}), (req, res) => {
    res.status(200).json({message: "Successfully logged in", user: req.user});
});


// JWT Token Login for API Authentication
router.post("/jwt-login", async (re, res) => {
    try {

        const {email, password} = req.body;
        const user = await User.findOne({email});

        if(!user || !(bcrypt.compare(password, user.password))) {
            return res.status(401).json({message: "Invalid credentials"})
        }

        const token = jwt.sign({id:user._id, email:user.email}, process.env.JWT_SECRET, {expiresIn: "1d"});
        res.status(200).json({message: "JWT login successful", token })
        
    } catch (error) {
        res.status(500).json({message: "Server error", error});
        
    }
});




export default router;
