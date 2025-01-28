const { DataTypes } = require("sequelize");
const db = require("../config/database");

const User = db.define("User", {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true, // Nullable for social logins
  },
  role: {
    type: DataTypes.ENUM(
      "buyer",
      "manufacturer",
      "admin",
      "admin_granted_users"
    ),
    allowNull: false,
  },
  provider: {
    type: DataTypes.STRING,
    allowNull: true, // For social logins
  },
  providerId: {
    type: DataTypes.STRING,
    allowNull: true, // For social logins
  },
  companyName: {
    type: DataTypes.STRING,
    allowNull: true, // Manufacturer-specific field
  },
});

module.exports = User;
