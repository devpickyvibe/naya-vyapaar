const { DataTypes, UUIDV4 } = require("sequelize");
const sequelize = require("../config/database");

exports.ROLES = {
  Admin: "ADMIN",
  SuperAdmin: "SUPER_ADMIN",
  Manufacturer: "MANUFACTURER",
  Retailer: "RETAILER",
  Buyer: "BUYER",
  Developer: "DEVELOPER",
};

// Define the Role model
const Role = sequelize.define(
  "Role",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    role_name: {
      type: DataTypes.ENUM, // Use ENUM to restrict values
      values: Object.values(exports.ROLES), // Allowed values from the ROLES object
      allowNull: false,
      unique: true, // Ensure the role_name is unique
    },
    admin_granted_users: {
      type: DataTypes.JSON, // Store granted users as a JSON array of user IDs
      defaultValue: [], // Default empty array
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

module.exports = Role;
