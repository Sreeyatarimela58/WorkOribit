import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Employee from "../models/Employee.js";

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

export const registerUser = async (req, res) => {
  try {
    console.log("Register Request Body:", req.body);
    const { email, password, role, employeeId } = req.body;
    if (!email || !password || !role)
      return res.status(400).json({ message: "Missing required fields" });
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hash = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      passwordHash: hash,
      role,
      employeeId: employeeId || null,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: { id: newUser._id, email: newUser.email, role: newUser.role },
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).populate("employeeId");

    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken(user._id);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        employeeId: user.employeeId?._id || null,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("employeeId");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({
      id: user._id,
      email: user.email,
      role: user.role,
      employeeId: user.employeeId || null,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const seedAdmin = async (req, res) => {
  try {
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin)
      return res.status(400).json({ message: "Admin already exists" });

    const passwordHash = await bcrypt.hash("admin123", 10);
    const admin = await User.create({
      email: "admin@peoplehub.com",
      passwordHash,
      role: "admin",
    });

    res.status(201).json({
      message: "Admin account created",
      credentials: {
        email: admin.email,
        password: "admin123",
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};