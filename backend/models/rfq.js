const { DataTypes, UUIDV4 } = require("sequelize");
const User = require("./user"); // Assuming you have a User model to reference
const sequelize = require("../config/database");
// Define the RFQ model
const RFQ = sequelize.define(
  "RFQ",
  {
    rfq_id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    lead_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Leads", // Reference to the Leads table
        key: "lead_id",
      },
    },
    rfq_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    products: {
      type: DataTypes.JSON, // JSON field to store products and quantities
      allowNull: false,
      defaultValue: [],
    },
    buyers_details: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id", // Foreign key reference to the User model (Buyer)
      },
    },
    manufacturer_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: User,
        key: "id", // Foreign key reference to the User model (Manufacturer)
      },
    },
    manufacturerResponse: {
      type: DataTypes.JSON, // JSON field to store manufacturer's response (quotation, terms, lead time, etc.)
      allowNull: true,
      defaultValue: null,
      validate: {
        isJson(value) {
          if (value && typeof value !== "object") {
            throw new Error(
              "manufacturerResponse must be a valid JSON object."
            );
          }
        },
      },
    },
    status: {
      type: DataTypes.ENUM,
      values: ["pending", "quoted", "accepted", "rejected"],
      defaultValue: "pending", // Default status is "pending"
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = RFQ;
