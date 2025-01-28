const { DataTypes, UUIDV4 } = require("sequelize");
const User = require("./user"); // Assuming you have a User model to reference
const sequelize = require("../config/database");
// Define the Lead model
const Lead = sequelize.define(
  "Lead",
  {
    lead_id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    source: {
      type: DataTypes.STRING,
      allowNull: false, // Where the lead was generated from (e.g., web, referral, etc.)
    },
    user_role: {
      type: DataTypes.STRING,
      allowNull: false, // Role of the user associated with this lead (buyer, manufacturer, etc.)
    },
    lead_status: {
      type: DataTypes.ENUM,
      values: ["new", "contracted", "qualified", "closed"],
      defaultValue: "new", // Default status is "new"
      allowNull: false,
    },
    interaction: {
      type: DataTypes.JSON, // JSON field to store interaction details like date, type, and products
      allowNull: true,
      defaultValue: [],
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id", // Foreign key reference to the User model
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Lead;
