const request = require("supertest");
const app = require("../server.js");
const User = require("../models/userModel.js");
const connectDB = require("../config/db.js");
const dotenv = require("dotenv");

dotenv.config();

connectDB();

// Mock user data
const user = {
  name: "Test User",
  email: "test@example.com",
  password: "password123",
  phone: "1234567890"
};

beforeEach(async () => {
  // Before each test, clear the database and create a new user
  await User.deleteMany();
  await new User(user).save();
});

test("should update user profile", async () => {
  // First, authenticate the user to get the token
  const res = await request(app)
    .post("/api/users/login")
    .send({ email: user.email, password: user.password });

  const token = res.body.token;

  // Then, use the token to make a request to the update profile route
  const updatedUser = await request(app)
    .put("/api/users/profile")
    .set("Authorization", `Bearer ${token}`)
    .send({ name: "Updated Name", email: "updated@example.com" });

  // Check that the response status is 200 (OK)
  expect(updatedUser.status).toBe(200);

  // Check that the user's name and email have been updated
  expect(updatedUser.body.name).toBe("Updated Name");
  expect(updatedUser.body.email).toBe("updated@example.com");
});
