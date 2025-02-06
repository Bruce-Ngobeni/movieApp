import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JWTstrategy } from "passport-jwt";
import { ExtractJwt } from "passport-jwt";
import passport from "passport";
import bcrypt from "bcryptjs";
import User from "../models/user.mjs";
import user from "../models/user.mjs";


// Register strategy

passport.use(
    'register',
    new LocalStrategy(
        {
            usernameField: "email",
        },
        async (email, password, done) => {
            try {

                // check if email is already in use
                const existingUser = await User.findOne({ email });
                if (existingUser) {
                    return done(null, false, { message: "Email is already registered" });
                }

                // Hash the password
                const hashedPassword = await bcrypt.hash(password, 10);

                // Create the new user with hashed password
                const newUser = await User.create({ email, password: hashedPassword });

                // Save user to the database
                await newUser.save();

                // Generate JWT Token
                const token = jwt.sign(
                    { id: newUser._id, email: newUser.email },
                    process.env.SECRETKEY,
                    { expiresIn: "1d" }
                );

                // Pass user and token to the done callback
                return done(null, newUser, { message: "User successfully created", token });

            } catch (error) {
                return done(error);
            }
        }
    )
);


//login strategy
passport.use(
    "login",
    new LocalStrategy(
        {
            usernameField: "email",
        },

        async (email, password, done) => {

            try {

                // Check if user exist
                const user = await User.findOne({ email });
                if (!user) {
                    return done(null, false, { message: "Invalid email or password" });
                }

                // Compare hashed password
                const validate = await bcrypt.compare(password, user.password);
                if (!validate) {
                    return done(null, false, { message: "Invalid email or password" });
                }

                // Authentication successful
                return done(null, user);

            } catch (error) {
                return done(error);
            }
        }
    )
);


//jwt strategy
passport.use(
    new JWTstrategy(
        {
            secretOrKey: process.env.JWT_SECRET,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        },
        async(token,done) => {
            try {
                return done(null, token.user);
                
            } catch (error) {
                return done(error)
            }
        }
    )
);


// Serialize and Deserialize user (for session management)
passport.serializeUser((user, done => {
    done(null, user.id);
}));


passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
        
    } catch (error) {
        done(error);
    }
});