const express = require("express");
const {
  searchProducts,
  getProductDetails,
  addProduct,
  editProduct,
  deleteProduct,
  viewProduct,
  addToCart,
  requestProductDetails,
} = require("../controllers/productController");
const router = express.Router();
router.get("/search?category", searchProducts);
router.get("/:id", getProductDetails);
router.post("/add", addProduct);
router.put("/:id", editProduct);
router.delete("/:id", deleteProduct);
router.get("/:id", viewProduct);
router.post("/add-to-cart", addToCart);
router.get("/request/:id", requestProductDetails);
module.exports = router;
