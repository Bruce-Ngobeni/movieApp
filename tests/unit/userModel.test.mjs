import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import User from "../../backend/models/user.mjs"
import { afterAll, beforeAll, describe, expect, test } from "@jest/globals";


let mongoServer;


beforeAll( async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
})


afterAll( async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
})


describe("User Model Tests", () => {

    test("Should create a user sucessfully", async () => {
        const user = await User.create({
            email: "test@example.com",
            password: "password123"
        });

        expect(user._id).toBeDefined();
        expect(user.email).toBe("test@example.com");
        expect(user.password).toBe("password123");
        expect(user.createdAt).toBeDefined();
        expect(user.updatedAt).toBeDefined();
    })


    test("Should not create a user without an email", async () => {

        try {
            await User.create({password: "password123"});

        } catch(error) {
            expect(error).toBeDefined();
            expect(error.errors.email.message).toBe("Email is required")
        }
    });


    test("Should not create a user without a password", async () => {

        try {
            await User.create({email: "test@example.com"});
        } catch (error) {
            expect(error).toBeDefined();
            expect(error.errors.message).toBe("Password is required")
        }
    })


    test("Should enforce unique email constraint", async () => {
        await User.create({email: "unique@example.com", password: "password123"});

        try {
            await User.create({email: "unique@example.com", password: "password123"});
        } catch (error) {
            expect(error).toBeDefined();
            expect(error.code).toBe(11000);
        }
    })
})