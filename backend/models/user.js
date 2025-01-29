const { DataTypes, UUIDV4 } = require("sequelize");
const sequelize = require("../config/database");
const Role = require("./Role"); // Import Role model
const { ROLES } = require("../config/constant");
const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Role,
        key: "id",
      },
      defaultValue: async function () {
        const buyerRole = await Role.findOne({
          where: { role_name: ROLES.Buyer },
        });
        return buyerRole ? buyerRole.id : null;
      },
    },
  },
  {
    timestamps: true,
    hooks: {
      beforeCreate: async (user) => {
        if (!user.role_id) {
          const buyerRole = await Role.findOne({
            where: { role_name: ROLES.Buyer },
          });
          if (buyerRole) user.role_id = buyerRole.id;
        }
      },
    },
  }
);

User.belongsTo(Role, { foreignKey: "role_id", as: "Role" });

module.exports = User;
