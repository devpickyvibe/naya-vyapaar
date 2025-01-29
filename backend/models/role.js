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
      type: DataTypes.ENUM(...Object.values(exports.ROLES)), // Correct ENUM definition
      allowNull: false,
      unique: true,
    },
    admin_granted_users: {
      type: DataTypes.TEXT, // Store as JSON string
      allowNull: true,
      defaultValue: "[]", // Default empty array as string
      get() {
        const value = this.getDataValue("admin_granted_users");
        return value ? JSON.parse(value) : [];
      },
      set(value) {
        this.setDataValue("admin_granted_users", JSON.stringify(value || []));
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Role;
