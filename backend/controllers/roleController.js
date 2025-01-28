const Role = require("../models/Role");
const User = require("../models/user");
const { Op } = require("sequelize");

// Assign a role to a user
const assignRole = async (req, res) => {
  const { userId, roleName } = req.body;

  try {
    // Find user and role
    const user = await User.findByPk(userId);
    const role = await Role.findOne({ where: { role_name: roleName } });

    if (!user || !role) {
      return res.status(404).json({ message: "User or Role not found" });
    }

    // Add role to user
    await user.addRole(role); // Add the role to the user through the junction table

    res.status(200).json({ message: "Role assigned successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update a role (i.e., modify role_name or other attributes)
const updateRole = async (req, res) => {
  const { roleId, newRoleName } = req.body;

  try {
    const role = await Role.findByPk(roleId);

    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    // Update role name or any other attributes
    role.role_name = newRoleName;

    await role.save();
    res.status(200).json({ message: "Role updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get roles assigned to a user
const getUserRoles = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findByPk(userId, {
      include: Role, // Include the roles associated with the user
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const roles = user.Roles.map((role) => role.role_name);

    res.status(200).json({ roles });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Seed admin roles directly in the backend (useful for initial setup)
const seedAdminRoles = async (req, res) => {
  try {
    // Create predefined admin roles if they don't exist
    const existingRoles = await Role.findAll();

    if (existingRoles.length === 0) {
      const roles = [
        { role_name: "Admin" },
        { role_name: "Manufacturer" },
        { role_name: "Buyer" },
      ];

      // Add roles to the database
      await Role.bulkCreate(roles);
      res.status(200).json({ message: "Admin roles seeded successfully" });
    } else {
      res.status(400).json({ message: "Roles already exist" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  assignRole,
  updateRole,
  getUserRoles,
  seedAdminRoles,
};
