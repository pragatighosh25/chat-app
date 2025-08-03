import { generateToken } from "../lib/utils.js";
import User from "../models/user.models.js";
import bcrypt from "bcryptjs";

//signup a new user
export const signup = async (req, res) => {
  const { email, fullName, password, bio } = req.body;

  try {
    // Validate input
    if(!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    //encrypt password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new User.create({
      email,
      fullName,
      password: hashedPassword,
      bio
    });
    const token = generateToken(newUser._id);

    await newUser.save();
    return res.json({ success: true, token, userData: newUser, message: "User created successfully" });
  } catch (error) {
    console.error("Error during signup:", error.message);
    return res.json({ success: false, message: "Internal server error" });
  }
}

//login a user
export const login = async (req, res) => {
  try {
    //get user data from request body
    const { email, password } = req.body;
    const userData = await User.findOne({ email });

    if (!userData) {
      return res.json({ success: false, message: "Invalid email or password" });
    }

  // Check if password is correct
  const isPasswordCorrect = await bcrypt.compare(password, userData.password);
  if (!isPasswordCorrect) {
    return res.json({ success: false, message: "Invalid email or password" });
  }
  // Generate token and respond
  const token = generateToken(userData._id);

  //return user data and token
  return res.json({ success: true, token, userData, message: "Login successful" });
  } catch (error) {
  console.error("Error during login:", error.message);
  return res.json({ success: false, message: "Internal server error" });
 }
}

//