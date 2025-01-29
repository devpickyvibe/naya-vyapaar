const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

const User = require("../models/user");
const Role = require("../models/Role");
const nodemailer = require("nodemailer"); // For password reset emails
const { validationResult } = require("express-validator");
const { ROLES } = require("../config/constant");
// Secret for JWT (should be stored in .env in a real app)
const JWT_SECRET = "your-secret-key";

// Login
const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({
      where: { username },
      include: {
        model: Role,
        as: "Role", // Ensure this matches the alias used in the User model association
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { userId: user.id, role: user.Role.role_name }, // Use role_name from Role model
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      user: {
        name: user.name,
        username: user.username,
        role: user.Role.role_name, // Correct access to role_name
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const register = async (req, res) => {
  const { name, username, email, password } = req.body; // No role in request

  try {
    // Set default role as BUYER (if no role is provided)
    const userRole = await Role.findOne({ where: { role_name: ROLES.Buyer } });

    if (!userRole) {
      return res.status(500).json({ message: "Default role not found" });
    }

    // Check if username or email already exists
    const existingUser = await User.findOne({
      where: { [Op.or]: [{ username }, { email }] },
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or email already in use" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with default BUYER role
    const newUser = await User.create({
      name,
      username,
      email,
      password: hashedPassword,
      role_id: userRole.id, // Assign default role
    });

    // Generate JWT Token
    const token = jwt.sign(
      { userId: newUser.id, role: userRole.role_name }, // Use role_name
      process.env.JWT_SECRET, // Use secret from environment
      {
        expiresIn: "1h",
      }
    );

    // Send response with token and user info
    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        username: newUser.username,
        role: userRole.role_name,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a reset token (could be JWT or random string)
    const resetToken = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "15m",
    });

    // Send reset link via email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "your-email@gmail.com",
        pass: "your-email-password",
      },
    });

    const resetLink = `http://your-frontend-url.com/reset-password/${resetToken}`;

    await transporter.sendMail({
      to: user.email,
      subject: "Password Reset",
      text: `Click the following link to reset your password: ${resetLink}`,
    });

    res.json({ message: "Password reset link sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Social Login (Assuming we use OAuth)
const socialLogin = async (req, res) => {
  const { socialId, provider } = req.body;

  try {
    // Assuming we fetch user from social provider
    const user = await User.findOne({ where: { socialId, provider } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.Role.name },
      JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.json({
      token,
      user: { name: user.name, username: user.username, role: user.Role.name },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Logout (Simply delete token on client side)
const logout = (req, res) => {
  res.json({ message: "Logged out successfully" });
};

module.exports = {
  login,
  register,
  resetPassword,
  socialLogin,
  logout,
};
