import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";

/**
 * @desc    Auth user & get token
 * @route   POST /api/users/login
 * @access  Public
 */

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id)
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

/**
 * @desc    Get user profile
 * @route   GET /api/users/profile
 * @access  Private
 */

const getUserProfile = asyncHandler(async (req, res) => {
  // const user = await User.findById(req.user._id);
  const user = await User.findById(req.params.id);

  console.log("User ID:", req.params.id);

  if (user) {
    if (req.user.isAdmin || req.user._id.toString() === user._id.toString()) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin
      });
    } else {
      res.status(403);
      throw new Error("Not authorized to access this profile");
    }
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

/**
 * @desc    Register a new user
 * @route   POST /api/users
 * @access  Public
 */

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone, isAdmin } = req.body;
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({ name, email, password, phone, isAdmin });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      isAdmin: user.isAdmin,
      token: generateToken(user._id)
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

/**
 * @desc    Update user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  console.log("Request Payload:", req.body);
  console.log("User ID:", req.user._id);

  if (user) {
    // If the user exists, we want to update the name and email
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;

    // If the password is being modified, we want to hash the new password
    if (req.body.password) {
      user.password = req.body.password;
    }

    // Save the updated user
    const updatedUser = await user.save();

    // Send back the updated user information
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      isAdmin: updatedUser.isAdmin,

      // Generate a new token with the updated user information
      token: generateToken(updatedUser._id)
    });
    console.log("Updated User Phone in Controller", updatedUser.phone);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

/**
 * @desc    Get all users
 * @route   GET /api/users
 * @access  Private/Admin
 */

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select("-password");
  res.json(users);
});

/* @desc    Delete user
 * @route   DELETE /api/users/:id
 * @access  Private/Admin
 */

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await User.deleteOne(user); // Remove the user from the database
    res.json({ message: "User deleted" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

/* @desc    Get user by ID
 * @route   GET /api/users/:id
 * @access  Private/Admin
 */

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password"); // Exclude the password from the user object

  console.log(user);

  if (user) {
    // If the user exists, we want to update the name and email
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

/**
 * @desc    Update a user
 * @route   PUT /api/users/:id
 * @access  Private/Admin
 */

const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    // If the user exists, we want to update the name and email
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    user.isAdmin = req.body.isAdmin; // We don't need to check if the isAdmin property exists because it will always exist

    // Save the updated user
    const updatedUser = await user.save();

    console.log("Updated User", updatedUser);

    // Send back the updated user information
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      isAdmin: updatedUser.isAdmin
    });
    console.log("Updated User Phone in Controller", updatedUser.phone);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export {
  authUser,
  getUserProfile,
  registerUser,
  updateUserProfile,
  getUsers,
  deleteUser,
  updateUser,
  getUserById
};
