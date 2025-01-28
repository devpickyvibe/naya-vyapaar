const Product = require("../models/product");
const User = require("../models/user");

// Search Products (for Buyers and Manufacturers)
const searchProducts = async (req, res) => {
  const { searchTerm, category } = req.query;

  try {
    const products = await Product.findAll({
      where: {
        [Op.or]: [
          {
            name: {
              [Op.iLike]: `%${searchTerm}%`,
            },
          },
          {
            category: {
              [Op.iLike]: `%${category}%`,
            },
          },
        ],
      },
    });

    if (!products.length) {
      return res.status(404).json({ message: "No products found" });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get Product Details (for Buyers and Manufacturers)
const getProductDetails = async (req, res) => {
  const { productId } = req.params;

  try {
    const product = await Product.findByPk(productId, {
      include: User, // Include the manufacturer details
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Add Product (For Manufacturers Only)
const addProduct = async (req, res) => {
  const { name, price, category, description, images } = req.body;
  const userId = req.user.id; // Assuming the user is authenticated and the ID is available in req.user

  try {
    const newProduct = await Product.create({
      name,
      price,
      category,
      description,
      images,
      user_id: userId,
    });

    res
      .status(201)
      .json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Edit Product (For Manufacturers Only)
const editProduct = async (req, res) => {
  const { productId } = req.params;
  const { name, price, category, description, images } = req.body;
  const userId = req.user.id; // Assuming the user is authenticated

  try {
    const product = await Product.findOne({
      where: { product_id: productId, user_id: userId },
    });

    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found or you're not authorized" });
    }

    // Update product fields
    product.name = name || product.name;
    product.price = price || product.price;
    product.category = category || product.category;
    product.description = description || product.description;
    product.images = images || product.images;

    await product.save();

    res.status(200).json({ message: "Product updated successfully", product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete Product (For Manufacturers Only)
const deleteProduct = async (req, res) => {
  const { productId } = req.params;
  const userId = req.user.id; // Assuming the user is authenticated

  try {
    const product = await Product.findOne({
      where: { product_id: productId, user_id: userId },
    });

    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found or you're not authorized" });
    }

    await product.destroy();

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// View Product (For Buyers Only)
const viewProduct = async (req, res) => {
  const { productId } = req.params;

  try {
    const product = await Product.findByPk(productId, {
      include: User, // Manufacturer details included here
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Add Product to Cart (For Buyers Only)
const addToCart = async (req, res) => {
  const { productId } = req.params;
  const userId = req.user.id; // Assuming the user is authenticated

  try {
    // You can implement a Cart model if needed
    // This is a placeholder for adding product to a cart
    res.status(200).json({
      message: `Product ${productId} added to cart for user ${userId}`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Request Product Details (For Buyers Only)
const requestProductDetails = async (req, res) => {
  const { productId, query } = req.body;
  const userId = req.user.id; // Assuming the user is authenticated

  try {
    // Send query to manufacturer (you can store these in the database or send via email)
    res.status(200).json({
      message: `Query for product ${productId} sent to manufacturer`,
      query,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  searchProducts,
  getProductDetails,
  addProduct,
  editProduct,
  deleteProduct,
  viewProduct,
  addToCart,
  requestProductDetails,
};
