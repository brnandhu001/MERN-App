const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
    },
    image: {
      type: String, // Store image URL or filename
      required: false,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
    },
    description: {
      type: String,
      default: "",
    },
    stock: {
      type: Number,
      default: 0,
    }
  },
  { timestamps: true } // adds createdAt and updatedAt
);

module.exports = mongoose.model("Product", productSchema);
