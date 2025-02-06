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

    try {
        const {email, password} = req.body;


        // Check if user exist
        const user = await User.findOne({ email });
        if (!user) {
            const error = new Error("User not found");
            error.status = 404;
            return next(error)
        }

        // Compare hashed password
        const validate = await bcrypt.compare(password, user.password);
        if (!validate) {
            const error = new Error("Wrong password");
            error.status = 401;
            return next(error);
        }


        return res.status(200).json({ user, message: "Successfully logged in" })

        
    } catch (error) {
        next(error);
        
    }
});




export default router;
