//==========================
// IMPORTS
//==========================



// NPM IMPORTS
import mongoose from "mongoose";
import request from "supertest";
import app from "../../../app.mjs";
import {afterAll, beforeAll, describe, expect, test } from "@jest/globals";
import dotenv from "dotenv";


// DOTENV Configuration
dotenv.config();



//==========================
// DATABASE CONNECTION AND TESTING
//==========================


// Connect Database Before
beforeAll(async () => {
    await mongoose.connect(process.env.DB_URL);
});


// Disconnect Database After
afterAll(async () => {
    await mongoose.connect().close();
});



//==========================
// AUTH REGISTER ROUTE TESTS
//==========================
describe("POST /register _  Auth Register Route Integration Test", () => {

    test("Should register a new user and return a token", async () => {

        const response = await request(app)
            .post("/register")
            .send({ email: "test@example.com", password: "password123" });

        expect(response.status).toEqual(201);
        expect(response.body.email).toEqual("test@example.com");
        expect(response.body).toHaveProperty('token');
        expect(response.body.message).toBe("User successfully created");
    })


    test("Should not register a user with an existing email", async () => {
        await request(app).post("/register").send({ email: "test@example.com", password: "password123" });

        const response = await request(app)
            .post("/register")
            .send({ email: "test@example.com", password: "password123" });

        expect(response.status).toEqual(400);
        expect(response.body).not.toHaveProperty("token");
        expect(response.body.message).toBe("Email already in use");
    })
})


//==========================
// AUTH LOGIN ROUTE TESTS
//==========================
describe("POST /login _ Auth Login Route Intergration Test", () => {

    test("Should log in an existing user and return a token", async () => {

        const response = await request(app)
            .post("/login")
            .send({ email: "test@example.com", password: "password123" })

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("token");
        expect(response.body.message).toBe("Successfully logged in")
    });


    test("Should return an error for non-existing users", async () => {

        const response = await request(app)
            .post("/login")
            .send({ email: "wrongemail@example.com", password: "password123" })

        expect(response.status).toBe(404)
        expect(() => {
            !response.toHaveProperty("token");
        });
        expect(response.body.message).toBe("User not found")
    })


    test("Should return an error for invalid login credentials", async () => {

        const response = await request(app)
            .post("/login")
            .send({ email: "test@example.com", password: "wrongpassword" })

        expect(response.status).toEqual(401);
        expect(response.body.message).toBe("Invalid password");
    })
})