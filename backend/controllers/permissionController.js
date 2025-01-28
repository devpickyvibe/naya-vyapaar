// AccessControlController.js
const Permission = require("../models/permission");
const User = require("../models/user");
const AccessControlController = {
  // Check if a user has the necessary permission
  async checkPermission(req, res, next) {
    try {
      const { user_id, permission_name } = req.body;

      // Get the user's role (this should be part of user data)
      const user = await User.findByPk(user_id);
      if (!user) return res.status(404).json({ message: "User not found" });

      const rolePermissions = await Permission.findAll({
        where: { role_id: user.role_id, permission_name },
      });

      if (rolePermissions.length === 0) {
        return res.status(403).json({ message: "Access denied" });
      }

      next(); // User has permission, continue to the next middleware
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error checking permission" });
    }
  },

  // Restrict access based on user permissions
  restrictAccess(req, res, next) {
    // Check if the user has access here (using checkPermission logic)
    AccessControlController.checkPermission(req, res, next);
  },

  // Log failed access attempts
  async logFailedAccess(req, res) {
    try {
      const { user_id, action, reason } = req.body;
      // You can store the log in a "FailedAccessLogs" model or similar
      console.log(
        `Failed access attempt by user ${user_id} for action: ${action}, reason: ${reason}`
      );
      return res.status(403).json({ message: "Access denied" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error logging failed access" });
    }
  },
};

// SessionController.js
const jwt = require("jsonwebtoken");
const { User } = require("../models");

const SessionController = {
  // Create session (JWT token generation)
  createSession(req, res) {
    const { user_id, password } = req.body;

    // Authenticate user (simplified example, use proper validation)
    User.findOne({ where: { id: user_id, password } })
      .then((user) => {
        if (!user) {
          return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ user_id: user.id }, process.env.JWT_SECRET, {
          expiresIn: "1h", // Example expiration time
        });

        res.status(200).json({ token });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ message: "Error creating session" });
      });
  },

  // End session (invalidate JWT or session ID)
  endSession(req, res) {
    // Invalidate the token (by removing it on the client side)
    res.status(200).json({ message: "Session ended" });
  },

  // Validate session (check if the provided JWT token is valid)
  validateSession(req, res, next) {
    const token = req.headers["authorization"];
    if (!token) return res.status(401).json({ message: "No token provided" });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid token" });
      }

      req.user_id = decoded.user_id; // Attach user info to the request object
      next(); // Token is valid, proceed with the next middleware
    });
  },
};

module.exports = { AccessControlController, SessionController };
