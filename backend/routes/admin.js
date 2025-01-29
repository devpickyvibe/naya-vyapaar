const express = require("express");
const {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  managePermissions,
  getUser,
} = require("../controllers/adminController");
const router = express.Router();

router.post("/create-user", createUser);
router.get("/all", getUsers);
router.get("/", getUser);
router.put("/:userId", updateUser);
router.delete("/:userId", deleteUser);
router.get("/permission/:id", managePermissions);
module.exports = router;
