const { DataTypes, UUIDV4 } = require("sequelize");
const User = require("./user"); // Assuming you have a User model to reference
const Permission = require("./permission"); // Assuming you have a Permission model
const sequelize = require("../config/database");
const Admin = sequelize.define(
  "Admin",
  {
    admin_id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM,
      values: ["Admin", "SuperAdmin"],
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id", // Foreign key to the User model
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Admin;
