import { Router as router } from "express";
import User from "../models/user.mjs"


router.post("/register", async (req, res, next) => {

    const { email, password } = req.body;

    const existingUser = await User.findOne({email});
    if(existingUser){
        return res.status(400).json({message: "Email already in use"})
    }


    const newUser = new User({email, password});
    await newUser.save();

    return res.status(201).json({message: "User successfully created", user: newUser})


});


router.post("/login", async (req, res, next) => {

    const user = await User.findOne({email: req.body.email});

    if(!user){
        return res.status(404).json({message: "User not found"});
    }

    if(user.password != req.res.password){
        return res.status(401).json({message: "Wrong password"});
    }

    res.status(200).json({user, message: "Successfully logged in"})
})
