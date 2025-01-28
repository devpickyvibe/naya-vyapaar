const { DataTypes, UUIDV4 } = require("sequelize");
const User = require("./user"); // Assuming you have a User model to reference
const sequelize = require("../config/database");
const AccessLog = sequelize.define(
  "AccessLog",
  {
    log_id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id", // Foreign key to the User model
      },
    },
    accessAttemptTime: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    accessType: {
      type: DataTypes.ENUM,
      values: ["read", "write"],
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM,
      values: ["success", "failure"],
      allowNull: false,
    },
    ipAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = AccessLog;
