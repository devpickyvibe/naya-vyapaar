const express = require("express");
const {
  register,
  login,
  passwordRecovery,
  socialLogin,
} = require("../controllers/authController");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/password-recovery", passwordRecovery);
router.post("/social-login", socialLogin);

module.exports = router;
