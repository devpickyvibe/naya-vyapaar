const express = require("express");
const {
  assignRole,
  updateRole,
  getUserRoles,
} = require("../controllers/roleController");
const router = express.Router();

router.put("/update", updateRole);
router.post("/assign", assignRole);
router.get("/", getUserRoles);

module.exports = router;
