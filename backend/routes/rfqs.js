const express = require("express");
const {
  searchRFQs,
  getRFQDetails,
  createRFQ,
  editRFQ,
  manageLeads,
  viewRFQ,
  submitQuotation,
  updateQuotation,
  manageRFQs,
} = require("../controllers/rfqController");
const router = express.Router();

router.get("/search?term", searchRFQs);
router.get("/:id", getRFQDetails);
router.post("/create", createRFQ);
router.put("/:id", editRFQ);
router.get("/leads", manageLeads);
router.get("/:id", viewRFQ);
router.post("/submit-quotaiton", submitQuotation);
router.put("/:id", updateQuotation);
router.get("/", manageRFQs);

module.exports = router;
