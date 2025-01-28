const { DataTypes, UUIDV4 } = require("sequelize");
const User = require("./user"); // Assuming you have a User model to reference
const sequelize = require("../config/database");
// Define the Product model
const Product = sequelize.define(
  "Product",
  {
    product_id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT, // Can also be DECIMAL, depending on your needs
      defaultValue: 0.0, // Default to 0 if not provided
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    images: {
      type: DataTypes.JSON, // JSON array to store image URLs or paths
      allowNull: true, // Can be null if no images are provided
      defaultValue: [],
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true, // Description can be optional
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

module.exports = Product;
