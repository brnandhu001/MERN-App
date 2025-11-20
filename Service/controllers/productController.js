const Product = require("../models/product");

// Create Product
exports.createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// Get All Products
exports.getProducts = async (req, res, next) => {
  try {
    // --- Pagination ---
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // --- Sorting ---
    const sortField = req.query.sort || "createdAt"; // default: newest first
    const sortOrder = req.query.order === "asc" ? 1 : -1; // asc = 1, desc = -1
    const sort = { [sortField]: sortOrder };

    // --- Query Products with pagination + sorting ---
    const products = await Product.find()
      .sort(sort)
      .skip(skip)
      .limit(limit);

    // --- Total count for frontend ---
    const total = await Product.countDocuments();

    res.json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit),
      products,
    });

  } catch (err) {
    next(err);
  }
};


// Get Single Product
exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// Update Product
exports.updateProduct = async (req, res, next) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json({ success: true, updatedProduct });
  } catch (error) {
    next(error);
  }
};

// Delete Product
exports.deleteProduct = async (req, res, next) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Product deleted" });
  } catch (error) {
    next(error);
  }
};
