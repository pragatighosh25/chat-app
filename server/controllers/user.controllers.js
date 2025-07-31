import User from "../models/user.models";
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
    
    await newUser.save();
    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}