const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

// User Registration
exports.register = async (req, res) => {
  try {
    const { email, password, role, additionalFields } = req.body;

    // Check for role-specific fields
    if (role === "manufacturer" && !additionalFields.companyName) {
      return res
        .status(400)
        .json({ message: "Manufacturer must provide a company name." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hashedPassword,
      role,
      ...additionalFields,
    });

    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// User Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Password Recovery
exports.passwordRecovery = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate recovery token (for simplicity, using JWT here)
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    // Here you'd send an email with the recovery link (e.g., /reset-password/:token)
    res.status(200).json({ message: "Password recovery email sent", token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Social Login
exports.socialLogin = async (req, res) => {
  try {
    const { provider, providerId, email, name } = req.body;

    // Check if user exists
    let user = await User.findOne({ where: { email } });

    if (!user) {
      // Register the user if not found
      user = await User.create({
        email,
        name,
        role: "buyer",
        provider,
        providerId,
      });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({ message: "Social login successful", token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
