import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = express.Router();


// Register route
router.post("/register", passport.authenticate("register", {session:false}), (req, res) => {
    const user = req.user;
    const token = req.authInfo.token;
    res.status(201).json({message: "User successfully created", user, token});
});


// Login route
router.post("/login", passport.authenticate('login', {session: false}), (req, res) => {
    const user = req.user;
    const token = req.authInfo.token;
    res.status(200).json({message: "Successfully logged in", user, token});
});




export default router;
