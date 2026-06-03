const Product = require("../models/Product");

let productsCache = null;

const getProducts = async (req, res) => {
  try {
    const { status } = req.query;

    if (!productsCache) {
      productsCache = await Product.find({}).select("-images");
    }

    let filteredProducts = productsCache;
    if (status) {
      filteredProducts = productsCache.filter(p => p.status === status);
    }

    res.status(200).json({
      success: true,
      count: filteredProducts.length,
      data: filteredProducts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const createProduct = async (req, res) => {
  try {
    const {
      productName,
      productType,
      quantityStock,
      mrp,
      sellingPrice,
      brandName,
      productImage,
      images,
      totalImages,
      exchangeEligible,
      status,
    } = req.body;

    if (
      !productName ||
      !productType ||
      quantityStock === undefined ||
      !mrp ||
      !sellingPrice ||
      !brandName
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    if (sellingPrice > mrp) {
      return res.status(400).json({
        success: false,
        message: "Selling price cannot be greater than MRP",
      });
    }

    const product = await Product.create({
      productName,
      productType,
      quantityStock,
      mrp,
      sellingPrice,
      brandName,
      productImage,
      images: images || (productImage ? [productImage] : []),
      totalImages: totalImages !== undefined ? totalImages : (images ? images.length : (productImage ? 1 : 0)),
      exchangeEligible,
      status,
    });

    productsCache = null;

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    productsCache = null;

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    productsCache = null;

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
};