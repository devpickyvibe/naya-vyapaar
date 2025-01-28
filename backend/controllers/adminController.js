const User = require("../models/user");
const Admin = require("../models/admin");
const Permission = require("../models/permission");
const AdminController = {
  // Get all users (Admin only)
  async getUsers(req, res) {
    try {
      const users = await User.findAll(); // Fetch all users
      res.status(200).json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching users" });
    }
  },

  // Create a new user (Admin only)
  async createUser(req, res) {
    try {
      const { email, password, name, role } = req.body;

      const newUser = await User.create({
        email,
        password, // Ensure password hashing is applied
        name,
        role,
      });

      res.status(201).json(newUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error creating user" });
    }
  },

  // Update user details (Admin only)
  async updateUser(req, res) {
    try {
      const { userId } = req.params;
      const { email, name, role } = req.body;

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      await user.update({ email, name, role });
      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error updating user" });
    }
  },

  // Delete user (Admin only)
  async deleteUser(req, res) {
    try {
      const { userId } = req.params;

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      await user.destroy();
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error deleting user" });
    }
  },

  // Manage permissions (Admin only)
  async managePermissions(req, res) {
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
  },
};

module.exports = AdminController;
