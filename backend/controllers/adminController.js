const User = require("../models/user");
const Admin = require("../models/admin");
const Permission = require("../models/permission");
const Role = require("../models/Role"); // Import Role model
const { ROLES } = require("../config/constant");

// Get all users (Admin only)
const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      include: {
        model: Role,
        as: "Role", // Ensure the alias matches the one defined in the User model association
      },
    }); // Fetch all users along with their associated role
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching users" });
  }
};
// Get a single user by ID (Admin only)
const getUser = async (req, res) => {
  try {
    const { userId } = req.params; // Get the userId from the request parameters

    // Find the user by primary key (userId) and include the associated Role
    const user = await User.findByPk(userId, {
      include: {
        model: Role,
        as: "Role", // Ensure the alias matches the one defined in the User model association
        attributes: ["role_name"], // Specify the fields you want from the Role model
      },
    });

    // If no user found, return a 404 message
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Respond with the user and their role information
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching user" });
  }
};

// Create a new user (Admin only)
const createUser = async (req, res) => {
  try {
    const { email, password, name, role_name, username } = req.body;

    // Find role by name (assumes role_name is sent in the request)
    const role = await Role.findOne({
      where: { role_name },
    });

    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    const newUser = await User.create({
      email,
      password, // Ensure password hashing is applied
      name,
      username,
      role_id: role.id, // Set the correct role_id
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating user" });
  }
};

// Update user details (Admin only)
const updateUser = async (req, res) => {
  try {
    const { userId } = req.params; // Assuming userId is still coming from request params
    const { email, name, role_name } = req.body;

    // Find the user by user.id
    const user = await User.findOne({
      where: { id: userId },
      include: {
        model: Role,
        as: "Role",
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the role if provided
    let role_id = user.role_id;
    if (role_name) {
      const role = await Role.findOne({ where: { role_name } });
      if (!role) {
        return res.status(404).json({ message: "Role not found" });
      }
      role_id = role.id;
    }

    await user.update({
      email,
      name,
      role_id,
    });

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating user" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the user by user.id
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.destroy();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting user" });
  }
};

// Manage permissions (Admin only)
const managePermissions = async (req, res) => {
  try {
    const { adminId, permissions } = req.body; // `permissions` should be an array of permission IDs

    const admin = await Admin.findByPk(adminId, {
      include: [Permission],
    });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    await admin.setPermissions(permissions); // Updates the permissions for this admin
    res.status(200).json({ message: "Permissions updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error managing permissions" });
  }
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  managePermissions,
};
