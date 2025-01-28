const express = require("express");
const {
  register,
  login,
  resetPassword,
  logout,
  socialLogin,
} = require("../controllers/authController");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/reset-password", resetPassword);
router.post("/social-login", socialLogin);
router.post("/logout", logout);

module.exports = router;
