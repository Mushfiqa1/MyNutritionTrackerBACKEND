import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import NutritionEntry from "../models/nutritionEntry.model.js";

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// -------------------------------------------------------------
// @desc    Register new user
// @route   POST /api/users/register
// @access  Public
// -------------------------------------------------------------
export const registerUser = async (req, res) => {
  console.log("REGISTER BODY:", req.body);

  try {
    const {
      firstName,
      lastName,
      email,
      password,
      age,
      height,
      weight,
    } = req.body;

    // Merge names into one string
    const name = `${firstName} ${lastName}`.trim();

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      age,
      height,
      weight,
    });

    // Respond
    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
};

// -------------------------------------------------------------
// @desc    Login user
// @route   POST /api/users/login
// @access  Public
// -------------------------------------------------------------
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
};

// -------------------------------------------------------------
// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
// -------------------------------------------------------------
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(user);
  } catch (error) {
    console.error("PROFILE ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
};
