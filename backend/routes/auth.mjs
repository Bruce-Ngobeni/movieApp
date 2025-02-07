import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import User from "../models/user.mjs";
import bcrypt from "bcryptjs";

const router = express.Router();


router.get("/", (req, res) => {
    console.log("Hello world");
    res.send("Hello world");
});



// Register route
router.post("/register", (req, res, next) => {

    passport.authenticate("register", {session:false}, async (err, user, info) => {

        if(err || !user) {
            return res.status(400).json({message: info?.message || "Registration failed"});
        }

        // Generate JWT Token
        const token = jwt.sign({id:user._id, email: user.email}, process.env.JWT_SECRET, {expiresIn: "1d"});


        res.status(201).json({message: "User successfully created", user: { id: user._id, email: user.email }, token});

    })(req, res, next);
    
});


// Login Route for Sessions
router.post("/login", (req, res, next) => {

    passport.authenticate("login", (err, user, info) => {

        if(err || !user){
            return res.status(401).json({message: info?.message || "Invalid credentials "});
        }

        req.login(user, {session: true }, (err) => {
            if (err) return res.status(500).json({message: "Login error", error:err});

            const token = jwt.sign({id: user._id, email: user.email}, process.env.JWT_SECRET, {expiresIn: "1d"});

            res.status(200).json({message: "Successfully logged in", user: {id:req.user._id, email:req.user.email}});
        })
    })(req, res, next);
    
});


// JWT Token Login for API Authentication
router.post("/jwt-login", async (req, res) => {
    try {

        const {email, password} = req.body;
        const user = await User.findOne({email});

        const isValid = await bcrypt.compare(password, user.password);

        if(!user || !isValid) {
            return res.status(401).json({message: "Invalid credentials"})
        }

        const token = jwt.sign({id:user._id, email:user.email}, process.env.JWT_SECRET, {expiresIn: "1d"});
        res.status(200).json({message: "JWT login successful", token })
        
    } catch (error) {
        res.status(500).json({message: "Server error", error});
        
    }
});


//Logout route
router.get("/logout", (req, res, next) => {
    req.logout( (err) => {
        if(err){
            return next(err);
        };
        res.status(200).json({message: "Logged you out Successfully"});
    })
})




export default router;
