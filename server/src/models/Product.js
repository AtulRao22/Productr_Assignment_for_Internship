const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
      trim: true,
    },

    productType: {
      type: String,
      required: true,
      enum: [
        "Foods",
        "Electronics",
        "Clothes",
        "Beauty Products",
        "Others",
      ],
    },

    quantityStock: {
      type: Number,
      required: true,
      min: 0,
    },

    mrp: {
      type: Number,
      required: true,
      min: 0,
    },

    sellingPrice: {
      type: Number,
      required: true,
    },

    brandName: {
      type: String,
      required: true,
      trim: true,
    },

    productImage: {
      type: String,
      required: true,
      default: "",
    },

    exchangeEligible: {
      type: Boolean,
      required: true,
    },

    status: {
      type: String,
      enum: ["published", "unpublished"],
      default: "unpublished",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);