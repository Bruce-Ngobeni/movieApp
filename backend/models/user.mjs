import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
    {
    email: { type: String, required: [true, "Email is required"], unique: true, trim: true },
    password: { type: String, required: [true, "Password is required"], minLength: 8 }
    },
    {timestamps: true}
);


export default mongoose.model("User", userSchema);