const bcrypt = require("bcryptjs");
const User = require("../models/user"); // Import User, Role, and Admin models
const Role = require("../models/Role");
const Admin = require("../models/admin");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Find the "ADMIN" role (assuming the role already exists in the database)
      const adminRole = await Role.findOne({
        where: { role_name: "ADMIN" }, // Ensure that the "ADMIN" role exists
      });

      if (!adminRole) {
        throw new Error("Admin role not found");
      }

      // Hash the password before saving it to the database
      const hashedPassword = await bcrypt.hash("ADMIN_NAYAVYAPAAR2025", 10);

      // Create the admin user
      const user = await User.create({
        email: "admin.nayavyapaar@gmail.com",
        username: "nayavyapaar_admin",
        name: "nayavyapaar_admin", // Add username field here
        password: hashedPassword, // Store the hashed password
        role_id: adminRole.id, // Assign the role to the user
      });

      // Now, create the Admin entry associated with this User
      await Admin.create({
        role: "Admin",
        userId: user.id, // Link to the newly created user
      });

      console.log("Admin user and admin record created successfully!");
    } catch (error) {
      console.error("Error creating admin user:", error);
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      // Optionally delete the user and admin entry if you need to roll back the seeder
      const user = await User.findOne({
        where: { email: "admin.nayavyapaar@gmail.com" },
      });

      if (user) {
        // Delete associated Admin record first to avoid foreign key constraints
        await Admin.destroy({
          where: { userId: user.id },
        });

        // Then, delete the user
        await User.destroy({
          where: { email: "admin.nayavyapaar@gmail.com" },
        });
      }

      console.log("Admin user and admin record deleted successfully!");
    } catch (error) {
      console.error("Error deleting admin user:", error);
    }
  },
};
