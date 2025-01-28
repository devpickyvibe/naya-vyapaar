const { DataTypes, UUIDV4 } = require("sequelize");
const sequelize = require("../config/database");
const Permission = sequelize.define(
  "Permission",
  {
    permission_id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    role_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Roles", // Reference to the Role model
        key: "id",
      },
    },
    permission_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Permission;
