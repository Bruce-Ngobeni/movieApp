import { Router as router } from "express";
import User from "../models/user.mjs"
import bcrypt from 'bcryptjs';


router.post("/register", async (req, res, next) => {

    try {
        const { email, password } = req.body;

        // check if email is already in use
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            const error = new Error("Email already in use");
            error.status = 400;
            return next(error);
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        // Create the new user with hashed password
        const newUser = new User({email, password: hashedPassword});

        // Save user to the database
        await newUser.save();

        return res.status(201).json({message: "User successfully created", user: newUser});


    } catch (error) {
        next(error);
    }

});


router.post("/login", async (req, res, next) => {

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    if (user.password != req.res.password) {
        return res.status(401).json({ message: "Wrong password" });
    }

    res.status(200).json({ user, message: "Successfully logged in" })
})




export default router;
